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
    CardBody
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
import FilaProveedores from 'components/subComponents/Listados/SubComponentes/FilaProveedores'
import { UseSecureRoutes } from 'Hooks/UseSecureRoutes'
import FormComp from './form'

const titulos = ["Razón Social", "Nº Doc.", "Telefóno", "Email", "Cond. IVA", ""]

const ProveedoresView = () => {
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
    const [idDetalle, setIdDetalle] = useState(0)


    //Custom Hooks   
    useActividad(
        nvaActCall,
        actividadStr
    )

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.proveedores,
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

    const NvoProv = (e) => {
        e.preventDefault()
        setNvoProveedor(true)
    }

    const CancelaNvoProv = (e) => {
        e.preventDefault()
        setNvoProveedor(false)
        setDetallesBool(false)
        setCall(!call)
    }


    const ListaProveedores = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.proveedoresDir.proveedores}/${pagina}`, {
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
                    if (parseInt(body.pagesObj.totalPag) > 0) {
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
                                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay proveedores cargados</span>
                                </td>
                            </tr>
                        )
                    }
                } else {
                    setUltimaPag(1)
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay proveedores cargados</span>
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
                            <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay proveedores cargados</span>
                        </td>
                    </tr>
                )
            })
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
                                                        <h2 className="mb-0">Lista de Proveedores</h2>
                                                    </Col>
                                                    <Col md="8" style={{ textAlign: "right" }}>
                                                        <BusquedaForm
                                                            busquedaBool={busquedaBool}
                                                            setPalabraBuscada={setPalabraBuscada}
                                                            palabraBuscada={palabraBuscada}
                                                            setBusquedaBool={setBusquedaBool}
                                                            call={call}
                                                            setCall={setCall}
                                                            titulo="Buscar un Proveedor"
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
                                                        Nuevo Proveedor
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
                                                                <h3 className="mb-0">{""}</h3> :
                                                                <h3 className="mb-0">Nuevo Proveedor</h3>
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
                                                <FormComp
                                                    detallesBool={detallesBool}
                                                    idDetalle={idDetalle}
                                                    setEsperar={setEsperar}
                                                    setActividadStr={setActividadStr}
                                                    setNvaActCall={setNvaActCall}
                                                    nvaActCall={nvaActCall}
                                                    setMsgStrong={setMsgStrong}
                                                    setMsgGralAlert={setMsgGralAlert}
                                                    setSuccessAlert={setSuccessAlert}
                                                    setAlertar={setAlertar}
                                                    alertar={alertar}
                                                    nvoProveedor={nvoProveedor}
                                                />
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

export default ProveedoresView