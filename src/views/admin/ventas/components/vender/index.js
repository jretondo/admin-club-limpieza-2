import React, { useState, useContext } from "react";
import UrlNodeServer from '../../../../../api/NodeServer'
import {
    Card,
    CardBody,
    Col,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner
} from "reactstrap";
import './styles.css'
import InvoiceHeader from "./header";
import ProductFinder from "./productFinder";
import ProdListSell from "./list/prodListSell";
import productsSellContext from '../../../../../context/productsSell';
import formatMoney from "Function/NumberFormat";
import swal from "sweetalert";
import moment from "moment";
import axios from "axios";
import FileSaver from 'file-saver'

const Ventas = () => {
    const [clienteBool, setClienteBool] = useState(0)
    const [factFiscBool, setFactFiscBool] = useState(0)
    const [tipoDoc, setTipoDoc] = useState(80)
    const [ptoVta, setPtoVta] = useState({ id: 0 })
    const [envioEmailBool, setEnvioEmailBool] = useState(0)
    const [emailCliente, setEmailCliente] = useState("")
    const [ndoc, setNdoc] = useState("")
    const [razSoc, setRazSoc] = useState("")

    const [formaPago, setFormaPago] = useState(0)
    const [invalidNdoc, setInvalidNdoc] = useState(false)
    const [tfact, setTfact] = useState(1)
    const [condIvaCli, setCondIvaCli] = useState(0)
    const [processing, setProcessing] = useState(false)

    const { totalPrecio, cancelarCompra, productsSellList } = useContext(productsSellContext)

    const cancelar = () => {
        swal({
            title: "¿Está seguro de canelar la compra?",
            text: "Esta desición elimibará todos los productos cargados en el carrito de compras.",
            icon: "warning",
            dangerMode: true,
            buttons: ["Cancelar", "Vacíar Carrito"],
        })
            .then((willDelete) => {
                if (willDelete) {
                    setClienteBool(false)
                    setEnvioEmailBool(false)
                    cancelarCompra()
                }
            });
    }

    const generarFactura = async () => {
        const data = {
            dataFact: {
                fecha: moment(new Date()).format("YYYY-MM-DD"),
                pv_id: ptoVta.id,
                fiscal: factFiscBool,
                forma_pago: formaPago,
                cond_iva: condIvaCli,
                enviar_email: envioEmailBool,
                cliente_email: emailCliente,
                cliente_bool: parseInt(clienteBool),
                cliente_tdoc: parseInt(clienteBool) === 0 ? 99 : tipoDoc,
                cliente_ndoc: ndoc,
                cliente_name: razSoc,
                lista_prod: productsSellList
            }
        }
        setProcessing(true)
        await axios.post(UrlNodeServer.invoicesDir.invoices, data, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                Accept: 'application/pdf',
            }
        })
            .then(res => {
                let headerLine = res.headers['content-disposition'];
                console.log('headerLine :>> ', headerLine);
                const largo = parseInt(headerLine.length)
                let filename = headerLine.substring(21, largo);
                var blob = new Blob([res.data], { type: "application/pdf" });
                FileSaver.saveAs(blob, filename);
                setProcessing(false)
                cancelarCompra()
                if (envioEmailBool) {
                    swal("Nueva Factura!", "La factura se ha generado con éxito y pronto le llegará al cliente por email!", "success");
                } else {
                    swal("Nueva Factura!", "La factura se ha generado con éxito!", "success");
                }
            })
            .catch((err) => {
                console.log('object :>> ', err);
                setProcessing(false)
                swal("Error inesperado!", "La factura no se pudo generar por un error en los datos! Controle que no falten datos importantes en la cabecera", "error");
            })
    }

    return (
        <Card >
            <CardBody>

                {
                    processing ?
                        <div style={{ textAlign: "center" }}>
                            <h2 style={{ color: "green" }}>Procesando Factura...</h2>
                            <Spinner type="grow" color="light" style={{ width: "250px", height: "250px" }} /> </div> :
                        <>
                            <InvoiceHeader
                                setPtoVta={setPtoVta}
                                setFactFiscBool={setFactFiscBool}
                                setClienteBool={setClienteBool}
                                setTipoDoc={setTipoDoc}
                                setNdoc={setNdoc}
                                setRazSoc={setRazSoc}
                                setEmailCliente={setEmailCliente}
                                setEnvioEmailBool={setEnvioEmailBool}
                                setFormaPago={setFormaPago}
                                factFiscBool={factFiscBool}
                                clienteBool={clienteBool}
                                tipoDoc={tipoDoc}
                                ndoc={ndoc}
                                razSoc={razSoc}
                                formaPago={formaPago}
                                envioEmailBool={envioEmailBool}
                                emailCliente={emailCliente}
                                ptoVta={ptoVta}
                                invalidNdoc={invalidNdoc}
                                setInvalidNdoc={setInvalidNdoc}
                                tfact={tfact}
                                setTfact={setTfact}
                                setCondIvaCli={setCondIvaCli}
                            />

                            <br />

                            <ProductFinder />

                            <ProdListSell />

                            <Row style={{ marginTop: "25px" }}>
                                <Col md="2" style={{ marginLeft: "auto", textAlign: "right" }}>
                                    <Label style={{ fontSize: "25px", fontWeight: "bold" }} >
                                        Total:
                                    </Label>
                                </Col>
                                <Col md="3" >
                                    <FormGroup>
                                        <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" value={"$ " + formatMoney(totalPrecio)} disabled />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: "25px" }}>
                                <Col>
                                    <button
                                        className="btn btn-primary"
                                        style={{ margin: "15px", width: "200px" }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            generarFactura()
                                        }}>
                                        Confirmar Compra
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        style={{ margin: "15px", width: "200px" }}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            cancelar()
                                        }}>
                                        Cancelar
                                    </button>
                                </Col>
                            </Row>
                        </>
                }
            </CardBody>
        </Card>)


}

export default Ventas;
