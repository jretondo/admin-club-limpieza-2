import React, { useState, useEffect } from 'react'

//NPM Modules
import {
    Container,
    Spinner,
    Row,
    Col,
    Card,
    CardHeader,
    CardFooter,
    CardBody,
    Form,
    FormGroup,
    Input,
    Label
} from "reactstrap"
import axios from 'axios'

//Custom Hooks
import { Redirect } from "react-router-dom"
import { useActividad } from '../../../Hooks/UseNvaActividad'

//Links to Server
import UrlNodeServer from '../../../api/NodeServer'

//My modules
import AlertaForm from 'components/subComponents/Alertas/Alerta1'
import Header from "components/Headers/Header.js"
import Paginacion from 'components/subComponents/Paginacion/Paginacion'
import BusquedaForm from 'components/subComponents/Productos/BusquedaForm'
import ListadoTable from 'components/subComponents/Listados/ListadoTable'
import FilaProveedores from 'components/subComponents/Listados/SubComponentes/FilaClientes'
import { UseSecureRoutes } from 'Hooks/UseSecureRoutes'

const titulos = ["Razón Social", "Nº Doc.", "Telefóno", "Email", "Cond. IVA", ""]

const ClientesView = () => {
    //user massages
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)

    //Activities
    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")

    //Loadings 
    const [esperar, setEsperar] = useState(false)

    //Toggles
    const [detallesBool, setDetallesBool] = useState(false)
    const [nvoProveedor, setNvoProveedor] = useState(false)

    //Search word   
    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")

    //lists and UseFetch   
    const [call, setCall] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [ultimaPag, setUltimaPag] = useState(0)
    const [plantPaginas, setPlantPaginas] = useState(<></>)
    const [listado, setListado] = useState([])
    const [dataList, setDataList] = useState([])

    //FormProveedor Basic Info
    const [nvoTipoDoc, setNvoTipoDoc] = useState(0)
    const [nvoDoc, setNvoDoc] = useState("")
    const [nvoRazSoc, setNvoRazSoc] = useState("")
    const [nvoTelefono, setNvoTelefono] = useState("")
    const [nvoEmail, setNvoEmail] = useState("")
    const [nvoCondIva, setNvoCondIva] = useState(0)
    const [idDetalle, setIdDetalle] = useState(0)

    useActividad(
        nvaActCall,
        actividadStr
    )

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.clientes,
        call
    )

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        ListaProveedores()
        // eslint-disable-next-line
    }, [call, pagina])

    useEffect(() => {
        if (detallesBool) {
            DetallesProvFunc()
        }
        // eslint-disable-next-line
    }, [detallesBool])

    const NvoProv = (e) => {
        e.preventDefault()
        setNvoProveedor(true)
    }

    const CancelaNvoProv = (e) => {
        e.preventDefault()
        ResetForm()
        setNvoProveedor(false)
        setDetallesBool(false)
        setCall(!call)
    }

    const NvoProveedorForm = async (e, update) => {
        e.preventDefault()
        setEsperar(true)

        const datos = {
            cuit: nvoTipoDoc,
            ndoc: nvoDoc,
            razsoc: nvoRazSoc,
            telefono: nvoTelefono,
            email: nvoEmail,
            cond_iva: nvoCondIva
        }
        if (update) {
            datos.id = idDetalle
        }
        await axios.post(UrlNodeServer.clientesDir.clientes, datos, {
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
                        setActividadStr("El usuario ha modificado al cliente '" + nvoRazSoc + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Cliente modificado con éxito!")
                    } else {
                        setActividadStr("El usuario ha agregado al cliente '" + nvoRazSoc + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Cliente agregado con éxito!")
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

    const ListaProveedores = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.clientesDir.clientes}/${pagina}`, {
            params: {
                search: palabraBuscada
            },
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body
                    setDataList(body.pagesObj)
                    setUltimaPag(body.pagesObj.totalPag)
                    if (body.pagesObj.totalPag > 0) {
                        setListado(
                            body.data.map((item, key) => {
                                let primero
                                if (key === 0) {
                                    primero = true
                                } else {
                                    primero = false
                                }
                                return (
                                    <FilaProveedores
                                        id={key}
                                        key={key}
                                        item={item}
                                        setActividadStr={setActividadStr}
                                        nvaActCall={nvaActCall}
                                        setNvaActCall={setNvaActCall}
                                        alertar={alertar}
                                        setAlertar={setAlertar}
                                        setMsgStrong={setMsgStrong}
                                        setMsgGralAlert={setMsgGralAlert}
                                        setSuccessAlert={setSuccessAlert}
                                        setCall={setCall}
                                        call={call}
                                        setEsperar={setEsperar}
                                        setDetallesBool={setDetallesBool}
                                        setIdDetalle={setIdDetalle}
                                        primero={primero}
                                        pagina={pagina}
                                        setPagina={setPagina}
                                    />
                                )
                            })
                        )
                    } else {
                        setUltimaPag(1)
                        setListado(
                            <tr style={{ textAlign: "center", width: "100%" }}>
                                <td>
                                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                                </td>
                            </tr>
                        )
                    }
                } else {
                    setUltimaPag(1)
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                            </td>
                        </tr>
                    )
                }
            })
            .catch(() => {
                setEsperar(false)
                setUltimaPag(1)
                setListado(
                    <tr style={{ textAlign: "center", width: "100%" }}>
                        <td>
                            <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                        </td>
                    </tr>
                )
            })
    }

    const DetallesProvFunc = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.clientesDir.sub.details}/${idDetalle}`, {
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
    }


    if (error) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            </div>
        )
    } else {
        return (
            <>
                <AlertaForm
                    success={successAlert}
                    msgStrong={msgStrongAlert}
                    msgGral={msgGralAlert}
                    alertar={alertar}
                />
                <Header />
                <Container className="mt--7" fluid>
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            <>
                                <Row style={
                                    detallesBool ?
                                        { display: "none" } :
                                        nvoProveedor ?
                                            { display: "none" } :
                                            { display: "block" }}>
                                    <Col>
                                        <Card className="shadow">
                                            <CardHeader className="border-0">
                                                <Row>
                                                    <Col md="4" >
                                                        <h2 className="mb-0">Lista de Clientes</h2>
                                                    </Col>
                                                    <Col md="8" style={{ textAlign: "right" }}>
                                                        <BusquedaForm
                                                            busquedaBool={busquedaBool}
                                                            setPalabraBuscada={setPalabraBuscada}
                                                            palabraBuscada={palabraBuscada}
                                                            setBusquedaBool={setBusquedaBool}
                                                            call={call}
                                                            setCall={setCall}
                                                            titulo="Buscar un Cliente"
                                                        />
                                                    </Col>
                                                </Row>

                                            </CardHeader>

                                            <ListadoTable
                                                listado={listado}
                                                titulos={titulos}
                                            />
                                            <CardFooter className="py-4">
                                                <nav aria-label="..." style={{ marginBottom: "20px" }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={nvoProveedor ? { display: "none" } : { display: "block" }}
                                                        onClick={e => NvoProv(e)}
                                                    >
                                                        Nuevo Cliente
                                                    </button>
                                                </nav>
                                                <Paginacion
                                                    setPagina={setPagina}
                                                    setCall={setCall}
                                                    pagina={pagina}
                                                    call={call}
                                                    plantPaginas={plantPaginas}
                                                    ultimaPag={ultimaPag}
                                                    data={dataList}
                                                    setPlantPaginas={setPlantPaginas}
                                                    setUltimaPag={setUltimaPag}
                                                />
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={
                                    detallesBool ?
                                        { display: "block", marginTop: "25px" } :
                                        !nvoProveedor ?
                                            { display: "none", marginTop: "25px" } :
                                            { display: "block", marginTop: "25px" }} >
                                    <Col className="order-xl-1" md="12">
                                        <Card className="bg-secondary shadow">
                                            <CardHeader className="bg-white border-0">
                                                <Row className="align-items-center">
                                                    <Col xs="9">
                                                        {
                                                            detallesBool ?
                                                                <h3 className="mb-0">{nvoRazSoc}</h3> :
                                                                <h3 className="mb-0">Nuevo Cliente</h3>
                                                        }

                                                    </Col>
                                                    <Col xs="3" style={{ textAlign: "right" }}>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={e => CancelaNvoProv(e)}
                                                        > x
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                            <CardBody>
                                                <Form onSubmit={detallesBool ? e => NvoProveedorForm(e, true) : e => NvoProveedorForm(e)}>
                                                    <h6 className="heading-small text-muted mb-4">
                                                        Información del Cliente
                                                    </h6>
                                                    <Row>
                                                        <Col lg="12">
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
                                                    </Row>
                                                    <Row>
                                                        <Col lg="2">
                                                            <FormGroup>
                                                                <Label for="exampleSelect">Tipo. Doc.</Label>
                                                                <Input type="select" onChange={e => setNvoTipoDoc(e.target.value)}>
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
                                                                        nvoTipoDoc === 0 ?
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
                                                                            "Agregar Nuevo Cliente"
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
                            </>
                    }
                </Container>
            </>
        )
    }
}

export default ClientesView