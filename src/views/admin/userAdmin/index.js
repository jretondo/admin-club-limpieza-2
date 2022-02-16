import UrlNodeServer from '../../../api/NodeServer'
import React, { useEffect, useState } from 'react'
import { UseSecureRoutes } from 'Hooks/UseSecureRoutes'
import Alert1 from 'components/subComponents/Alertas/Alerta1'
import { Container, Spinner } from 'reactstrap'
import { Redirect } from 'react-router'
import Header from "components/Headers/Header.js";
import UserList from './list'
import UserForm from './form'
import { useActividad } from 'Hooks/UseNvaActividad'
import UserPermissions from './permissions'

const UserAdmin = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)

    const [nvaOffer, setNvaOffer] = useState(false)
    const [detBool, setDetBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)
    const [permisosBool, setPermisosBool] = useState(false)
    const [idPermisos, setIdPermisos] = useState(0)
    const [usuarioPermiso, setUsuarioPermiso] = useState("")

    const [call, setCall] = useState(false)

    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")

    useActividad(
        nvaActCall,
        actividadStr
    )

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.userAdmin,
        call
    )

    useEffect(() => {
        if (detBool || permisosBool) {
            setNvaOffer(true)
        }
    }, [detBool, permisosBool])

    useEffect(() => {
        if (!nvaOffer) {
            setDetBool(false)
            setPermisosBool(false)
        }
    }, [nvaOffer])

    if (error) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            </div>
        )
    } else {

        return (
            <>
                <Alert1
                    success={successAlert}
                    msgStrong={msgStrongAlert}
                    msgGral={msgGralAlert}
                    alertar={alertar}
                />
                <Header />
                <Container className="mt--7" fluid>
                    {
                        !nvaOffer ?
                            <UserList
                                alertar={alertar}
                                setAlertar={setAlertar}
                                setMsgStrong={setMsgStrong}
                                setMsgGralAlert={setMsgGralAlert}
                                setSuccessAlert={setSuccessAlert}
                                nvaActCall={nvaActCall}
                                setNvaActCall={setNvaActCall}
                                setActividadStr={setActividadStr}
                                nvaOffer={nvaOffer}
                                setNvaOffer={setNvaOffer}
                                call={call}
                                setCall={setCall}
                                setDetBool={setDetBool}
                                setIdDetalle={setIdDetalle}
                                setPermisosBool={setPermisosBool}
                                setIdPermisos={setIdPermisos}
                                setUsuarioPermiso={setUsuarioPermiso}
                            /> :
                            permisosBool ?
                                <UserPermissions
                                    alertar={alertar}
                                    setAlertar={setAlertar}
                                    setMsgStrong={setMsgStrong}
                                    setMsgGralAlert={setMsgGralAlert}
                                    setSuccessAlert={setSuccessAlert}
                                    nvaActCall={nvaActCall}
                                    setNvaActCall={setNvaActCall}
                                    setActividadStr={setActividadStr}
                                    setNvaOffer={setNvaOffer}
                                    idPermisos={idPermisos}
                                    usuarioPermiso={usuarioPermiso}
                                />
                                :
                                <UserForm
                                    alertar={alertar}
                                    setAlertar={setAlertar}
                                    setMsgStrong={setMsgStrong}
                                    setMsgGralAlert={setMsgGralAlert}
                                    setSuccessAlert={setSuccessAlert}
                                    nvaActCall={nvaActCall}
                                    setNvaActCall={setNvaActCall}
                                    setActividadStr={setActividadStr}
                                    setNvaOffer={setNvaOffer}
                                    idDetalle={idDetalle}
                                    detBool={detBool}
                                />
                    }

                </Container>
            </>
        )
    }
}

export default UserAdmin