import UrlNodeServer from '../../../../../../api/NodeServer'
import axios from 'axios'
import ListadoTable from 'components/subComponents/Listados/ListadoTable'
import React, { useState } from 'react'
import { Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap'
import FilaClientesSearch from 'components/subComponents/Listados/SubComponentes/FilaClienteSearch'

const titulos = ["CUIT", "Nombre", "Cond. IVA", ""]

const ModalSearchCuit = ({
    cuitSearchToggle,
    cuitSearchModal,
    setTipoDoc,
    setEmailCliente,
    setNdoc,
    setRazSoc,
    setEnvioEmailBool
}) => {
    const [loading, setLoading] = useState(false)
    const [dataFind, setDataFind] = useState("")
    const [listaClientes, setListaClientes] = useState(
        <tr>
            <td>
                No hay clientes listados
            </td>
        </tr>
    )

    const Find = async () => {
        setLoading(true)
        await axios.get(`${UrlNodeServer.clientesDir.clientes}/${1}`, {
            params: {
                search: dataFind,
                cantPerPage: 15
            },
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body
                    if (body.pagesObj.totalPag > 0) {
                        setListaClientes(
                            body.data.map((item, key) => {
                                return (
                                    <FilaClientesSearch
                                        id={key}
                                        key={key}
                                        item={item}
                                        setTipoDoc={setTipoDoc}
                                        setEmailCliente={setEmailCliente}
                                        setNdoc={setNdoc}
                                        setRazSoc={setRazSoc}
                                        cuitSearchToggle={cuitSearchToggle}
                                        setEnvioEmailBool={setEnvioEmailBool}
                                    />
                                )
                            })
                        )
                    } else {
                        setListaClientes(
                            <tr style={{ textAlign: "center", width: "100%" }}>
                                <td>
                                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes cargados</span>
                                </td>
                            </tr>
                        )
                    }
                } else {
                    setListaClientes(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes listados</span>
                            </td>
                        </tr>
                    )
                }
            })
            .catch(() => {
                setLoading(false)
                setListaClientes(
                    <tr style={{ textAlign: "center", width: "100%" }}>
                        <td>
                            <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}>No hay clientes listados</span>
                        </td>
                    </tr>
                )
            })
    }

    return (
        <div>
            <Modal isOpen={cuitSearchModal} toggle={cuitSearchToggle} size="lg" >
                <ModalHeader toggle={cuitSearchToggle}>Buscar Cliente</ModalHeader>
                <ModalBody>
                    <Form onSubmit={e => {
                        e.preventDefault();
                        Find();
                    }}>
                        <Row>
                            <Col md="10">
                                <FormGroup>
                                    <Label for="dataFindTxt">Cliente</Label>
                                    <Input
                                        type="text"
                                        id="dataFindTxt"
                                        placeholder="Nombre, CUIT, telefóno, etc"
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
                                listado={listaClientes}
                            />
                    }
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default ModalSearchCuit