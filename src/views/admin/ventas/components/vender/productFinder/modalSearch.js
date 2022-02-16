import React, { useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';
import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import axios from 'axios';
import UrlNodeServer from 'api/NodeServer';
import FilaProdSearch from 'components/subComponents/Listados/SubComponentes/filaPordSearch';

const ModalSearchProd = ({
    prodSearchModal,
    prodSearchToggle,
    setProdText,
    findProd
}) => {
    const [dataFind, setDataFind] = useState("")
    const [loading, setLoading] = useState(false)
    const [listaProd, setlistaProd] = useState(<tr style={{ textAlign: "center", width: "100%" }}>
        <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos encontrados</span></td>
    </tr>)

    const titulos = ["Producto", "Proveedor", "Marca", "Precio Final", ""]

    const Find = async () => {
        setLoading(true)
        await axios.get(UrlNodeServer.productsDir.products + `/1?query=${dataFind}&cantPerPage=15`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = respuesta.status
                if (status === 200) {
                    const data = respuesta.body.data
                    if (data.length > 0) {
                        setlistaProd(
                            // eslint-disable-next-line
                            data.map((item, key) => {
                                return (
                                    <FilaProdSearch
                                        key={key}
                                        item={item}
                                        id={key}
                                        setProdText={setProdText}
                                        prodSearchToggle={prodSearchToggle}
                                        findProd={findProd}
                                    />)
                            })
                        )
                    } else {
                        setlistaProd(<tr style={{ textAlign: "center", width: "100%" }}>
                            <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos encontrados</span></td>
                        </tr>)
                    }
                }
            }).catch(() => {
                setLoading(false)
                setlistaProd(<tr style={{ textAlign: "center", width: "100%" }}>
                    <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos encontrados</span></td>
                </tr>)
            })
    }

    return (
        <div>
            <Modal isOpen={prodSearchModal} toggle={prodSearchToggle} size="lg" >
                <ModalHeader toggle={prodSearchToggle}>Buscar Cliente</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        Find();
                    }}>
                        <Row>
                            <Col md="10">
                                <FormGroup>
                                    <Label for="dataFindTxt">Producto</Label>
                                    <Input
                                        type="text"
                                        id="dataFindTxt"
                                        placeholder="Nombre, cod. de bara, proveedor, etc"
                                        value={dataFind}
                                        required
                                        onChange={e => {
                                            e.preventDefault();
                                            setDataFind(e.target.value)
                                        }}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2">
                                <button
                                    className='btn btn-primary'
                                    style={{ marginTop: "31px" }}
                                    type='submit'
                                >
                                    Buscar
                                </button>
                            </Col>
                        </Row>
                    </Form>
                    {
                        loading ?
                            <div style={{ textAlign: "center" }}>
                                <Spinner type="grow" color="blue" style={{ height: "150px", width: "150px" }} />
                            </div> :
                            <ListadoTable
                                titulos={titulos}
                                listado={listaProd}
                            />
                    }
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ModalSearchProd