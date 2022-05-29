import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, FormGroup, Label, Input, Button } from 'reactstrap';
import swal from 'sweetalert';
import ModalChange from './modalChange';
const ModalPago = ({
    modal,
    toggle,
    variosPagos,
    setVariosPagos,
    clienteBool,
    factFiscBool
}) => {
    const [tipoPago, setTipoPago] = useState(0)
    const [tipoTXt, setTipoTxt] = useState("Efectivo")
    const [importe, setImporte] = useState(0)
    const [changeModal, setChangeModal] = useState(false)

    const nvoPago = () => {
        setVariosPagos((variosPagos) => [...variosPagos, {
            tipo: tipoPago,
            tipo_txt: tipoTXt,
            importe: importe
        }])
        swal("Agregado con éxito!", "", "success")
        setImporte(0)
        try {
            document.getElementById("impPAgosTxt").focus()
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    return (
        <>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Nuevo método de pago
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md="6" >
                            <FormGroup>
                                <Label for="factFiscTxt">Forma de Pago</Label>
                                <Row>
                                    <Col md={12}>
                                        <Input type="select" value={tipoPago} id="factFiscTxt" onChange={e => {
                                            setTipoPago(e.target.value)
                                            setTipoTxt(e.target[e.target.selectedIndex].text)
                                        }} >
                                            <option value={0}>Efectivo</option>
                                            {
                                                parseInt(factFiscBool) === 1 ?
                                                    <>  <option value={1}>Mercado Pago</option>
                                                        <option value={2}>Débito</option>
                                                        <option value={3}>Crédito</option>
                                                    </> : null
                                            }
                                            {
                                                parseInt(clienteBool) === 1 ?
                                                    <option value={4}>Cuenta Corriente</option> :
                                                    null
                                            }
                                        </Input>
                                    </Col>
                                    {
                                        parseInt(tipoPago) === 0 ?
                                            <Col>
                                                <Button color={"success"} onClick={() => setChangeModal(!changeModal)}>
                                                    Cambio
                                                </Button>
                                            </Col> : null
                                    }
                                </Row>
                            </FormGroup>
                        </Col>
                        <Col md="6">
                            <FormGroup>
                                <Label for="impPAgosTxt">Importe</Label>
                                <Input type="number" min={0.01} step={0.01} value={importe} id="impPAgosTxt" onChange={e => setImporte(e.target.value)} />
                            </FormGroup>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={e => {
                        e.preventDefault()
                        nvoPago()
                    }}>
                        Aceptar
                    </Button>
                    <Button color="danger" onClick={e => {
                        e.preventDefault()
                        toggle()
                    }}>
                        Cancelar
                    </Button>
                </ModalFooter>
            </Modal>
            <ModalChange
                modal={changeModal}
                toggle={() => setChangeModal(!changeModal)}
                importe={importe}
            />
        </>
    )
}

export default ModalPago