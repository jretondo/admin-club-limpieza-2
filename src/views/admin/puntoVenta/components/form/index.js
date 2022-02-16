import UrlNodeServer from '../../../../../api/NodeServer'
import React, { useState, useEffect } from 'react'
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Row,
    Spinner
} from 'reactstrap'
import axios from 'axios'
import moment from 'moment'
import FormDataComp from './components/formData'

const FormPtosVta = ({
    detallesBool,
    idDetalle,
    call,
    setCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setDetallesBool,
    setNvaOffer,
    nvaOffer
}) => {
    const [esperar, setEsperar] = useState(false)
    const [ptoVta, setPtoVta] = useState("")
    const [cuit, setCuit] = useState("")
    const [razSoc, setRazSoc] = useState("")
    const [direcciones, setDirecciones] = useState("")
    const [iibb, setIibb] = useState("")
    const [condIva, setCondIva] = useState(0)
    const [iniAct, setIniAct] = useState("")
    const [categoria, setCategoria] = useState(0)
    const [urlCrt, setUrlCrt] = useState("")
    const [urlKey, setUrlKey] = useState("")
    const [certificado, setCertificado] = useState("")
    const [llave, setLlave] = useState("")
    const [nvoCert, setNvoCert] = useState(false)
    const [nvoKey, setNvoKey] = useState(false)

    useEffect(() => {
        if (detallesBool) {
            DetallesProducto()
        }
        // eslint-disable-next-line
    }, [detallesBool])

    const NvoPV = async (e, modificar) => {
        e.preventDefault()
        setEsperar(true)
        const dataForm = new FormData();

        if (modificar) {
            if (nvoCert) {
                dataForm.append("cert", certificado, cuit + "-" + ptoVta + ".crt");
            }
            if (nvoKey) {
                dataForm.append("key", llave, cuit + "-" + ptoVta + ".key");
            }
        } else {
            dataForm.append("cert", certificado, cuit + "-" + ptoVta + ".crt");
            dataForm.append("key", llave, cuit + "-" + ptoVta + ".key");
        }
        dataForm.append("cuit", cuit);
        dataForm.append("raz_soc", razSoc);
        dataForm.append("ini_act", iniAct);
        dataForm.append("pv", ptoVta);
        dataForm.append("direccion", direcciones);
        dataForm.append("iibb", iibb);
        dataForm.append("cond_iva", condIva);
        dataForm.append("cat_mono", categoria);

        if (modificar) {
            dataForm.append("id", idDetalle);
        }

        await fetch(UrlNodeServer.ptosVtaDir.ptosVta, {
            method: 'POST',
            body: dataForm,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(response => response.json())
            .then(result => {
                setEsperar(false)
                const status = parseInt(result.status)
                if (status === 200) {
                    ResetStatesForm()
                    setMsgStrong("Agregado con éxito! ")
                    setMsgGralAlert("Certificados subido correctamente")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setNvaOffer(false)
                    setDetallesBool(false)
                    setCall(!call)
                } else {
                    setMsgStrong("Hubo un error inesperado! ")
                    setMsgGralAlert("Intente nuevamente")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }

            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("Hubo un error inesperado! ")
                setMsgGralAlert("Intente nuevamente")
                setSuccessAlert(true)
                setAlertar(!alertar)
            });
    }

    const DetallesProducto = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.ptosVtaDir.sub.details}/${idDetalle}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body[0]
                    setCuit(resultado.cuit)
                    setRazSoc(resultado.raz_soc)
                    setPtoVta(resultado.pv)
                    setIniAct(moment(resultado.ini_act).format("YYYY-MM-DD"))
                    setDirecciones(resultado.direccion)
                    setCondIva(resultado.cond_iva)
                    setCategoria(resultado.cat_mono)
                    setIibb(resultado.iibb)
                    setNvoCert(false)
                    setNvoKey(false)
                    setUrlCrt(resultado.cert_file)
                    setUrlKey(resultado.key_file)
                } else {
                    setEsperar(false)
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("No se pudo cargar el nuevo punto de venta. Intente nuevamente")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                }
            })
    }

    const CancelaNvoOff = (e) => {
        e.preventDefault()
        setNvaOffer(false)
        setDetallesBool(false)
        ResetStatesForm()
        setCall(!call)
    }

    const ResetStatesForm = () => {
        setCuit("")
        setNvoKey(false)
        setNvoCert(false)
        setRazSoc("")
        setIniAct("")
        setPtoVta("")
        setDirecciones("")
        setIibb("")
        setUrlCrt("")
        setUrlKey("")
    }

    return (
        <Row style={
            detallesBool ?
                { display: "block", marginTop: "25px" } :
                !nvaOffer ?
                    { display: "none", marginTop: "25px" } :
                    { display: "block", marginTop: "25px" }} >
            <Col className="order-xl-1" md="12">
                <Card className="bg-secondary shadow">
                    <CardHeader className="bg-white border-0">
                        <Row className="align-items-center">
                            <Col xs="9">
                                {
                                    detallesBool ?
                                        <h3 className="mb-0">Modificar Punto de Venta</h3> :
                                        <h3 className="mb-0">Nuevo Punto de Venta</h3>
                                }

                            </Col>
                            <Col xs="3" style={{ textAlign: "right" }}>
                                <button
                                    className="btn btn-danger"
                                    onClick={e => CancelaNvoOff(e)}
                                > x
                                </button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody>
                        <Form onSubmit={detallesBool ? e => NvoPV(e, true) : e => NvoPV(e)}>
                            <h6 className="heading-small text-muted mb-4">
                                Información del Punto de Venta
                            </h6>
                            {
                                esperar ?
                                    <div style={{ textAlign: "center", marginTop: "100px" }}>
                                        <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                                    <FormDataComp
                                        cuit={cuit}
                                        setCuit={setCuit}
                                        razSoc={razSoc}
                                        setRazSoc={setRazSoc}
                                        detallesBool={detallesBool}
                                        ptoVta={ptoVta}
                                        setPtoVta={setPtoVta}
                                        iniAct={iniAct}
                                        setIniAct={setIniAct}
                                        direcciones={direcciones}
                                        setDirecciones={setDirecciones}
                                        iibb={iibb}
                                        setIibb={setIibb}
                                        condIva={condIva}
                                        categoria={categoria}
                                        setCategoria={setCategoria}
                                        urlCrt={urlCrt}
                                        urlKey={urlKey}
                                        setUrlCrt={setUrlCrt}
                                        setCertificado={setCertificado}
                                        setNvoCert={setNvoCert}
                                        setUrlKey={setUrlKey}
                                        setLlave={setLlave}
                                        setNvoKey={setNvoKey}
                                        setCondIva={setCondIva}
                                    />
                            }

                            <Row style={{ marginTop: "15px" }}>
                                <Col lg="12" style={{ textAlign: "center" }}>
                                    <FormGroup>
                                        <button
                                            className="btn btn-warning"
                                            type="submit"
                                        >
                                            {
                                                detallesBool ?
                                                    "Aplicar Cambios" :
                                                    "Agregar Nuevo Punto de Venta"
                                            }
                                        </button>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    )
}

export default FormPtosVta