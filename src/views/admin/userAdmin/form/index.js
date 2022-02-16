import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap'

const UserForm = ({
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    nvaActCall,
    setNvaActCall,
    setActividadStr,
    setNvaOffer,
    idDetalle,
    detBool
}) => {
    const [nombre, setnombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [usuario, setUsuario] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setloading] = useState(false)
    const [ptoVtaSelect, setPtoVtaSelect] = useState(0)
    const [plantPtosVta, setPlantPtosVta] = useState(<></>)

    useEffect(() => {
        ListaPV()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (detBool) {
            DetalleUsuarios()
        }
        // eslint-disable-next-line
    }, [detBool])

    const NvoUsuario = async () => {
        setloading(true)
        const data = {
            nombre,
            apellido,
            email,
            usuario,
            pv: ptoVtaSelect
        }

        if (detBool) {
            data.id = idDetalle
        }

        await axios.post(UrlNodeServer.usuariosDir.usuarios, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    ResetForm()
                    if (detBool) {
                        setActividadStr("El usuario a modificado al ususario " + usuario)
                        setMsgStrong("Usuario modificado con éxito!")
                        setNvaOffer(false)
                    } else {
                        setActividadStr("El usuario a agregado al ususario " + usuario)
                        setMsgStrong("Usuario agregado con éxito!")
                    }

                    setMsgGralAlert("")
                    setNvaActCall(!nvaActCall)
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setloading(false)
                } else {
                    setMsgStrong("Hubo un error!")
                    setMsgGralAlert(" Intente nuevamente.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setloading(false)
                setMsgStrong("Hubo un error!")
                setMsgGralAlert(" Intente nuevamente.")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const DetalleUsuarios = async () => {
        setloading(true)
        await axios.get(`${UrlNodeServer.usuariosDir.sub.details}/${idDetalle}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setloading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const userData = respuesta.body[0]
                    setnombre(userData.nombre)
                    setApellido(userData.apellido)
                    setUsuario(userData.usuario)
                    setEmail(userData.email)
                    setPtoVtaSelect(userData.pv)
                    document.getElementById("nameTxt").focus()
                } else {
                    setloading(false)
                    setMsgStrong("Hubo un error!")
                    setMsgGralAlert(" Intente nuevamente.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setloading(false)
                setMsgStrong("Hubo un error!")
                setMsgGralAlert(" Intente nuevamente.")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const ListaPV = async () => {
        setloading(true)
        await axios.get(`${UrlNodeServer.ptosVtaDir.ptosVta}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                setloading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const resultado = respuesta.body.data

                    setPlantPtosVta(
                        resultado.map((item, key) => {
                            return (
                                <option key={key} value={item.pv}>{item.direccion + " (PV: " + item.pv + ")"}</option>
                            )
                        })
                    )
                } else {
                    setPlantPtosVta(<></>)
                }
            })
            .catch(() => {
                setloading(false)
            })
    }

    const NombreUsu = () => {
        const letraNombre = nombre.substring(0, 1)
        const usarionombre = (letraNombre + apellido).toLowerCase()
        setUsuario(usarionombre)
    }

    const ResetForm = () => {
        setnombre("")
        setApellido("")
        setUsuario("")
        setEmail("")
    }

    return (<>
        <Card>
            <CardHeader>
                <Row>
                    <Col md="10">
                        <h2>{detBool ? `Modificar usuario ${nombre} ${apellido}` : "Usuario Nuevo"}</h2>
                    </Col>
                    <Col md="2" style={{ textAlign: "right" }}>
                        <button
                            className="btn btn-danger"
                            onClick={e => {
                                e.preventDefault();
                                setNvaOffer(false);
                            }}
                        >X</button>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                {
                    loading ?
                        <div style={{ textAlign: "center", marginTop: "0" }}>
                            <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
                        </div> :
                        <Form onSubmit={e => {
                            e.preventDefault();
                            NvoUsuario();
                        }} >
                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="nameTxt">Nombre</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="nameTxt"
                                            placeholder="Nombre del usuario..."
                                            value={nombre}
                                            onChange={e => setnombre(e.target.value)}
                                            required />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="apellidoTxt">Apellido</Label>
                                        <Input
                                            type="text"
                                            name="lastName"
                                            id="apellidoTxt"
                                            placeholder="Apellido del usuario..."
                                            value={apellido}
                                            onChange={e => setApellido(e.target.value)}
                                            required />
                                    </FormGroup>
                                </Col>
                                <Col md="4">
                                    <FormGroup>
                                        <Label for="userTxt">Usuario</Label>
                                        <Input
                                            type="text"
                                            name="user"
                                            id="userTxt"
                                            placeholder="Usuario..."
                                            value={usuario}
                                            onChange={e => setUsuario(e.target.value)}
                                            onFocus={() => NombreUsu()}
                                            required />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="emailTxt">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="emailTxt"
                                            placeholder="Email del usuario..."
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="emailTxt">Punto de Venta</Label>
                                        <Input
                                            className="form-control-alternative"
                                            id="input-username"
                                            placeholder="Nombre del Producto..."
                                            type="select"
                                            value={ptoVtaSelect}
                                            onChange={e => setPtoVtaSelect(e.target.value)}
                                            required
                                        >
                                            <option value={0}>Deposito</option>
                                            {plantPtosVta}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12" style={{ textAlign: "center" }}>
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: "150px", margin: "20px" }}
                                        type="submit"
                                    >
                                        {detBool ? "Modificar" : "Agregar"}
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        style={{ width: "150px", margin: "20px" }}
                                        onClick={e => {
                                            e.preventDefault();
                                            setNvaOffer(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </Col>
                            </Row>
                        </Form>
                }
            </CardBody>
        </Card>
    </>)
}

export default UserForm