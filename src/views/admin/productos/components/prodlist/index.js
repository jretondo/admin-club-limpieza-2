import React, { useState, useEffect } from 'react'
import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import Paginacion from 'components/subComponents/Paginacion/Paginacion';
import BusquedaProdForm from 'components/subComponents/Productos/BusquedaForm';
import { Card, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import UrlNodeServer from '../../../../../api/NodeServer';
import axios from 'axios';
import FilaProducto from 'components/subComponents/Listados/SubComponentes/FilaProducto';
import Spinner from 'reactstrap/lib/Spinner';

const titulos = ["Producto", "Proveedor", "Marca", "Costo s/IVA", "Costo c/IVA", "% Gan.", ""]

const ProdList = ({
    detallesBool,
    nvaOffer,
    setNvaOffer,
    call,
    setCall,
    ResetStatesForm,
    setActividadStr,
    nvaActCall,
    setNvaActCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setDetallesBool,
    setIdDetalle,
    setCopiarDet,
    busquedaBool,
    setBusquedaBool,
    palabraBuscada,
    setPalabraBuscada,
    pagina,
    setPagina
}) => {

    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [listado, setListado] = useState([])
    const [dataState, setDataState] = useState([])
    const [esperar, setEsperar] = useState(false)
    const [varCostoBool, setVarCostoBool] = useState(false)
    const [aumento, setAumento] = useState(true)
    const [porc, setPorc] = useState("")
    const [round, setRound] = useState(false)
    const [roundBool, setRoundBool] = useState(false)

    useEffect(() => {
        ListarProductos()
        // eslint-disable-next-line 
    }, [])

    useEffect(() => {
        ListarProductos()
        // eslint-disable-next-line 
    }, [call, pagina])

    useEffect(() => {
        if (!detallesBool) {
            ListarProductos()
        }
        // eslint-disable-next-line 
    }, [detallesBool])

    useEffect(() => {
        if (!nvaOffer) {
            ListarProductos()
        }
        // eslint-disable-next-line 
    }, [nvaOffer])

    const ListarProductos = async () => {
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
                                let primero
                                if (key === 0) {
                                    primero = true
                                } else {
                                    primero = false
                                }
                                return (
                                    <FilaProducto
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
                                        nvaOffer={nvaOffer}
                                        setDetallesBool={setDetallesBool}
                                        setIdDetalle={setIdDetalle}
                                        setCopiarDet={setCopiarDet}
                                        primero={primero}
                                        pagina={pagina}
                                        setPagina={setPagina}
                                        setNvaOffer={setNvaOffer}
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

    const VariacionCosto = async () => {
        setEsperar(true)
        let query = {
            query: ""
        }
        if (busquedaBool) {
            query = {
                query: palabraBuscada
            }
        }

        const data = {
            aumento: aumento,
            porc: (porc / 100),
            round: round,
            roundBool: roundBool
        }

        await axios.post(`${UrlNodeServer.productsDir.sub.varCost}`, data, {
            params: query,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const status = parseInt(res.data.status)
                if (status === 200) {
                    setEsperar(false)
                    setMsgStrong("Aumento de precio aplicado con éxito!")
                    setMsgGralAlert(" ")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setCall(!call)
                    setVarCostoBool(false)
                } else {
                    setEsperar(false)
                    setMsgStrong("Hubo un error!")
                    setMsgGralAlert(" Intente nuevamente.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("Hubo un error!")
                setMsgGralAlert(" Intente nuevamente.")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    return (
        <Row style={
            detallesBool ?
                { display: "none" } :
                nvaOffer ?
                    { display: "none" } :
                    { display: "block" }}>
            <Col>
                {
                    esperar ?
                        <div style={{ textAlign: "center", marginTop: "100px" }}>
                            <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <Row>
                                    <Col md="4" style={{ paddingTop: "18px" }} >
                                        <h2 className="mb-0" style={{ textAlign: "center" }} >Lista de Productos</h2>
                                    </Col>
                                    <Col md="8" style={{ textAlign: "right" }}>
                                        <BusquedaProdForm
                                            busquedaBool={busquedaBool}
                                            setPalabraBuscada={setPalabraBuscada}
                                            palabraBuscada={palabraBuscada}
                                            setBusquedaBool={setBusquedaBool}
                                            call={call}
                                            setCall={setCall}
                                            titulo="Buscar un Producto"
                                            setPagina={setPagina}
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
                                    {varCostoBool ?
                                        <Form onSubmit={e => {
                                            e.preventDefault();
                                            VariacionCosto();
                                        }}>
                                            <Row>
                                                <Col md="4" >
                                                    <FormGroup tag="fieldset" style={{ textAlign: "right" }}>
                                                        <FormGroup check>
                                                            <Input
                                                                name="radio1"
                                                                id="radio1"
                                                                type="radio"
                                                                checked={aumento}
                                                                onChange={e => setAumento(e.target.checked)}
                                                            />
                                                            {' '}
                                                            <Label check for="radio1" >
                                                                Aumento
                                                            </Label>
                                                        </FormGroup>
                                                        <FormGroup check>
                                                            <Input
                                                                name="radio1"
                                                                id="radio2"
                                                                type="radio"
                                                                checked={!aumento}
                                                                onChange={e => setAumento(!e.target.checked)}
                                                            />
                                                            {' '}
                                                            <Label check for="radio2" >
                                                                Descuento
                                                            </Label>
                                                        </FormGroup>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4" >
                                                    <FormGroup>
                                                        <Input
                                                            value={porc}
                                                            onChange={e => setPorc(e.target.value)}
                                                            id="porcentajeTxt"
                                                            placeholder="Porcentaje a variar..."
                                                            type="number"
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4" style={{ textAlign: "left" }} >
                                                    <Row>
                                                        {
                                                            roundBool ?
                                                                <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setRound(e.target.value)} value={round}  >
                                                                    <option value={0} >1,00</option>
                                                                    <option value={-1} >10,00</option>
                                                                    <option value={-2} >100,00</option>
                                                                </Input> : null
                                                        }
                                                        <FormGroup check>
                                                            <Input type="checkbox" id="roundTxt" checked={roundBool} onChange={e => setRoundBool(e.target.checked)} />
                                                            {' '}
                                                            <Label check for="roundTxt">
                                                                Redondear
                                                            </Label>
                                                        </FormGroup>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="12" style={{ textAlign: "center" }} >
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ margin: "20px", width: "150px", marginTop: "10px" }}
                                                        type="submit"
                                                    >
                                                        Aplicar
                                                    </button>

                                                    <button
                                                        className="btn btn-danger"
                                                        style={{ margin: "20px", width: "150px", marginTop: "10px" }}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setVarCostoBool(false);
                                                        }}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </Col>
                                            </Row>
                                        </Form>
                                        : <Row>
                                            <Col style={{ marginTop: "20px", textAlign: "center" }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={nvaOffer ? { display: "none", width: "160px", margin: "auto" } : { display: "block", width: "160px", margin: "auto" }}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setNvaOffer(true);
                                                        ResetStatesForm();
                                                    }}
                                                >
                                                    Nuevo Producto
                                                </button>
                                            </Col>
                                            <Col style={{ marginTop: "20px", textAlign: "center" }}>
                                                <button
                                                    className="btn btn-primary"
                                                    style={nvaOffer ? { display: "none", width: "160px", margin: "auto" } : { display: "block", width: "160px", margin: "auto" }}
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        setVarCostoBool(true);
                                                    }}>
                                                    Variar Costos
                                                </button>
                                            </Col>
                                        </Row>}
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
                }

            </Col>
        </Row>
    )
}

export default ProdList