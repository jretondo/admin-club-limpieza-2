import React, { useState, useEffect } from 'react'
import ListadoDet from './ListadoStockDet'
import RowVariety from './Componentes/SubComp/LayoutRowVar'
import axios from 'axios'
import {
    Row,
    Col,
    FormGroup,
    Input
} from "reactstrap"
import UrlNodeServer from '../../../api/NodeServer'

const ConsultaStock = ({ idProd, detallesBool, nroPvSelect, setNroPvSelect }) => {
    const [listaStock, setListaStock] = useState([])
    const [pvSelectBool, setPvSelectBool] = useState(false)
    const [plantPtoVta, setPlantPtoVta] = useState(<></>)
    const [plantStockAct, setPlantStockAct] = useState(<></>)
    const [tipoVar, setTipoVar] = useState("")

    useEffect(() => {
        ListaPV()
    }, [])

    useEffect(() => {
        if (detallesBool) {
            ListaPV()
        }
    }, [idProd, detallesBool])

    useEffect(() => {
        if (pvSelectBool) {
            ListadoUltStock()
            StockActualLista()
        }
        // eslint-disable-next-line
    }, [pvSelectBool])

    const ListaPV = async () => {
        await axios.get(`${UrlNodeServer.ptosVtaDir.ptosVta}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body.data

                    setPlantPtoVta(
                        resultado.map((item, key) => {
                            return (
                                <option key={key} value={item.pv}>{item.direccion + " (PV: " + item.pv + ")"}</option>
                            )
                        })
                    )
                } else {
                    setPlantPtoVta(<></>)
                }
            })
    }

    const ListadoUltStock = async () => {
        const query = `?idProd=${idProd}&idPv=${nroPvSelect}`

        await axios.get(`${UrlNodeServer.stockDir.sub.ultMov}/${query}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const datos = respuesta.body
                    console.log(`datos`, datos)
                    if (datos.length > 0) {
                        setListaStock(
                            datos
                        )
                    } else {
                        setListaStock(
                            []
                        )
                    }
                } else {
                    setListaStock(
                        []
                    )
                }
            })
    }

    const StockActualLista = async () => {
        const query = `?idProd=${idProd}&idPv=${nroPvSelect}`

        await axios.get(`${UrlNodeServer.stockDir.stock}${query}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body
                    const varBool = resultado[0].variedad
                    if (varBool) {
                        setTipoVar(resultado[0].varTipo)
                        setPlantStockAct(
                            resultado.map((item, key) => {
                                return (
                                    <RowVariety
                                        variedad={item.varString}
                                        stock={item.stock}
                                        id={key}
                                        tipoVar={resultado.varTipo}
                                        key={key}
                                    />
                                )
                            })
                        )
                    } else {
                        setTipoVar("")
                        setPlantStockAct(
                            <>
                                <FormGroup>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-username"
                                        placeholder="Nombre del Producto..."
                                        type="text"
                                        value={resultado[0].stock}
                                        disabled
                                    />
                                </FormGroup>
                            </>
                        )
                    }
                } else {
                    setPvSelectBool(false)
                }
            })
    }

    return (
        <>
            {!pvSelectBool ?
                <Row>
                    <Col lg="6">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                            >
                                Puntos de Venta
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Nombre del Producto..."
                                type="select"
                                value={nroPvSelect}
                                onChange={e => setNroPvSelect(e.target.value)}
                                required
                            >
                                <option value={0}>Deposito</option>
                                {plantPtoVta}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col lg="2">
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: "30px" }}
                            onClick={e => {
                                e.preventDefault()
                                setPvSelectBool(true)
                            }}
                        >
                            Cargar Información
                        </button>
                    </Col>
                </Row> :
                <>
                    <Row>
                        <Col md="7" style={{ border: "2px solid red", borderRigth: "1px solid red" }}>
                            <h4>Últimos Movimientos de Stock</h4>
                            <ListadoDet
                                itemsFilas={listaStock}
                            />
                        </Col>
                        <Col md="5" style={{ border: "2px solid red", borderLeft: "1px solid red" }}>
                            <h4>Stock Actual</h4>
                            {
                                tipoVar === "" ?
                                    plantStockAct
                                    :
                                    <>
                                        <h3>{tipoVar}</h3>
                                        {plantStockAct}
                                    </>
                            }

                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" style={{ textAlign: "center" }}>
                            <button
                                className="btn btn-danger"
                                style={{ marginTop: "30px" }}
                                onClick={e => {
                                    e.preventDefault()
                                    setPvSelectBool(false)
                                }}
                            >
                                Volver
                            </button>
                        </Col>
                    </Row>
                </>
            }
        </>
    )

}

export default ConsultaStock