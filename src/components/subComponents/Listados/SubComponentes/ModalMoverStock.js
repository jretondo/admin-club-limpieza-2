import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Col, Form, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap'

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
    const [stockActOrigen, setStockActOrigen] = useState(0)
    const [stockActDestino, setStockActDestino] = useState(0)
    const [stockTotalOrigen, setStockTotalOrigen] = useState(0)
    const [stockTotalDestino, setStockTotalDestino] = useState(0)
    const [ptoVtaOrigen, setPtoVtaOrigen] = useState({ id: 0 })
    const [ptoVtaDestino, setPtoVtaDestino] = useState({ id: 0 })
    const [plantPtosVta, setPlantPtosVta] = useState(<></>)

    useEffect(() => {
        ListaPV()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (modal) {
            StockActualListaOrigen()
        }
        // eslint-disable-next-line
    }, [ptoVtaOrigen, modal])

    useEffect(() => {
        if (modal) {
            StockActualListaDestino()
        }
        // eslint-disable-next-line
    }, [ptoVtaDestino, modal])

    useEffect(() => {
        if (modal && !loading) {
            selectElement()
        }
    }, [modal, loading])

    useEffect(() => {
        ActualizaTotalNvo()
        // eslint-disable-next-line
    }, [nvoStock, stockActOrigen, stockActDestino])


    const selectElement = () => {
        setTimeout(() => {
            try {
                document.getElementById("nvoStockTxt").focus();
                document.getElementById("nvoStockTxt").select();
            } catch (error) {

            }
        }, 200);
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

    const StockActualListaOrigen = async () => {
        console.log('pasa origen:>> ');
        const query = `?idProd=${item.id_prod}&idPv=${ptoVtaOrigen.id}`
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
                    setStockActOrigen(resultado[0].stock)
                } else {
                    setStockActOrigen(0)
                }
            })
            .catch(() => {
            })
    }

    const StockActualListaDestino = async () => {
        console.log('pasa destino:>> ');
        const query = `?idProd=${item.id_prod}&idPv=${ptoVtaDestino.id}`

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
                    setStockActDestino(resultado[0].stock)
                } else {
                    setStockActDestino(0)
                }
            })
            .catch(() => {
            })
    }

    const ActualizaTotalNvo = () => {
        setStockTotalDestino(parseInt(stockActDestino) + parseInt(nvoStock))
        setStockTotalOrigen(parseInt(stockActOrigen) - parseInt(nvoStock))
    }

    const MoverStockFunct = async () => {
        if (parseInt(ptoVtaDestino.id) === parseInt(ptoVtaOrigen.id)) {
            setMsgStrong("No puede destinar el stock al mismo punto que el origen! ")
            setMsgGralAlert("")
            setSuccessAlert(false)
            setAlertar(!alertar)
        } else {
            const origen = {
                idProd: item.id_prod,
                pv_id: ptoVtaOrigen.id,
                nvoStockSingle: (- nvoStock),
                obs: "Mover Stock",
                costo: item.precio_compra,
                iva: item.iva
            }
            const destino = {
                idProd: item.id_prod,
                pv_id: ptoVtaDestino.id,
                nvoStockSingle: nvoStock,
                obs: "Mover Stock",
                costo: item.precio_compra,
                iva: item.iva
            }

            const data = {
                origen,
                destino
            }
            setLoading(true)
            await axios.post(UrlNodeServer.stockDir.sub.moverStock, data, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            })
                .then(res => {
                    setLoading(false)
                    const respuesta = res.data
                    const status = parseInt(respuesta.status)
                    if (status === 200) {
                        setActividadStr(`El usuario ha movido ${nvoStock} unidades del producto con ID ${item.id_prod} desde el PV ${ptoVtaOrigen.id} al punto ${ptoVtaDestino.id}`)
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
    }

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault();
                MoverStockFunct();
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                <h3>Mover Stock</h3>
                                <h2>{item.name}</h2>
                            </ModalHeader>
                            <ModalBody>
                                <Row>
                                    <Col md="4" >
                                        <FormGroup>
                                            <label
                                                className="form-control-label"
                                                htmlFor="nvoStockTxt"
                                            >
                                                Cantidad a Mover
                                            </label>
                                            <Input
                                                className="form-control-alternative"
                                                id="input-username"
                                                placeholder="Nombre del Producto..."
                                                type="number"
                                                value={nvoStock}
                                                onChange={e => setNvoStock(e.target.value)}
                                                min={1}
                                                max={stockActOrigen}
                                                step={1}
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
                                </Row>
                                <Row>
                                    <Col lg="5" style={{ border: "2px solid red" }} >
                                        <Row>
                                            <Col md="12" >
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="nvoStockTxt"
                                                    >
                                                        Origen
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-username"
                                                        type="select"
                                                        onChange={e => setPtoVtaOrigen(JSON.parse(e.target.value))}
                                                        required
                                                    >
                                                        <option value={JSON.stringify({ id: 0 })}>Deposito</option>
                                                        {plantPtosVta}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" >
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="nvoStockTxt"
                                                    >
                                                        Stock Origen
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-username"
                                                        placeholder="Nombre del Producto..."
                                                        type="number"
                                                        value={stockActOrigen}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" >
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="nvoStockTxt"
                                                    >
                                                        Nuevo Stock Origen
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-username"
                                                        placeholder="Nombre del Producto..."
                                                        type="number"
                                                        value={stockTotalOrigen}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md="2" style={{ textAlign: "center" }} >
                                        <i style={{ marginTop: "35px", marginBottom: "35px", fontSize: "30px" }} className="fas fa-arrow-right"></i>
                                    </Col>
                                    <Col lg="5" style={{ border: "2px solid red" }} >
                                        <Row>
                                            <Col md="12" >
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="nvoStockTxt"
                                                    >
                                                        Destino
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-username"
                                                        placeholder="Nombre del Producto..."
                                                        type="select"
                                                        onChange={e => setPtoVtaDestino(JSON.parse(e.target.value))}
                                                        required
                                                    >
                                                        <option value={JSON.stringify({ id: 0 })}>Deposito</option>
                                                        {plantPtosVta}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" >
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="nvoStockTxt"
                                                    >
                                                        Stock Destino
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-username"
                                                        placeholder="Nombre del Producto..."
                                                        type="number"
                                                        value={stockActDestino}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" >
                                                <FormGroup>
                                                    <label
                                                        className="form-control-label"
                                                        htmlFor="nvoStockTxt"
                                                    >
                                                        Nuevo Stock Destino
                                                    </label>
                                                    <Input
                                                        className="form-control-alternative"
                                                        id="input-username"
                                                        placeholder="Nombre del Producto..."
                                                        type="number"
                                                        value={stockTotalDestino}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
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