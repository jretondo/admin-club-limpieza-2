import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import MarcasMod from './marcas';
import ProductosFiltro from './productos';
import ProveedoresMod from './proveedores';
import PtosVtas from './ptosVta';
import UsuariosList from './usersList';
import UrlNodeServer from '../../../../../../../api/NodeServer';
import swal from 'sweetalert';

const HeaderUltMovStock = ({
    setListaStock,
    pagina,
    setLoading
}) => {
    const [ptosVta, setPtoVta] = useState({ id: "" })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [user, setUser] = useState({ id: "" })
    const [usersList, setUsersList] = useState(<option>No hay usuarios listados</option>)
    const [marca, setMarca] = useState("")
    const [marcasList, setMarcasList] = useState(<option value={""}>No hay marcas para listar</option>)
    const [proveedor, setProveedor] = useState("")
    const [proveedoresList, setProveedoresList] = useState(<option value={""}>No hay proveedores para listar</option>)
    const [desde, setDesde] = useState("")
    const [hasta, setHasta] = useState("")
    const [prodId, setProdId] = useState("")
    const [tipoMov, setTipoMov] = useState("")

    const getList = async () => {
        let query = `?desde=${desde}&hasta=${hasta}&prodId=${prodId}&tipoMov=${tipoMov}&pvId=${ptosVta.id}&userId=${user.id}&cat=${proveedor}&subcat=${marca}`

        setLoading(true)
        await axios.get(UrlNodeServer.stockDir.sub.ultStockList + "/" + pagina + query, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const data = respuesta.body
                setListaStock(data)
            } else {
                swal("Movimientos de Stock!", "Ha habido un error inesperado!", "error");
            }
        }).catch((error) => {
            swal("Movimientos de Stock!", "Ha habido un error inesperado! Error: " + error, "error");
        }).finally(() => {
            setLoading(false)
        })
    }

    useEffect(() => {
        getList()
        // eslint-disable-next-line
    }, [pagina, ptosVta, user, marca, proveedor, desde, hasta, prodId, tipoMov])

    return (
        <Form>
            <Row>
                <Col md="8">
                    <Row>
                        <Col md="3" >
                            <FormGroup>
                                <Label for="desdeTxt">Desde</Label>
                                <Input value={desde} onChange={e => setDesde(e.target.value)} type="date" id="desdeTxt" />
                            </FormGroup>
                        </Col>
                        <Col md="3" >
                            <FormGroup>
                                <Label for="desdeTxt">Hasta</Label>
                                <Input value={hasta} onChange={e => setHasta(e.target.value)} type="date" id="desdeTxt" />
                            </FormGroup>
                        </Col>
                        <ProductosFiltro
                            setProdId={setProdId}
                            colSize={6}
                        />
                    </Row>
                    <Row>
                        <Col md="3">
                            <FormGroup>
                                <Label for="exampleSelect">Tipo de Movimiento</Label>
                                <Input value={tipoMov} onChange={e => setTipoMov(e.target.value)} type="select" name="select" id="exampleSelect">
                                    <option value={""}>Todos</option>
                                    <option value={1}>Entradas</option>
                                    <option value={2}>Salidas</option>
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