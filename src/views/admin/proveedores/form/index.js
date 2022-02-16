import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap"
const FormProv = ({
    detallesBool,
    idDetalle,
    setEsperar,
    setActividadStr,
    setNvaActCall,
    nvaActCall,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setAlertar,
    alertar,
    nvoProveedor
}) => {
    const [nvoTipoDoc, setNvoTipoDoc] = useState(0)
    const [nvoDoc, setNvoDoc] = useState("")
    const [nvoRazSoc, setNvoRazSoc] = useState("")
    const [nvoTelefono, setNvoTelefono] = useState("")
    const [nvoEmail, setNvoEmail] = useState("")
    const [nvoCondIva, setNvoCondIva] = useState(0)
    const [fantasia, setFantasia] = useState("")
    const [obs, setObs] = useState("")

    useEffect(() => {
        if (detallesBool) {
            DetallesProvFunc()
        }
        // eslint-disable-next-line
    }, [detallesBool])

    useEffect(() => {
        ResetForm()
    }, [nvoProveedor])

    const NvoProveedorForm = async (e, update) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            cuit: nvoTipoDoc,
            ndoc: nvoDoc,
            razsoc: nvoRazSoc,
            telefono: nvoTelefono,
            email: nvoEmail,
            cond_iva: nvoCondIva,
            fantasia: fantasia,
            obs: obs,
            keyword: nvoDoc + " " + nvoRazSoc + " " + fantasia + " " + obs
        }

        if (update) {
            datos.id = idDetalle
        }

        await axios.post(UrlNodeServer.proveedoresDir.proveedores, datos, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    if (update) {
                        setActividadStr("El usuario ha modificado el proveedor '" + nvoRazSoc + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Proveedor modificado con éxito!")
                    } else {
                        setActividadStr("El usuario ha agregado el proveedor '" + nvoRazSoc + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Proveedor agregado con éxito!")
                    }
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    ResetForm()
                } else {
                    setMsgStrong("hubo un error! ")
                    setMsgGralAlert("intente nuevamente")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("hubo un error! ")
                setMsgGralAlert("intente nuevamente")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const DetallesProvFunc = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.proveedoresDir.sub.details}/${idDetalle}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body[0]
                    setNvoTipoDoc(body.cuit)
                    setNvoDoc(body.ndoc)
                    setNvoRazSoc(body.razsoc)
                    setNvoTelefono(body.telefono)
                    setNvoEmail(body.email)
                    setNvoCondIva(body.cond_iva)
                } else {
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("Intente nuevamenete")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("Hubo un error! ")
                setMsgGralAlert("Intente nuevamenete")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const ResetForm = () => {
        setNvoDoc("")
        setNvoTipoDoc(0)
        setNvoRazSoc("")
        setNvoCondIva(0)
        setNvoEmail("")
        setNvoTelefono("")
        setFantasia("")
        setObs("")
    }

    return (
        <Form onSubmit={detallesBool ? e => NvoProveedorForm(e, true) : e => NvoProveedorForm(e)}>
            <h6 className="heading-small text-muted mb-4">
                Información del Proveedor
            </h6>
            <Row>
                <Col lg="8">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Razón Social
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Razón Social..."
                            type="text"
                            value={nvoRazSoc}
                            onChange={e => setNvoRazSoc(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="4">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Nombre de Fantasia
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Nombre de Fantasia..."
                            type="text"
                            value={fantasia}
                            onChange={e => setFantasia(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="2">
                    <FormGroup>
                        <Label for="exampleSelect">Tipo. Doc.</Label>
                        <Input type="select" onChange={e => setNvoTipoDoc(e.target.value)} value={nvoTipoDoc}>
                            <option value={0}>CUIT</option>
                            <option value={1}>DNI</option>
                        </Input>
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Nº Documento
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder={
                                parseInt(nvoTipoDoc) === 0 ?
                                    "Nº de CUIT" :
                                    "Nº de DNI"
                            }
                            type="text"
                            value={nvoDoc}
                            onChange={e => setNvoDoc(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="4">
                    <FormGroup>
                        <Label for="exampleSelect">Cond. IVA</Label>
                        <Input type="select" onChange={e => setNvoCondIva(e.target.value)}>
                            <option value={0}>Cons. Final</option>
                            <option value={1}>Res. Inscripto</option>
                            <option value={2}>Monotributista</option>
                        </Input>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="8">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Email
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Casilla de email..."
                            type="email"
                            value={nvoEmail}
                            onChange={e => setNvoEmail(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="4">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Telefóno
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Telefóno..."
                            type="text"
                            value={nvoTelefono}
                            onChange={e => setNvoTelefono(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="12">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-username"
                        >
                            Observaciones
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-username"
                            placeholder="Observaciones..."
                            type="textarea"
                            value={obs}
                            onChange={e => setObs(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
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
                                    "Agregar Nuevo Proveedor"
                            }
                        </button>
                    </FormGroup>
                </Col>
            </Row>
        </Form>
    )
}

export default FormProv