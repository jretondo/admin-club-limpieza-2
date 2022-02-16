import React, { useEffect, useState } from "react";
import axios from 'axios'
import { useActividad } from '../../../Hooks/UseNvaActividad'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Container,
    Row,
    Spinner,
    Col,
    Form,
    FormGroup
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../../api/NodeServer'

import Paginacion from '../../../components/subComponents/Paginacion/Paginacion'
import FilaProducto from '../../../components/subComponents/Listados/SubComponentes/FilaStock'
import ListadoTable from '../../../components/subComponents/Listados/ListadoTable'
import BusquedaForm from '../../../components/subComponents/Productos/BusquedaForm'
import AlertaForm from '../../../components/subComponents/Alertas/Alerta1'

import ConsultaStockForm from '../../../components/subComponents/Stock/ConsultaStock'
import NuevoStock from '../../../components/subComponents/Stock/NuevoStock'

import { UseSecureRoutes } from "Hooks/UseSecureRoutes";

const titulos = ["Producto", "Marca", "Proveedor", "Costo", ""]

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar, setEsperar] = useState(false)

    const [nombreNvo, setNombreNvo] = useState("")
    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [listado, setListado] = useState([])
    const [call, setCall] = useState(false)
    const [pagina, setPagina] = useState(1)
    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)
    const [nvoStockBool, setNvoStockBool] = useState(false)
    const [nvoStock, setNvoStock] = useState(1)
    const [nvoStockArray, setNvoStockArray] = useState([])
    const [nroPvSelect, setNroPvSelect] = useState(0)
    const [esArrayStock, setEsArrayStock] = useState(false)
    const [observaciones, setObservaciones] = useState("")

    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")

    const [dataState, setDataState] = useState([])
    useActividad(
        nvaActCall,
        actividadStr
    )

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        ListarOfertas()
        // eslint-disable-next-line
    }, [call])

    useEffect(() => {
        if (detallesBool) {
            //DetallesProducto()
        }
        // eslint-disable-next-line
    }, [detallesBool])

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.productos,
        call
    )

    const ListarOfertas = async () => {
        setEsperar(true)
        let data = {
            query: ""
        }
        if (busquedaBool) {
            data = {
                query: palabraBuscada
            }
        }
        await axios.get(`${UrlNodeServer.productsDir.products}/${pagina}`, {
            params: data,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const body = res.data.body
                const status = parseInt(res.data.status)
                if (status === 200) {
                    const data = body.data
                    const pagesObj = body.pagesObj

                    let totallista
                    try {
                        totallista = parseInt(pagesObj.totalPag)
                    } catch (error) {
                        totallista = 0
                    }
                    if (totallista === 0) {
                        setListado(
                            <tr style={{ textAlign: "center", width: "100%" }}>
                                <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos cargados</span></td>
                            </tr>
                        )
                    } else {
                        setDataState(pagesObj)
                        setUltimaPag(pagesObj.totalPag)
                        setListado(
                            data.map((item, key) => {
                                return (
                                    <FilaProducto
                                        id={key}
                                        key={key}
                                        item={item}
                                        setDetallesBool={setDetallesBool}
                                        setIdDetalle={setIdDetalle}
                                        setNvoStockBool={setNvoStockBool}
                                        setNombreNvo={setNombreNvo}
                                    />
                                )
                            })
                        )
                    }
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos cargados</span></td>
                        </tr>
                    )
                    setUltimaPag(1)
                }
            })
            .catch(() => {
                setEsperar(false)
                setListado(
                    <tr style={{ textAlign: "center", width: "100%" }}>
                        <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos cargados</span></td>
                    </tr>
                )
                setUltimaPag(1)
            })
    }

    const CancelaNvoOff = (e) => {
        e.preventDefault()
        setNvoStockBool(false)
        setDetallesBool(false)
        ResetStatesForm()
        setCall(!call)
    }

    const ResetStatesForm = () => {
        setNombreNvo("")
        setNvoStock(1)
        setNvoStockArray([])
    }

    const NvoStockForm = async (e) => {
        e.preventDefault()
        setEsperar(true)
        const datos = {
            arrayBool: esArrayStock,
            nvoStockSingle: nvoStock,
            nvoStockVar: nvoStockArray,
            pv: nroPvSelect,
            idProd: idDetalle,
            obs: observaciones
        }
        console.log(`datos`, datos)

        await axios.post(UrlNodeServer.stockDir.stock, datos, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    let cantStock = nvoStock
                    if (esArrayStock) {
                        cantStock = nvoStockArray
                    }

                    setActividadStr("El usuario ha cargado nuevo stock: idProd'" + idDetalle + ", cant.: " + cantStock + "'")
                    setNvaActCall(!nvaActCall)
                    setMsgStrong("Stock cargado con éxito! ")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setNvoStockBool(false)
                    setDetallesBool(false)
                    ResetStatesForm()
                    setCall(!call)
                } else {
                    setMsgStrong("Error inesperado! ")
                    setMsgGralAlert("Intente cargar el stock nuevamente")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setMsgStrong("Error inesperado! ")
                setMsgGralAlert("Intente cargar el stock nuevamente")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const CargarNvoStock = (e) => {
        e.preventDefault()
        setNvoStockBool(true)
        setDetallesBool(false)
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            </div>
        )
    } else if (error) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
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
                                        nvoStockBool ?
                                            { display: "none" } :
                                            { display: "block" }}>
                                    <Col>
                                        <Card className="shadow">
                                            <CardHeader className="border-0">
                                                <Row>
                                                    <Col>
                                                        <h3 className="mb-0">Lista de Productos</h3>
                                                    </Col>
                                                    <Col style={{ textAlign: "right" }}>
                                                        <BusquedaForm
                                                            busquedaBool={busquedaBool}
                                                            setPalabraBuscada={(palabraBuscada) => setPalabraBuscada(palabraBuscada)}
                                                            palabraBuscada={palabraBuscada}
                                                            setBusquedaBool={(busquedaBool) => setBusquedaBool(busquedaBool)}
                                                            call={call}
                                                            setCall={(call) => setCall(call)}
                                                            titulo="Buscar un Producto"
                                                        />
                                                    </Col>
                                                </Row>

                                            </CardHeader>

                                            <ListadoTable
                                                listado={listado}
                                                titulos={titulos}
                                            />
                                            <CardFooter className="py-4">
                                                <Col md="8" style={{ marginTop: "30px" }}>
                                                    <Row>
                                                        <Col md="6" style={{ marginTop: "20px" }}>
                                                            <button
                                                                className="btn btn-primary"
                                                                style={nvoStockBool ? { display: "none" } : { display: "block", }}
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                Listar Stock de Productos
                                                            </button>
                                                        </Col>
                                                        <Col md="6" style={{ textAlign: "left", marginTop: "20px" }}>
                                                            <button
                                                                className="btn btn-primary"
                                                                style={nvoStockBool ? { display: "none", } : { display: "block" }}
                                                                onClick={e => e.preventDefault()}
                                                            >
                                                                Listar Movimientos de Stock
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Paginacion
                                                    setPagina={setPagina}
                                                    setCall={setCall}
                                                    pagina={pagina}
                                                    call={call}
                                                    plantPaginas={plantPaginas}
                                                    ultimaPag={ultimaPag}
                                                    data={dataState}
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
                                        !nvoStockBool ?
                                            { display: "none", marginTop: "25px" } :
                                            { display: "block", marginTop: "25px" }} >
                                    <Col className="order-xl-1" md="12">
                                        <Card className="bg-secondary shadow">
                                            <CardHeader className="bg-white border-0">
                                                <Row className="align-items-center">
                                                    <Col xs="9">
                                                        <h3 className="mb-0">{nombreNvo}</h3>
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
                                                <Form onSubmit={detallesBool ? e => CargarNvoStock(e) : e => NvoStockForm(e)}>
                                                    <Row style={{ marginTop: "15px" }}>
                                                        <Col lg="12" style={{ textAlign: "center" }}>
                                                            <FormGroup>
                                                                {
                                                                    detallesBool ?
                                                                        <ConsultaStockForm
                                                                            idProd={idDetalle}
                                                                            detallesBool={detallesBool}
                                                                            nroPvSelect={nroPvSelect}
                                                                            setNroPvSelect={setNroPvSelect}
                                                                            setEsArrayStock={setEsArrayStock}
                                                                        /> :
                                                                        <NuevoStock
                                                                            idProd={idDetalle}
                                                                            detallesBool={nvoStockBool}
                                                                            setNvoStockArray={setNvoStockArray}
                                                                            nvoStockArray={nvoStockArray}
                                                                            nvoStock={nvoStock}
                                                                            setNvoStock={setNvoStock}
                                                                            roPvSelect={nroPvSelect}
                                                                            setNroPvSelect={setNroPvSelect}
                                                                            setEsArrayStock={setEsArrayStock}
                                                                            observaciones={observaciones}
                                                                            setObservaciones={setObservaciones}
                                                                        />
                                                                }
                                                                <button
                                                                    className="btn btn-warning"
                                                                    type="submit"
                                                                    style={{ marginTop: "100px" }}
                                                                >
                                                                    {
                                                                        detallesBool ?
                                                                            "Cargar Nuevo Stock" :
                                                                            "Agregar Nuevo Stock"
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

export default ProductsItems;
