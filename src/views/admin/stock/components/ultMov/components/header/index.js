import React, { useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import MarcasMod from './marcas';
import ProductosFiltro from './productos';
import ProveedoresMod from './proveedores';
import PtosVtas from './ptosVta';
import UsuariosList from './usersList';
const HeaderUltMovStock = () => {
    const [ptosVta, setPtoVta] = useState({ id: null })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [user, setUser] = useState({ id: null })
    const [usersList, setUsersList] = useState(<option>No hay usuarios listados</option>)
    const [marca, setMarca] = useState("")
    const [marcasList, setMarcasList] = useState(<option value={""}>No hay marcas para listar</option>)
    const [proveedor, setProveedor] = useState("")
    const [proveedoresList, setProveedoresList] = useState(<option value={""}>No hay proveedores para listar</option>)

    return (
        <Form>
            <Row>
                <Col md="8">
                    <Row>
                        <Col md="3" >
                            <FormGroup>
                                <Label for="desdeTxt">Desde</Label>
                                <Input type="date" id="desdeTxt" />
                            </FormGroup>
                        </Col>
                        <Col md="3" >
                            <FormGroup>
                                <Label for="desdeTxt">Hasta</Label>
                                <Input type="date" id="desdeTxt" />
                            </FormGroup>
                        </Col>
                        <ProductosFiltro
                            colSize={6}
                        />
                    </Row>
                    <Row>
                        <Col md="3">
                            <FormGroup>
                                <Label for="exampleSelect">Tipo de Movimiento</Label>
                                <Input type="select" name="select" id="exampleSelect">
                                    <option>Todos</option>
                                    <option>Compras</option>
                                    <option>Ventas</option>
                                </Input>
                            </FormGroup>
                        </Col>
                        <UsuariosList
                            setUser={setUser}
                            setUsersList={setUsersList}
                            user={user}
                            usersList={usersList}
                            colSize={3}
                        />
                        <PtosVtas
                            setPtoVta={setPtoVta}
                            setPtoVtaList={setPtoVtaList}
                            ptoVtaList={ptoVtaList}
                            ptoVta={ptosVta}
                            colSize={6}
                        />
                    </Row>
                </Col>
                <Col md="4" >
                    <Row>
                        <MarcasMod
                            setMarca={setMarca}
                            setMarcasList={setMarcasList}
                            marcasList={marcasList}
                            marca={marca}
                            colSize={12}
                        />
                    </Row>
                    <Row>
                        <ProveedoresMod
                            setProveedor={setProveedor}
                            setProveedoresList={setProveedoresList}
                            proveedoresList={proveedoresList}
                            proveedor={proveedor}
                            colSize={12}
                        />
                    </Row>
                </Col>
            </Row>
        </Form>
    )
}

export default HeaderUltMovStock