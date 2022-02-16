import React, { useState, useEffect } from 'react'
import RowVariety from './Componentes/SubComp/LayoutRowVarNvo'
import axios from 'axios'
import {
    Row,
    Col,
    FormGroup,
    Input,
    Spinner
} from "reactstrap"
import UrlNodeServer from '../../../api/NodeServer'

const ConsultaStock = ({
    idProd,
    detallesBool,
    setNvoStockArray,
    nvoStockArray,
    nvoStock,
    setNvoStock,
    nroPvSelect,
    setNroPvSelect,
    setEsArrayStock,
    observaciones,
    setObservaciones
}) => {
    const [esperar, setEsperar] = useState(false)
    const [esperar2, setEsperar2] = useState(false)
    const [plantPtoVta, setPlantPtoVta] = useState(<></>)
    const [plantStockAct, setPlantStockAct] = useState(<></>)
    const [tipoVar, setTipoVar] = useState("")

    useEffect(() => {
        ListaPV()
    }, [])

    useEffect(() => {
        if (detallesBool) {
            ListaPV()
            StockActualLista()
        }
        // eslint-disable-next-line
    }, [idProd, detallesBool])

    const ListaPV = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.ptosVtaDir.ptosVta}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                setEsperar(false)
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
            .catch(() => {
                setPlantPtoVta(<></>)
            })
    }

    const StockActualLista = async () => {
        setEsperar2(true)
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
                        const total = parseInt(resultado.length)
                        let listadito = []
                        setNvoStock(0)
                        setEsArrayStock(true)
                        setPlantStockAct(
                            resultado.map((item, key) => {
                                listadito.push({
                                    "idVar": item.idVar,
                                    "cant": 0,
                                    "variedad": item.varString
                                })
                                if (key === (total - 1)) {
                                    setEsperar2(false)
                                }
                                return (
                                    <RowVariety
                                        variedad={item.varString}
                                        stock={0}
                                        id={key}
                                        tipoVar={resultado.varTipo}
                                        key={key}
                                        idVar={item.idVar}
                                        nvoStockArray={nvoStockArray}
                                        setNvoStockArray={setNvoStockArray}
                                    />
                                )
                            })
                        )
                    } else {
                        setEsperar2(false)
                        setEsArrayStock(false)
                        setTipoVar("")
                        setNvoStock(1)
                        setNvoStockArray([])
                        setPlantStockAct(<> </>)
                    }
                } else {
                    setTipoVar("")
                    setPlantStockAct(<></>)
                }
            })
            .catch(() => {
                setTipoVar("")
                setPlantStockAct(<></>)
            })
    }

    return (
        <>
            <Row>
                <Col lg="6">
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "30px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "70px", height: "70px" }} /> </div> :
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
                    }
                </Col>
                <Col md="6" style={{ borderLeft: "1px solid red" }}>
                    {esperar2 ?
                        <div style={{ textAlign: "center", marginTop: "30px" }}>
                            <Spinner type="grow" color="primary" style={{ width: "70px", height: "70px" }} /> </div> :
                        tipoVar === "" ?
                            <Row>
                                <Col md="6" >
                                    <h4>Nuevo Stock</h4>
                                    <FormGroup>
                                        <Input
                                            className="form-control-alternative"
                                            id="input-stock"
                                            placeholder="Nuevo Stock..."
                                            type="number"
                                            value={nvoStock}
                                            onChange={e => setNvoStock(e.target.value)}
                                            min={1}
                                            step={1}
                                            required
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6" >
                                    <h4>Observaciones</h4>
                                    <FormGroup>
                                        <Input
                                            className="form-control-alternative"
                                            id="input-stock"
                                            placeholder="Alguna observación de la carga (Nº de remito, prod dañado, etc)..."
                                            type="textarea"
                                            value={observaciones}
                                            onChange={e => setObservaciones(e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            :
                            <>
                                <h5>{tipoVar}</h5>
                                {plantStockAct}
                            </>
                    }
                </Col>
            </Row>
        </>
    )
}

export default ConsultaStock