import UrlNodeServer from '../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner
} from 'reactstrap';
import swal from 'sweetalert';

const ModalChangeCodBarras = ({
    setModal,
    modal,
    item,
    setCall,
    call
}) => {
    const [loading, setLoading] = useState(false)
    const [codBarra, setCodBarra] = useState("")

    const asignarCod = async (id, cod) => {
        const data = {
            codBarras: cod
        }
        setLoading(true)
        await axios.put(UrlNodeServer.productsDir.sub.codBarra + "/" + id, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const affectedRows = respuesta.body.affectedRows
                console.log('affectedRows :>> ', affectedRows);
                if (affectedRows > 0) {
                    swal(`Cambios en ${item.name}!`, "Código de barras cambiado con éxito!", "success");
                } else {
                    swal(`Cambios en ${item.name}!`, "Hubo un error inesperado", "error");
                }
            } else {
                swal(`Cambios en ${item.name}!`, "Hubo un error inesperado", "error");
            }
        }).catch((error) => {
            swal(`Cambios en ${item.name}!`, "Hubo un error inesperado", "error");
            console.log('error :>> ', error);
        }).finally(() => {
            setTimeout(() => {
                setCall(!call)
            }, 1500);
            setLoading(false)
        })

    }

    useEffect(() => {
        if (modal) {
            try {
                setTimeout(() => {
                    document.getElementById("codbarraTxt").focus()
                }, 500);
            } catch (error) {
                console.log('error :>> ', error);
            }
        }
    }, [modal])

    return (
        <Modal isOpen={modal} toggle={() => setModal(!modal)} size="lg" >
            <Form onSubmit={e => {
                e.preventDefault()
                asignarCod(item.id_prod, codBarra)
            }}>
                {
                    loading ?
                        <>
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                        </> :
                        <>
                            <ModalHeader toggle={() => setModal(!modal)}>
                                <h3>Asignar Código de Barras</h3>
                                <h2 style={{ color: "#0081c9" }}>{item.name}</h2>
                            </ModalHeader>
                            <ModalBody>
                                <FormGroup>
                                    <Label for="codbarraTxt">Útilice la lectora para leer el código</Label>
                                    <Input value={codBarra} onChange={e => setCodBarra(e.target.value)} type="text" id="codbarraTxt" placeholder="Código de barras..." />
                                </FormGroup>
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

export default ModalChangeCodBarras