import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import ListadoTable from 'components/subComponents/Listados/ListadoTable'
import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader, Col, Row, Spinner } from 'reactstrap'
import FilaUsuario from 'components/subComponents/Listados/SubComponentes/FilaUsuarios'
import BusquedaProdForm from 'components/subComponents/Productos/BusquedaForm'
import Paginacion from 'components/subComponents/Paginacion/Paginacion'

const titulos = ["Nombre", "Usuario", "Email", ""]

const UserList = ({
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    nvaActCall,
    setNvaActCall,
    setActividadStr,
    nvaOffer,
    setNvaOffer,
    call,
    setCall,
    setDetBool,
    setIdDetalle,
    setPermisosBool,
    setIdPermisos,
    setUsuarioPermiso
}) => {
    const [loading, setloading] = useState(false)
    const [listado, setListado] = useState([])
    const [pagina, setPagina] = useState(1)
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [dataState, setDataState] = useState([])
    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")

    useEffect(() => {
        ListarUsuarios()
        // eslint-disable-next-line 
    }, [call])

    const ListarUsuarios = async () => {
        let data = {
            query: ""
        }
        if (busquedaBool) {
            data = {
                query: palabraBuscada
            }
        }
        setloading(true)
        await axios.get(`${UrlNodeServer.usuariosDir.usuarios}/${pagina}`, {
            params: data,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setloading(false)
                const body = res.data.body
                const status = parseInt(res.data.status)
                if (status === 200) {
                    const data = body.data
                    const pagesObj = body.pagesObj

                    let totallista
                    try {
                        totallista = parseInt(pagesObj.totalPag)
                    } catch (error) {
                        totallista = 0
                    }
                    if (totallista === 0) {
                        setListado(
                            <tr style={{ textAlign: "center", width: "100%" }}>
                                <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos cargados</span></td>
                            </tr>
                        )
                    } else {
                        setDataState(pagesObj)
                        setUltimaPag(pagesObj.totalPag)
                        setListado(
                            data.map((item, key) => {
                                let primero
                                if (key === 0) {
                                    primero = true
                                } else {
                                    primero = false
                                }
                                return (
                                    <FilaUsuario
                                        id={key}
                                        key={key}
                                        item={item}
                                        setActividadStr={setActividadStr}
                                        nvaActCall={nvaActCall}
                                        setNvaActCall={setNvaActCall}
                                        alertar={alertar}
                                        setAlertar={setAlertar}
                                        setMsgStrong={setMsgStrong}
                                        setMsgGralAlert={setMsgGralAlert}
                                        setSuccessAlert={setSuccessAlert}
                                        setCall={setCall}
                                        call={call}
                                        setEsperar={setloading}
                                        nvaOffer={nvaOffer}
                                        setDetallesBool={setDetBool}
                                        setIdDetalle={setIdDetalle}
                                        primero={primero}
                                        pagina={pagina}
                                        setPagina={setPagina}
                                        setNvaOffer={setNvaOffer}
                                        setPermisosBool={setPermisosBool}
                                        setIdPermisos={setIdPermisos}
                                        setUsuarioPermiso={setUsuarioPermiso}
                                    />
                                )
                            })
                        )
                    }
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos cargados</span></td>
                        </tr>
                    )
                    setUltimaPag(1)
                }
            })
            .catch(() => {
                setloading(false)
                setListado(
                    <tr style={{ textAlign: "center", width: "100%" }}>
                        <td> <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay productos cargados</span></td>
                    </tr>
                )
                setUltimaPag(1)
            })
    }

    return (
        <Card>
            <CardHeader className="border-0">
                <Row>
                    <Col md="4" >
                        <h2 className="mb-0">Lista de Usuarios</h2>
                    </Col>
                    <Col md="8" style={{ textAlign: "right" }}>
                        <BusquedaProdForm
                            busquedaBool={busquedaBool}
                            setPalabraBuscada={setPalabraBuscada}
                            palabraBuscada={palabraBuscada}
                            setBusquedaBool={setBusquedaBool}
                            call={call}
                            setCall={setCall}
                            titulo="Buscar un Usuario"
                        />
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col>
                        {
                            !loading ?
                                <ListadoTable
                                    listado={listado}
                                    titulos={titulos}
                                /> :
                                <div style={{ textAlign: "center", marginTop: "0" }}>
                                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
                                </div>
                        }
                    </Col>
                </Row>
            </CardBody>
            <CardFooter>
                <Row>
                    <Col md="6">
                        <button
                            className="btn btn-primary"
                            onClick={e => {
                                e.preventDefault();
                                setNvaOffer(true);
                            }}
                        >
                            Nuevo Usuario
                        </button>
                    </Col>
                    <Col>
                        <Paginacion
                            setPagina={setPagina}
                            setCall={setCall}
                            pagina={pagina}
                            call={call}
                            plantPaginas={plantPaginas}
                            ultimaPag={ultimaPag}
                            data={dataState}
                            setPlantPaginas={setPlantPaginas}
                            setUltimaPag={setUltimaPag}
                        />
                    </Col>
                </Row>
            </CardFooter>
        </Card>
    )
}

export default UserList