import CompleteCerosLeft from '../../../../Function/CompleteCeroLeft';
import formatMoney from 'Function/NumberFormat';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Spinner, UncontrolledDropdown } from 'reactstrap';
import { BsFileEarmarkPdfFill, BsTelegram, BsFillXCircleFill } from "react-icons/bs";
import axios from 'axios';
import UrlNodeServer from '../../../../api/NodeServer';
import swal from 'sweetalert';
import { validateEmail } from 'Function/emailValidator';
import FileSaver from 'file-saver';

const FilaVentas = ({
    id,
    item
}) => {
    const [wait, setWait] = useState(false)
    const [comprobante, setComprobante] = useState({
        pv: "00000",
        cbte: "00000000"
    })

    const getFact = async (idFact, send) => {
        let query = ""
        let seguir = true
        if (send) {
            query = await swal({
                text: "Email a enviar la factura:",
                content: "input",
            })
                .then((email) => {
                    if (validateEmail(email)) {
                        return `?sendEmail=true&email=${email}`
                    } else {
                        swal("No válido!", "El email que colocó no es valido! Intentelo nuevamente.", "error");
                        seguir = false
                    }
                });
        }

        if (seguir) {
            setWait(true)
            await axios.get(UrlNodeServer.invoicesDir.sub.factDataPDF + "/" + idFact + query, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                    Accept: 'application/pdf',
                }
            })
                .then(res => {
                    let headerLine = res.headers['content-disposition'];
                    const largo = parseInt(headerLine.length)
                    let filename = headerLine.substring(21, largo);
                    var blob = new Blob([res.data], { type: "application/pdf" });
                    FileSaver.saveAs(blob, filename);
                    setWait(false)
                    if (send) {
                        swal("Envío de factura", "Factura envíada con éxito!", "success");
                    } else {
                        swal("Reimpresión de factura", "Factura reimpresa con éxito!", "success");
                    }
                })
                .catch(error => {
                    setWait(false)
                    if (send) {
                        swal("Envío de factura", "Hubo un error al querer envíar la factura!", "error");
                    } else {
                        swal("Reimpresión de factura", "Hubo un error al querer reimprimir la factura!", "error");
                    }
                })
        }
    }

    const anularFact = async (idFact) => {
        let seguir = false
        const data = {
            id: idFact,
            fecha: moment(new Date()).format("YYYY-MM-DD")
        }
        seguir = await swal({
            title: "¿Está seguro de eliminar la factura?",
            text: "Esta operación no tiene retroceso y resta del total del listado.",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    return true
                }
            });

        if (seguir) {
            setWait(true)
            await axios.post(UrlNodeServer.invoicesDir.sub.notaCred, data, {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                    Accept: 'application/pdf',
                }
            })
                .then(res => {
                    let headerLine = res.headers['content-disposition'];
                    const largo = parseInt(headerLine.length)
                    let filename = headerLine.substring(21, largo);
                    var blob = new Blob([res.data], { type: "application/pdf" });
                    FileSaver.saveAs(blob, filename);
                    setWait(false)
                    swal("Anulación de Factura", "La factura ha sido eliminada con éxito!", "success");
                })
                .catch(error => {
                    setWait(false)
                    swal("Anulación de Factura", `Hubo un error al querer anular la factura! \n\r Error: ${error}`, "error")
                })
        }
    }

    const completarCeros = () => {
        const pvStr = CompleteCerosLeft(item.pv, 5)
        const cbteStr = CompleteCerosLeft(item.cbte, 8)

        setComprobante({
            pv: pvStr,
            cbte: cbteStr
        })
    }

    useEffect(() => {
        completarCeros()
        // eslint-disable-next-line
    }, [item.pv, item.cbte])

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha).format("DD/MM/YYYY")}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.raz_soc_cliente === "" ? "Consumidor Final" : item.raz_soc_cliente} {parseInt(item.tipo_doc_cliente) === 80 ? "(CUIT: " + item.n_doc_cliente + ")" : parseInt(item.tipo_doc_cliente) === 96 ? "(DNI: " + item.n_doc_cliente + ")" : ""}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.letra} {comprobante.pv} - {comprobante.cbte}
            </td>
            <td style={{ textAlign: "center" }}>
                {parseInt(item.forma_pago) === 0 ? "Efectivo" :
                    parseInt(item.forma_pago) === 1 ? "Mercado Pago" :
                        parseInt(item.forma_pago) === 2 ? "Débito" :
                            parseInt(item.forma_pago) === 3 ? "Crédito" :
                                parseInt(item.forma_pago) === 4 ? "Cuenta Corriente" :
                                    "Transferencia"
                }
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.total_fact)}
            </td>
            <td className="text-right">
                {
                    wait ?
                        <div style={{ textAlign: "center" }}  >
                            <Spinner type="border" color="blue" style={{ width: "1rem", height: "1rem" }} /> </div>
                        :
                        <UncontrolledDropdown>
                            <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={e => e.preventDefault()}
                            >
                                <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => {
                                        e.preventDefault(e)
                                        getFact(item.id, false)
                                    }}
                                >
                                    <BsFileEarmarkPdfFill />
                                    Ver Factura
                                </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => {
                                        e.preventDefault(e)
                                        getFact(item.id, true)
                                    }}
                                >
                                    <BsTelegram />
                                    Envíar Factura
                                </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => {
                                        e.preventDefault(e)
                                        anularFact(item.id)
                                    }}
                                >
                                    <BsFillXCircleFill />
                                    Cancelar Factura
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                }

            </td>
        </tr>
    )
}

export default FilaVentas