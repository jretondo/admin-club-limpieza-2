import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import ProductosFiltro from './components/products';
import PtosVtas from './components/ptosVta';
import StockPend from './components/stockPend';

const RemoveStock = () => {
    const [prodId, setProdId] = useState(0)
    const [cantRemove, setCantRemove] = useState(1)
    const [stock, setStock] = useState(0)
    const [ptoVta, setPtoVta] = useState({ id: "" })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)

    const AplicarReduccion = async () => {
        if (stock === "") {
            swal("Error", "Verifique que haya eligido un producto válido y el punto de venta!", "error")
        } else {

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
                        />
                        <StockPend
                            colSize={3}
                            prodId={prodId}
                            ptoVtaId={ptoVta.id}
                            stock={stock}
                            setStock={setStock}
                        />
                        <Col md="3">
                            <FormGroup>
                                <Label>
                                    Stock a remover
                                </Label>
                                <Input
                                    value={cantRemove}
                                    onChange={e => setCantRemove(e.target.value)}
                                    min={1}
                                    step={1}
                                    type={"number"}
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
                                <Input />
                            </FormGroup>
                        </Col>
                        <PtosVtas
                            setPtoVta={setPtoVta}
                            setPtoVtaList={setPtoVtaList}
                            ptoVtaList={ptoVtaList}
                            ptoVta={ptoVta}
                            colSize={4}
                        />
                        <Col md="2" style={{ textAlign: "center" }}>
                            <Button color={"warning"} style={{ marginTop: "32px" }} type="submit" >
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