import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap'
import formatMoney from 'Function/NumberFormat'
import BtnDisabled from '../../../../assets/img/icons/btn-disabled.png'
import BtnEnabled from '../../../../assets/img/icons/btn-enabled.png'
const ModalNewStock = ({
    modal,
    setModal,
    item,
    setActividadStr,
    nvaActCall,
    setNvaActCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setCall,
    call
}) => {

    const [loading, setLoading] = useState(false)
    const [nvoStock, setNvoStock] = useState(1)
    const [stockAct, setStockAct] = useState(0)
    const [stockTotal, setStockTotal] = useState(0)
    const [ptoVta, setPtoVta] = useState({ id: 0 })
    const [plantPtosVta, setPlantPtosVta] = useState(<></>)
    const [costo, setCosto] = useState(item.precio_compra)
    const [venta, setVenta] = useState(item.porc_minor)
    const [roundBool, setRoundBool] = useState(parseInt(item.round) > 0 ? true : false)
    const [round, setRound] = useState(parseInt(item.round) > 0 ? parseInt(item.round) : 100)
    const [costoIva, setCostoIva] = useState(item.iva)
    const [precioVta, setPrecioVta] = useState(item.vta_price)
    const [vetaStr, setVentaStr] = useState("")
    const [porcStr, setPorcStr] = useState("")
    const [vtaFijaBool, setVtaFijaBool] = useState(parseInt(item.vta_fija) === 0 ? false : true)

    useEffect(() => {
        ListaPV()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        reset()
        ListaPV()
        // eslint-disable-next-line
    }, [modal])

    useEffect(() => {
        if (!vtaFijaBool) {
            calculoVta()
        }
        // eslint-disable-next-line
    }, [roundBool, round, costo, venta, vtaFijaBool])

    useEffect(() => {
        if (vtaFijaBool) {
            calculoPorc()
        }
        // eslint-disable-next-line
    }, [costo, precioVta, vtaFijaBool])

    useEffect(() => {
        if (roundBool) {
            setRound(100)
        } else {
            setRound(0)
        }
        // eslint-disable-next-line
    }, [roundBool])

    useEffect(() => {
        if (modal) {
            StockActualLista()
        }
        // eslint-disable-next-line
    }, [ptoVta, modal])

    useEffect(() => {
        if (modal && !loading) {
            selectElement()
        }
    }, [modal, loading])

    useEffect(() => {
        ActualizaTotalNvo()
        // eslint-disable-next-line
    }, [nvoStock, stockAct])

    const selectElement = () => {
        setTimeout(() => {
            try {
                document.getElementById("nvoStockTxt").focus();
                document.getElementById("nvoStockTxt").select();
            } catch (error) {

            }
        }, 200);
    }

    const calculoVta = () => {
        if (costo > 0 && venta > 0) {
            if (roundBool) {
                const costoConIva = formatMoney(costo * ((item.iva / 100) + 1))
                let ventaFinal = (costo * ((item.iva / 100) + 1) * ((venta / 100) + 1))
                ventaFinal = ventaFinal * 100
                ventaFinal = parseInt(Math.round(ventaFinal / round))
                ventaFinal = ventaFinal / 100
                ventaFinal = (ventaFinal * round)
                setPrecioVta(ventaFinal)
                ventaFinal = formatMoney(ventaFinal, 2)
                setVentaStr("$ " + ventaFinal)
                setCostoIva("$ " + costoConIva)
            } else {
                const costoConIva = formatMoney(costo * ((item.iva / 100) + 1))
                let ventaFinal = (costo * ((item.iva / 100) + 1)) * ((venta / 100) + 1)
                ventaFinal = Math.round(ventaFinal * 100)
                ventaFinal = ventaFinal / 100
                setPrecioVta(ventaFinal)
                ventaFinal = formatMoney(ventaFinal, 2)
                setCostoIva("$ " + costoConIva)
                setVentaStr("$ " + ventaFinal)
            }
        } else {
            setVentaStr("")
            setCostoIva("")
            setPrecioVta(0)
        }
    }

    const calculoPorc = () => {
        if (costo > 0 && precioVta > 0) {
            const costoConIva = formatMoney(costo * ((item.iva / 100) + 1))
            setRoundBool(false)
            setRound(0)
            let costoCalc = (((precioVta) / (costo * ((item.iva / 100) + 1))) - 1) * 100
            costoCalc = Math.round(costoCalc * 100)
            costoCalc = costoCalc / 100
            setVenta(costoCalc)
            costoCalc = formatMoney(costoCalc)
            setPorcStr(costoCalc + "%")
            setCostoIva("$ " + costoConIva)
        } else {
            setPorcStr("")
            setCostoIva("")
            setVenta("")
        }
    }

    const ListaPV = async () => {
        setLoading(true)
        await axios.get(`${UrlNodeServer.ptosVtaDir.ptosVta}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body.data

                    setPlantPtosVta(
                        resultado.map((item, key) => {
                            return (
                                <option key={key} value={JSON.stringify(item)}>{item.direccion + " (PV: " + item.pv + ")"}</option>
                            )
                        })
                    )
                } else {
                    setPlantPtosVta(<></>)
                }
            })
            .catch(() => {
                setLoading(false)
            })
    }

    const StockActualLista = async () => {
        const query = `?idProd=${item.id_prod}&idPv=${ptoVta.id}`
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
                    setStockAct(resultado[0].stock)
                } else {
                    setStockAct(0)
                }
            })
            .catch(() => {
            })
    }

    const ActualizaTotalNvo = () => {
        setStockTotal(parseInt(stockAct) + parseInt(nvoStock))
    }

    const NvoStockFunct = async () => {
        const data = {
            idProd: item.id_prod,
            pv_id: ptoVta.id,
            nvoStockSingle: nvoStock,
            obs: "Nuevo Stock",
            costo: costo,
            iva: item.iva,
            vta_fija: vtaFijaBool,
            vta_price: precioVta,
            round: roundBool ? round : 0,
            porc_minor: venta,
            precio_compra: costo
        }
        setLoading(true)
        await axios.post(UrlNodeServer.stockDir.stock, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setActividadStr("El usuario ha agregado " + nvoStock + " de stock al producto de ID " + item.id_prod + " en el PV " + ptoVta.id)
                    setNvaActCall(!nvaActCall)
                    setMsgStrong("Stock actualizado con éxito! ")
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setModal(false)
                    setTimeout(() => {
                        setCall(!call)
                    }, 500);
                } else {
                    setMsgStrong("Hubo un error! ")
                    setMsgGralAlert("No se pudo eliminar el producto.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setLoading(false)
                setMsgStrong("Hubo un error! ")
                setMsgGralAlert("No se pudo eliminar el producto.")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const reset = () => {
        setLoading(false)
        setNvoStock(1)
        setPtoVta({ id: 0 })
        setPlantPtosVta(<></>)
        setCosto(item.precio_compra)
        setVenta(item.porc_minor)
        setRoundBool(parseInt(item.round) > 0 ? true : false)
        setRound(parseInt(item.round) > 0 ? parseInt(item.round) : 100)
        setCostoIva("")
        setPrecioVta(item.vta_price)
        setVtaFijaBool(parseInt(item.vta_fija) === 0 ? false : true)
        if (parseInt(item.vta_fija) === 0) {
            calculoVta()
        } else {
            calculoPorc()
        }
    }

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
                NvoStockFunct(e)
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                <h2>Nuevo Stock</h2>
                                <h2>{item.name} - <span style={{ color: "green" }} >Stock Actual: {stockAct}</span> </h2>
                                <Row>
                                    <Col lg="12">
                                        <FormGroup>
                                            <Input
                                                className="form-control-alternative"
                                                placeholder="Nombre del Producto..."
                                                type="select"
                                                onChange={e => setPtoVta(JSON.parse(e.target.value))}
                                            >
                                                <option value={JSON.stringify({ id: 0 })}>Deposito</option>
                                                {plantPtosVta}
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col md="4" >
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="nvoStockTxt"
                                            >
                                                Stock a agregar
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="nvoStockTxt"
                                                placeholder="Cantidad..."
                                                type="number"
                                                min={1}
                                                step={1}
                                                value={nvoStock}
                                                onChange={e => setNvoStock(e.target.value)}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md="3" >
                                        <FormGroup >
                                            <Input type="select" id="unidadesTxt" value={item.unidad} style={{ marginTop: "30px" }} disabled >
                                                <option value={0} >Unidades</option>
                                                <option value={1} >kilogramos</option>
                                                <option value={2} >Litros</option>
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md="2" style={{ textAlign: "center" }} >
                                        <i style={{ marginTop: "35px", fontSize: "30px" }} className="fas fa-arrow-right"></i>
                                    </Col>
                                    <Col md="3" >
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="input-username"
                                            >
                                                Nuevo Stock
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-username"
                                                placeholder="Cantidad..."
                                                type="number"
                                                value={stockTotal}
                                                disabled
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <hr />
                                {
                                    vtaFijaBool ?
                                        <>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <Label style={{ fontWeight: "bold" }} for="datosBancBool">Precio de venta fijo:</Label>
                                                        <br />
                                                        <img style={{ width: "100px" }} id="datosBancBool" src={vtaFijaBool ? BtnEnabled : BtnDisabled} alt="Sin_datos_banco" onClick={() => setVtaFijaBool(!vtaFijaBool)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-username"
                                                        >
                                                            Costo Sin IVA
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder="Costo del producto..."
                                                            type="number"
                                                            style={{ fontSize: "25px" }}
                                                            value={costo}
                                                            min={0.01}
                                                            step={0.01}
                                                            onChange={e => setCosto(e.target.value)}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Precio de venta
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            style={{ fontSize: "25px" }}
                                                            type="number"
                                                            placeholder="Precio de venta..."
                                                            id="precioVtaTxt"
                                                            value={precioVta}
                                                            min={0.01}
                                                            step={0.01}
                                                            onChange={e => setPrecioVta(e.target.value)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="unidadesTxt"
                                                        >
                                                            IVA:
                                                        </label>
                                                        <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" value={item.item} disabled >
                                                            <option value={21} >21%</option>
                                                            <option value={10.5} >10,5%</option>
                                                            <option value={27} >27%</option>
                                                            <option value={0} >0%</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Costo con IVA
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={costoIva} disabled />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-username"
                                                        >
                                                            Porc. Ganancia (%)
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder="Costo del producto..."
                                                            type="text"
                                                            style={{ fontSize: "25px" }}
                                                            value={porcStr}
                                                            disabled
                                                        />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Costo total sin IVA
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={"$ " + formatMoney(nvoStock * costo)} disabled />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Costo total con IVA
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={"$ " + formatMoney(nvoStock * (costo * (1 + (item.iva / 100))))} disabled />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </>
                                        :
                                        <>
                                            <Row>
                                                <Col md="12">
                                                    <FormGroup>
                                                        <Label style={{ fontWeight: "bold" }} for="datosBancBool">Precio de venta fijo:</Label>
                                                        <br />
                                                        <img style={{ width: "100px" }} id="datosBancBool" src={vtaFijaBool ? BtnEnabled : BtnDisabled} alt="Sin_datos_banco" onClick={() => setVtaFijaBool(!vtaFijaBool)} />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="input-username"
                                                        >
                                                            Costo Sin IVA
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder="Costo del producto..."
                                                            type="number"
                                                            style={{ fontSize: "25px" }}
                                                            value={costo}
                                                            min={0.01}
                                                            step={0.01}
                                                            onChange={e => setCosto(e.target.value)}
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
                                                            Porc. Ganancia (%)
                                                        </label>
                                                        <Input
                                                            className="form-control-alternative"
                                                            id="input-username"
                                                            placeholder="Porcentaje de venta..."
                                                            type="number"
                                                            style={{ fontSize: "25px" }}
                                                            value={venta}
                                                            min={0.01}
                                                            step={0.01}
                                                            onChange={e => {
                                                                setVenta(e.target.value)
                                                                setPorcStr(formatMoney(e.target.value) + "%")
                                                            }}
                                                            required
                                                        />
                                                    </FormGroup>
                                                </Col>
                                                <Col lg="4">
                                                    <FormGroup>
                                                        <FormGroup check>
                                                            <Label check>
                                                                <Input style={{ fontSize: "20px" }} type="checkbox" checked={roundBool} onChange={e => setRoundBool(e.target.checked)} />{' '}
                                                                <span style={{ fontSize: "20px" }} >Redondear</span>
                                                            </Label>
                                                            {
                                                                roundBool ?
                                                                    <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setRound(e.target.value)} value={round}  >
                                                                        <option value={100} >1,00</option>
                                                                        <option value={1000} >10,00</option>
                                                                        <option value={10000} >100,00</option>
                                                                    </Input> : null
                                                            }

                                                        </FormGroup>
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="4">
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="unidadesTxt"
                                                        >
                                                            IVA:
                                                        </label>
                                                        <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" value={item.iva} disabled  >
                                                            <option value={21} >21%</option>
                                                            <option value={10.5} >10,5%</option>
                                                            <option value={27} >27%</option>
                                                            <option value={0} >0%</option>
                                                        </Input>
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Costo con IVA
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={costoIva} disabled />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="4" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Precio de venta
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={vetaStr} disabled />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Costo total sin IVA
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={"$ " + formatMoney(nvoStock * costo)} disabled />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="6" >
                                                    <FormGroup>
                                                        <label
                                                            className="form-control-label"
                                                            htmlFor="precioVtaTxt"
                                                        >
                                                            Costo total con IVA
                                                        </label>
                                                        <Input style={{ fontSize: "25px" }} type="text" id="precioVtaTxt" value={"$ " + formatMoney(nvoStock * (costo * (1 + (item.iva / 100))))} disabled />
                                                    </FormGroup>
                                                </Col>
                                            </Row>
                                        </>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Row>
                                    <Col md="6">
                                        <button style={{ width: "130px", margin: "15px" }} className="btn btn-primary">
                                            Actualizar
                                        </button>
                                    </Col>
                                    <Col md="6">
                                        <button
                                            style={{ width: "130px", margin: "15px" }}
                                            className="btn btn-danger"
                                            onClick={e => {
                                                e.preventDefault()
                                                setModal(false)
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </Col>
                                </Row>
                            </ModalFooter>
                        </>
                }
            </Form>
        </Modal>
    )
}

export default ModalNewStock