import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap';
import formatMoney from 'Function/NumberFormat';
import moment from 'moment';
import FileSaver from 'file-saver';
import swal from 'sweetalert';

const ModalDevPart = ({
    modal,
    toggle,
    idFact
}) => {
    const [detStay, setDetStay] = useState([])
    const [detDelete, setDetDelete] = useState([])
    const [plantStay, setPlantStay] = useState(<></>)
    const [plantDelete, setPlantDelete] = useState(<></>)
    const [totalDelete, setTotalDelete] = useState(0)
    const [loading, setLoading] = useState(false)

    const getDetFact = async () => {
        setLoading(true)
        await axios.get(UrlNodeServer.invoicesDir.sub.detFact + "/" + idFact, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            if (respuesta.status === 200) {
                setPlantDelete(<></>)
                setPlantStay(<></>)
                setDetStay([])
                setDetDelete([])
                setDetStay(respuesta.body)
                createDelete()
                createStay()
            }
        }).catch(() => {
            setDetStay([])
        }).finally(() => setLoading(false))
    }

    useEffect(() => {
        getDetFact()
        // eslint-disable-next-line
    }, [modal, idFact])

    const toDelete = (key, item) => {
        let list = detStay
        list.splice(key, 1)
        setDetStay(list)
        let list2 = detDelete
        list2.push(item)
        setDetDelete(list2)
        createDelete()
        createStay()
    }

    const toStay = (key, item) => {
        let list = detDelete
        list.splice(key, 1)
        setDetDelete(list)
        let list2 = detStay
        list2.push(item)
        setDetStay(list2)
        createDelete()
        createStay()
    }
    const createStay = () => {
        if (detStay.length > 0) {
            setPlantStay(
                detStay.map((item, key) => {
                    return (
                        <Row key={key} style={{ marginTop: "15px" }}>
                            <Col md="7">
                                <Input value={item.nombre_prod} disabled />
                            </Col>
                            <Col md="3">
                                <Input style={{ textAlign: "right" }} value={"$ " + formatMoney(item.total_prod)} disabled />
                            </Col>
                            <Col md="2">
                                <Button
                                    color="danger"
                                    onClick={e => {
                                        e.preventDefault();
                                        toDelete(key, item)
                                    }}
                                >
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </Button>
                            </Col>
                        </Row>
                    )
                })
            )
        } else {
            setPlantStay(<></>)
        }
    }

    const createDelete = () => {
        if (detDelete.length > 0) {
            let totDel = 0
            setPlantDelete(
                detDelete.map((item, key) => {
                    totDel = totDel + item.total_prod
                    if (key === detDelete.length - 1) {
                        setTotalDelete(totDel)
                    }
                    return (
                        <Row key={key} style={{ marginTop: "15px" }}>
                            <Col md="7">
                                <Input value={item.nombre_prod} disabled />
                            </Col>
                            <Col md="3">
                                <Input style={{ textAlign: "right" }} value={"$ " + formatMoney(item.total_prod)} disabled />
                            </Col>
                            <Col md="2">
                                <Button
                                    color="success"
                                    onClick={e => {
                                        e.preventDefault();
                                        toStay(key, item)
                                    }}
                                >
                                    <i className="fa fa-check" aria-hidden="true"></i>
                                </Button>
                            </Col>
                        </Row>
                    )
                })
            )
        } else {
            setTotalDelete(0)
            setPlantDelete(<></>)
        }
    }

    const generarNC = async () => {
        setLoading(true)
        const data = {
            fecha: moment(new Date()).format("YYYY-MM-DD"),
            prodList: detDelete,
            idFact: idFact
        }
        await axios.post(UrlNodeServer.invoicesDir.sub.notaCredPart, data, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                Accept: 'application/pdf',
            }
        }).then(res => {
            let headerLine = res.headers['content-disposition'];
            const largo = parseInt(headerLine.length)
            let filename = headerLine.substring(21, largo);
            var blob = new Blob([res.data], { type: "application/pdf" });
            FileSaver.saveAs(blob, filename);
            swal("Nota de Credito", "La Nota de Crédito se genero exitosamente!", "success");
        }).catch(error => {
            swal("Error!", "Hubo un error al querer generar la Nota de Crédito. Error: " + error.message, "error");
        }).finally(() => {
            setLoading(false)
            toggle()
        })
    }

    return (
        <Modal size="lg" isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Devolución Parcial
            </ModalHeader>
            <ModalBody>
                {
                    !loading ?
                        <>
                            <Row>
                                <Col md="12">
                                    <h3>Detalles de la factura</h3>
                                    {plantStay}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="12">
                                    <h3>Items a anular de la factura</h3>
                                    {plantDelete}
                                </Col>
                            </Row>
                            <hr />
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label>Total a eliminar</Label>
                                        <Input disabled style={{ fontSize: "18px", fontWeight: "bold" }} value={"$ " + formatMoney(totalDelete)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </>
                        :
                        <Row>
                            <Col md="12" style={{ textAlign: "center" }}>
                                <Spinner color="primary" style={{ width: "150px", height: "150px" }} />
                            </Col>
                        </Row>
                }

            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={e => {
                    e.preventDefault()
                    generarNC()
                }}
                    disabled={loading}
                >
                    Generar NC
                </Button>
                <Button disabled={loading} color="danger" onClick={toggle}>
                    Cerrar
                </Button>
            </ModalFooter>
        </Modal>
    )
}
export default ModalDevPart