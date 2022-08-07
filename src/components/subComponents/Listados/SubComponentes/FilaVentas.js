import CompleteCerosLeft from '../../../../Function/CompleteCeroLeft';
import formatMoney from 'Function/NumberFormat';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Spinner, UncontrolledDropdown, Button, Tooltip } from 'reactstrap';
import { BsFileEarmarkPdfFill, BsTelegram, BsFillXCircleFill } from "react-icons/bs";
import { FiRefreshCcw } from 'react-icons/fi';
import { MdOutlineFreeCancellation } from 'react-icons/md';
import axios from 'axios';
import UrlNodeServer from '../../../../api/NodeServer';
import swal from 'sweetalert';
import { validateEmail } from 'Function/emailValidator';
import FileSaver from 'file-saver';
import ModalChangeType from './ModalChangeType';
import ModalDevPart from './ModalDevPart';

const FilaVentas = ({
    id,
    item,
    pagina,
    setPagina,
    setActualizar,
    actualizar
}) => {

    const [wait, setWait] = useState(false)
    const [comprobante, setComprobante] = useState({
        pv: "00000",
        cbte: "00000000"
    })
    const [tooltp, setTooltp] = useState(false)
    const [modal1, setModal1] = useState(false)
    const [modal2, setModal2] = useState(false)

    const getFact = async (idFact, send, type) => {
        console.log('type :>> ', type);
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
            let urlGet = UrlNodeServer.invoicesDir.sub.factDataPDF
            if (type === -1) {
                urlGet = UrlNodeServer.clientesDir.sub.payments
            }
            setWait(true)
            await axios.get(urlGet + "/" + idFact + query, {
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
                    setActualizar(!actualizar)
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

    const cambiarFormaPago = (e, item) => {
        e.preventDefault()
        setModal1(true)
    }

    const toggleToolTip = () => {
        setTooltp(!tooltp)
    }

    useEffect(() => {
        completarCeros()
        // eslint-disable-next-line
    }, [item.pv, item.cbte])

    return (
        <tr key={id} style={parseInt(item.id_fact_asoc) !== 0 ? { background: "#e8e8e8" } : {}}>
            <td style={{ textAlign: "center" }}>
                {moment(item.create_time).format("DD/MM/YYYY HH:mm") + " hs"}
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
                                    parseInt(item.forma_pago) === 6 ? "Cheque" :
                                        parseInt(item.forma_pago) === 7 ? "Transferencia" :
                                            "Varios Métodos"
                }
                <Button disabled={parseFloat(item.total_fact) < 0 || parseInt(item.forma_pago) === 5} style={{ borderRadius: "10%", marginInline: "10px" }} color={"info"} id={`buttonChange-${item.id}`}
                    onClick={e => cambiarFormaPago(e, item)}
                >
                    <FiRefreshCcw />
                </Button>
                <Tooltip placement="right" isOpen={tooltp} target={`buttonChange-${item.id}`} toggle={toggleToolTip}>
                    Cambiar Forma de Pago
                </Tooltip>
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
                                        getFact(item.id, false, parseFloat(item.t_fact))
                                    }}
                                >
                                    <BsFileEarmarkPdfFill />
                                    Ver Factura
                                </DropdownItem>
                                <DropdownItem
                                    href="#pablo"
                                    onClick={e => {
                                        e.preventDefault(e)
                                        setModal2(true)
                                    }}
                                    disabled={(parseFloat(item.total_fact) < 0 || parseInt(item.t_fact) < 0) ? true : false}
                                >
                                    <MdOutlineFreeCancellation />
                                    Devolución Parcial
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
                                    disabled={(parseFloat(item.total_fact) < 0 || parseInt(item.t_fact) < 0) ? true : false}
                                >
                                    <BsFillXCircleFill />
                                    Cancelar Factura
                                </DropdownItem>
                                {
                                    parseInt(item.id_fact_asoc) !== 0 ?
                                        <DropdownItem
                                            href="#pablo"
                                            onClick={e => {
                                                e.preventDefault(e)
                                                getFact(item.id_fact_asoc, false)
                                            }}
                                        >
                                            <BsFileEarmarkPdfFill />
                                            {parseInt(item.nota_cred) === 0 ? "Ver Nota de Crédito" : "Ver Factura Anulada"}
                                        </DropdownItem>
                                        : null
                                }
                            </DropdownMenu>
                        </UncontrolledDropdown>
                }

            </td>
            <ModalChangeType
                setModal={setModal1}
                modal={modal1}
                item={item}
                pagina={pagina}
                setPagina={setPagina}
            />
            <ModalDevPart
                modal={modal2}
                toggle={() => setModal2(!modal2)}
                idFact={item.id}
            />
        </tr>
    )
}

export default FilaVentas