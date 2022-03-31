import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import MarcasMod from './marcas';
import ProductosFiltro from './productos';
import ProveedoresMod from './proveedores';
import PtosVtas from './ptosVta';
import UrlNodeServer from '../../../../../../../api/NodeServer';
import FilaOrden from './filaOrden';

const HeaderUltMovStock = ({
    setListaStock,
    pagina,
    setLoading,
    moduleActive
}) => {
    const [ptosVta, setPtoVta] = useState({ id: "" })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [marca, setMarca] = useState("")
    const [marcasList, setMarcasList] = useState(<option value={""}>No hay marcas para listar</option>)
    const [proveedor, setProveedor] = useState("")
    const [proveedoresList, setProveedoresList] = useState(<option value={""}>No hay proveedores para listar</option>)
    const [prodId, setProdId] = useState("")
    const [group, setGroup] = useState(0)
    const [asc, setAsc] = useState("")
    const [ordenlist, setOrdenList] = useState([
        {
            orden: 0,
            title: "Nombre de Productos"
        },
        {
            orden: 1,
            title: "Importe"
        },
        {
            orden: 2,
            title: "Marca"
        },
        {
            orden: 3,
            title: "Proveedor"
        }
    ])


    const getList = async () => {
        let query = `?prodId=${prodId}&pvId=${ptosVta.id}&cat=${proveedor}&subcat=${marca}&group=${group}&order=${JSON.stringify(ordenlist)}&desc=${asc}`

        setLoading(true)
        await axios.get(UrlNodeServer.stockDir.sub.listaStock + "/" + pagina + query, {
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

            }
        }).catch((error) => {

        }).finally(() => {
            setLoading(false)
        })
    }

    const subir = (ordenAnt) => {
        let nvaLista = []
        // eslint-disable-next-line
        ordenlist.map((item, key) => {
            if (item.orden === ordenAnt) {
                nvaLista.push({
                    orden: item.orden - 1,
                    title: item.title
                })
            } else if (item.orden === (ordenAnt - 1)) {
                nvaLista.push({
                    orden: item.orden + 1,
                    title: item.title
                })
            } else {
                nvaLista.push({
                    orden: item.orden,
                    title: item.title
                })
            }
            if (key === ordenlist.length - 1) {
                nvaLista = nvaLista.sort((a, b) => a.orden - b.orden)
                setOrdenList(() => [...nvaLista])
            }
        })
    }
    const bajar = (ordenAnt) => {
        let nvaLista = []
        // eslint-disable-next-line
        ordenlist.map((item, key) => {
            if (item.orden === ordenAnt) {
                nvaLista.push({
                    orden: item.orden + 1,
                    title: item.title
                })
            } else if (item.orden === (ordenAnt + 1)) {
                nvaLista.push({
                    orden: item.orden - 1,
                    title: item.title
                })
            } else {
                nvaLista.push({
                    orden: item.orden,
                    title: item.title
                })
            }
            if (key === ordenlist.length - 1) {
                nvaLista = nvaLista.sort((a, b) => a.orden - b.orden)
                setOrdenList(() => [...nvaLista])
            }
        })
    }

    useEffect(() => {
        getList()
    }, [pagina, moduleActive])

    return (
        <Form onSubmit={e => {
            e.preventDefault()
            getList()
        }}>
            <Row>
                <Col md="8">
                    <Row>
                        <ProductosFiltro
                            setProdId={setProdId}
                            colSize={6}
                        />
                        <PtosVtas
                            setPtoVta={setPtoVta}
                            setPtoVtaList={setPtoVtaList}
                            ptoVtaList={ptoVtaList}
                            ptoVta={ptosVta}
                            colSize={6}
                        />

                    </Row>
                    <Row>
                        <ProveedoresMod
                            setProveedor={setProveedor}
                            setProveedoresList={setProveedoresList}
                            proveedoresList={proveedoresList}
                            proveedor={proveedor}
                            colSize={4}
                        />
                        <MarcasMod
                            setMarca={setMarca}
                            setMarcasList={setMarcasList}
                            marcasList={marcasList}
                            marca={marca}
                            colSize={4}
                        />
                        <Col>
                            <FormGroup>
                                <Label for="exampleSelect">Agrupación</Label>
                                <Input onChange={e => setGroup(e.target.value)} value={group} type="select" name="select" id="exampleSelect">
                                    <option value={0}>Por producto</option>
                                    <option value={1}>Por Marca</option>
                                    <option value={2}>Por Proveedor</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col md="4">
                    <Row>
                        <Col>
                            <Label for="exampleSelect">Orden</Label>
                        </Col>
                        <Col style={{ textAlign: "left" }}>
                            <Input value={asc} onChange={e => setAsc(e.target.value)} type="select" style={{ height: "25px", paddingTop: "2px", paddingBottom: "2px" }} id="exampleSelect">
                                <option value={""} >Descendente</option>
                                <option value={1}>Ascendente</option>
                            </Input>
                        </Col>
                    </Row>
                    <Col md="12" style={{ border: "1px solid #cad1d7", padding: "8px", borderRadius: "0.375rem" }}>
                        {
                            // eslint-disable-next-line
                            ordenlist.map((item, key) => {
                                return (
                                    <FilaOrden
                                        key={key}
                                        title={item.title}
                                        position={item.orden}
                                        bajar={bajar}
                                        subir={subir}
                                    />)
                            })
                        }
                    </Col>
                </Col>
            </Row>
            <Row style={{ marginBottom: "15px" }}>
                <Col>
                    <Button color={"primary"} style={{ width: "200px" }}>
                        Listar Stock
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default HeaderUltMovStock