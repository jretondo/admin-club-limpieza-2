import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Col, Container, Input, Row, Spinner } from 'reactstrap'

const UserPermissions = ({
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    nvaActCall,
    setNvaActCall,
    setActividadStr,
    setNvaOffer,
    idPermisos,
    usuarioPermiso
}) => {
    const [permissionsDisp, setPermissionsDisp] = useState([])
    const [nvosPermisos, setNvosPermisos] = useState([])
    const [plantPerDisp, setPlantPerDisp] = useState(<></>)
    const [plantUsuPerm, setPlantUsuPerm] = useState(<></>)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        ListPermissionsUsu()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        PlantPermissions()
        // eslint-disable-next-line
    }, [nvosPermisos.length, permissionsDisp.length])

    const ListPermissionsUsu = async () => {
        setLoading(true)
        await axios.get(`${UrlNodeServer.permissionsDir.permissions}/${idPermisos}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setPermissionsDisp(respuesta.body.permisos)
                    setNvosPermisos(respuesta.body.userPermissions)
                } else {
                    setPermissionsDisp([])
                    setNvosPermisos([])
                }
            })
            .catch(() => {
                setLoading(false)
                setPermissionsDisp([])
                setNvosPermisos([])
            })
    }

    const DeletePermission = (key, item) => {
        let list = nvosPermisos
        list.splice(key, 1)
        setNvosPermisos(list)
        let list2 = permissionsDisp
        list2.push({
            id: item.id,
            module_name: item.module_name
        })
        setPermissionsDisp(list2)
        PlantPermissions()
    }

    const AddPermissions = (key, item) => {
        let list = permissionsDisp
        list.splice(key, 1)
        setPermissionsDisp(list)
        let list2 = nvosPermisos
        list2.push({
            id: item.id,
            id_user: idPermisos,
            id_permission: item.id,
            module_name: item.module_name
        })
        setNvosPermisos(list2)
        PlantPermissions()
    }

    const PlantPermissions = () => {
        if (nvosPermisos.length > 0) {
            setPlantUsuPerm(
                // eslint-disable-next-line
                nvosPermisos.map((item, key) => {
                    return (
                        <Row key={key} style={{ marginTop: "15px" }}>
                            <Col md="10">
                                <Input value={item.module_name} disabled />
                            </Col>
                            <Col md="2">
                                <button
                                    className="btn btn-danger"
                                    onClick={e => {
                                        e.preventDefault();
                                        DeletePermission(key, item);
                                    }}
                                >
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </button>
                            </Col>
                        </Row>
                    )
                })
            )
        } else {
            setPlantUsuPerm(<></>)
        }

        if (permissionsDisp.length > 0) {
            setPlantPerDisp(
                // eslint-disable-next-line
                permissionsDisp.map((item, key) => {
                    return (
                        <Row key={key} style={{ marginTop: "15px" }}>
                            <Col md="10">
                                <Input value={item.module_name} disabled />
                            </Col>
                            <Col md="2">
                                <button
                                    className="btn btn-success"
                                    onClick={e => {
                                        e.preventDefault();
                                        AddPermissions(key, item);
                                    }}
                                >
                                    <i className="fas fa-check" aria-hidden="true"></i>
                                </button>
                            </Col>
                        </Row>
                    )
                })
            )
        } else {
            setPlantPerDisp(<></>)
        }
    }

    const NvoPermisos = async () => {
        const permisos = await new Promise((resolve, reject) => {
            setLoading(true)
            let list = []
            if (nvosPermisos.length > 0) {
                // eslint-disable-next-line
                nvosPermisos.map((item, key) => {
                    list.push({
                        idPermiso: item.id_permission
                    })
                    if (key === nvosPermisos.length - 1) {
                        resolve(list)
                    }
                })
            } else {
                resolve([])
            }
        })

        const data = {
            permisos: permisos,
            idUser: idPermisos
        }

        await axios.post(UrlNodeServer.permissionsDir.permissions, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 201) {
                    setActividadStr("El usuario a modificado los permisos del ususario con id " + idPermisos)
                    setMsgStrong("Permisos creados con éxito!")
                    setMsgGralAlert("")
                    setNvaActCall(!nvaActCall)
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    setNvaOffer(false)
                } else {
                    setMsgStrong("Hubo un error!")
                    setMsgGralAlert(" Intente nuevamente.")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setLoading(false)
                setMsgStrong("Hubo un error!")
                setMsgGralAlert(" Intente nuevamente.")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "0" }}>
                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            </div>
        )
    } else {
        return (
            <Card>
                <CardHeader>
                    <Row>
                        <Col md="10">
                            <h2>{`Permisos para el usuario ${usuarioPermiso}`}</h2>
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
                    <Container>
                        <Row>
                            <Col>
                                <h2>Permisos otorgados al usuario:</h2>
                            </Col>
                        </Row>
                        {plantUsuPerm}
                    </Container>

                    <Container style={{ marginTop: "50px" }} >
                        <Row>
                            <Col>
                                <h2>Permisos disponibles para el usuario:</h2>
                            </Col>
                        </Row>
                        {plantPerDisp}
                    </Container>

                    <Container>
                        <Row>
                            <Col md="12" style={{ textAlign: "center" }}>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: "200px", margin: "25px" }}
                                    onClick={e => {
                                        e.preventDefault();
                                        NvoPermisos();
                                    }}
                                >
                                    Confirmar Permisos
                                </button>

                                <button
                                    className="btn btn-danger"
                                    style={{ width: "200px", margin: "25px" }}
                                    onClick={e => {
                                        e.preventDefault();
                                        setNvaOffer(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </Col>
                        </Row>
                    </Container>

                </CardBody>
            </Card>
        )
    }
}

export default UserPermissions