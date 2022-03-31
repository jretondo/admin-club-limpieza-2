import UrlNodeServer from '../../../../../api/NodeServer';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, InputGroup, InputGroupAddon, Label, Row } from 'reactstrap';
import ProductosFiltro from './components/products';
import PtosVtas from './components/ptosVta';
import StockPend from './components/stockPend';
import './components/shimmer.css';

const RemoveStock = () => {
    const [prodId, setProdId] = useState(0)
    const [cantRemove, setCantRemove] = useState(1)
    const [stock, setStock] = useState(0)
    const [ptoVta, setPtoVta] = useState({ id: "" })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [motivo, setMotivo] = useState("")
    const [cargarStock, setCargarStock] = useState(false)
    const [loading, setLoading] = useState(false)

    const AplicarReduccion = async () => {
        if (stock === "") {
            swal("Error", "Verifique que haya eligido un producto válido y el punto de venta!", "error")
        } else {
            setLoading(true)
            const data = {
                idProd: prodId,
                pv_id: ptoVta.id,
                nvoStockSingle: (-cantRemove),
                obs: motivo
            }
            await axios.post(UrlNodeServer.stockDir.stock, data, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            }).then(res => {
                const respuesta = res.data
                const status = respuesta.status
                if (status === 200) {
                    const affectedRows = parseInt(respuesta.body.affectedRows)
                    if (affectedRows > 0) {
                        swal("Stock Removido", "El stock ha sido removido con éxito!", "success")
                        setCantRemove(0)
                        setCargarStock(!cargarStock)
                    } else {
                        swal("Error", "Hubo un inconveniente! Pruebe nuevamente o cominiquese con el programador.", "error")
                    }
                } else {
                    swal("Error", "Hubo un inconveniente! Pruebe nuevamente o cominiquese con el programador.", "error")
                }
            }).catch(() => {
                swal("Error", "Hubo un inconveniente! Pruebe nuevamente o cominiquese con el programador.", "error")
            }).finally(() => { setLoading(false) })
        }
    }

    return (
        <Card style={{ marginTop: "30px" }}>
            <CardBody>
                <Form onSubmit={e => {
                    e.preventDefault()
                    AplicarReduccion()
                }} >
                    <Row>
                        <ProductosFiltro
                            colSize={3}
                            setProdId={setProdId}
                            loading={loading}
                        />
                        <StockPend
                            colSize={3}
                            prodId={prodId}
                            ptoVtaId={ptoVta.id}
                            stock={stock}
                            setStock={setStock}
                            cargarStock={cargarStock}
                            loading={loading}
                        />
                        <Col md="3">
                            <FormGroup>
                                <Label>
                                    Stock a remover
                                </Label>
                                <Input
                                    className={loading ? "shimmer3" : ""}
                                    value={cantRemove}
                                    onChange={e => setCantRemove(e.target.value)}
                                    min={1}
                                    step={1}
                                    type={"number"}
                                    disabled={loading}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col md="3">
                            <FormGroup>
                                <Label>
                                    Nuevo stock
                                </Label>
                                <Input
                                    type={"number"}
                                    className={loading ? "shimmer3" : ""}
                                    value={stock - cantRemove}
                                    required
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <FormGroup>
                                <Label>
                                    Motivo de reducción de stock
                                </Label>
                                <Input

                                    className={loading ? "shimmer3" : ""}
                                    value={motivo}
                                    onChange={e => setMotivo(e.target.value)}
                                    disabled={loading} />
                            </FormGroup>
                        </Col>
                        <PtosVtas
                            setPtoVta={setPtoVta}
                            setPtoVtaList={setPtoVtaList}
                            ptoVtaList={ptoVtaList}
                            ptoVta={ptoVta}
                            colSize={4}
                            loading={loading}
                        />
                        <Col md="2" style={{ textAlign: "center" }}>
                            <Button
                                className={loading ? "shimmer2" : ""}
                                disabled={loading}
                                color={"warning"}
                                style={{ marginTop: "32px" }}
                                type="submit" >
                                Aplicar Reducción
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>
    )
}

export default RemoveStock