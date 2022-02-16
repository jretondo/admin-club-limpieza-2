import formatMoney from 'Function/NumberFormat';
import React, { useEffect, useState } from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
    Label
} from "reactstrap";
import BtnDisabled from '../../../assets/img/icons/btn-disabled.png'
import BtnEnabled from '../../../assets/img/icons/btn-enabled.png'

const InfoForm = ({
    nombreNvo,
    setNombreNvo,
    costo,
    setCosto,
    unidad,
    setUnidad,
    venta,
    setVenta,
    codBarra,
    setCodBarra,
    round,
    setRound,
    roundBool,
    setRoundBool,
    ivaCosto,
    setIvaCosto,
    precioVta,
    setPrecioVta,
    vtaFijaBool,
    setVtaFijaBool
}) => {
    const [costoIva, setCostoIva] = useState("")
    const [vetaStr, setVentaStr] = useState("")
    const [porcStr, setPorcStr] = useState("")

    useEffect(() => {
        if (!vtaFijaBool) {
            calculoVta()
        }
        // eslint-disable-next-line
    }, [roundBool, round, ivaCosto, costo, venta, vtaFijaBool])

    useEffect(() => {
        if (vtaFijaBool) {
            calculoPorc()
        }
        // eslint-disable-next-line
    }, [costo, precioVta, ivaCosto, vtaFijaBool])

    useEffect(() => {
        if (roundBool) {
            setRound(100)
        } else {
            setRound(0)
        }
        // eslint-disable-next-line
    }, [roundBool])

    const calculoVta = () => {
        if (costo > 0 && venta > 0) {
            if (roundBool) {
                const costoConIva = formatMoney(costo * ((ivaCosto / 100) + 1))
                let ventaFinal = (costo * ((ivaCosto / 100) + 1) * ((venta / 100) + 1))
                ventaFinal = ventaFinal * 100
                ventaFinal = parseInt(Math.round(ventaFinal / round))
                ventaFinal = ventaFinal / 100
                ventaFinal = (ventaFinal * round)
                setPrecioVta(ventaFinal)
                ventaFinal = formatMoney(ventaFinal, 2)
                setVentaStr("$ " + ventaFinal)
                setCostoIva("$ " + costoConIva)
            } else {
                const costoConIva = formatMoney(costo * ((ivaCosto / 100) + 1))
                let ventaFinal = (costo * ((ivaCosto / 100) + 1)) * ((venta / 100) + 1)
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
            const costoConIva = formatMoney(costo * ((ivaCosto / 100) + 1))
            setRoundBool(false)
            setRound(0)
            let costoCalc = (((precioVta) / (costo * ((ivaCosto / 100) + 1))) - 1) * 100
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

    if (vtaFijaBool) {
        return (
            <>
                <Row>
                    <Col lg="4">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                            >
                                Cód. Barra
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Código de barras..."
                                type="text"
                                value={codBarra}
                                onChange={e => setCodBarra(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="8">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                            >
                                Nombre
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Nombre del Producto..."
                                type="text"
                                value={nombreNvo}
                                onChange={e => setNombreNvo(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
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
                                htmlFor="unidadesTxt"
                            >
                                Venta por:
                            </label>
                            <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setUnidad(e.target.value)} value={unidad}  >
                                <option value={0} >Unidad</option>
                                <option value={1} >kilogramos</option>
                                <option value={2} >Litros</option>
                            </Input>
                        </FormGroup>
                    </Col>
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
                                onChange={e => setCosto(e.target.value)}
                                required
                            />
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
                            <Input
                                className="form-control-alternative"
                                style={{ fontSize: "25px" }}
                                type="number"
                                placeholder="Precio de venta..."
                                id="precioVtaTxt"
                                value={precioVta}
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
                            <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setIvaCosto(e.target.value)} value={ivaCosto}  >
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
                                placeholder="Costo del producto..."
                                type="text"
                                style={{ fontSize: "25px" }}
                                value={porcStr}
                                disabled
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </>
        )
    } else {
        return (
            <>
                <Row>
                    <Col lg="4">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                            >
                                Cód. Barra
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Código de barras..."
                                type="text"
                                value={codBarra}
                                onChange={e => setCodBarra(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="8">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="input-username"
                            >
                                Nombre
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Nombre del Producto..."
                                type="text"
                                value={nombreNvo}
                                onChange={e => setNombreNvo(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Col>
                </Row>
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
                    <Col lg="3">
                        <FormGroup>
                            <label
                                className="form-control-label"
                                htmlFor="unidadesTxt"
                            >
                                Venta por:
                            </label>
                            <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setUnidad(e.target.value)} value={unidad}  >
                                <option value={0} >Unidad</option>
                                <option value={1} >kilogramos</option>
                                <option value={2} >Litros</option>
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col lg="3">
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
                                onChange={e => setCosto(e.target.value)}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="3">
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
                                onChange={e => {
                                    setVenta(e.target.value)
                                    setPorcStr(formatMoney(e.target.value) + "%")
                                }}
                                required
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="3">
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
                            <Input style={{ fontSize: "20px" }} type="select" id="unidadesTxt" onChange={e => setIvaCosto(e.target.value)} value={ivaCosto}  >
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
            </>
        )
    }
}

export default InfoForm