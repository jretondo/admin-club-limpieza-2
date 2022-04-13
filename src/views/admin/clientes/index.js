import React, { useState, useEffect } from 'react'

//NPM Modules
import {
    Container,
    Spinner
} from "reactstrap"

//Custom Hooks
import { Redirect } from "react-router-dom"
import { useActividad } from '../../../Hooks/UseNvaActividad'

//Links to Server
import UrlNodeServer from '../../../api/NodeServer'

//My modules
import AlertaForm from 'components/subComponents/Alertas/Alerta1'
import Header from "components/Headers/Header.js"

import { UseSecureRoutes } from 'Hooks/UseSecureRoutes'
import ListaClientesMod from './lista'
import CtaCteListClientMod from './ctacte'

const ClientesView = () => {
    //user massages
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [call, setCall] = useState(false)

    //Activities
    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")
    const [verCtaCteBool, setVerCtaCteBool] = useState(false)
    const [idCtaCte, setIdCtaCte] = useState(0)
    const [nombreCtaCte, setNombreCtaCte] = useState("")

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line 
    }, [])


    useActividad(
        nvaActCall,
        actividadStr
    )

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.clientes,
        call
    )

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
                <AlertaForm
                    success={successAlert}
                    msgStrong={msgStrongAlert}
                    msgGral={msgGralAlert}
                    alertar={alertar}
                />
                <Header />
                <Container className="mt--7" fluid>
                    {
                        verCtaCteBool ?
                            <CtaCteListClientMod
                                idCliente={idCtaCte}
                                nombreCliente={nombreCtaCte}
                                setVerCtaCteBool={setVerCtaCteBool}
                                call={call}
                                setCall={setCall}
                            /> :
                            <ListaClientesMod
                                setAlertar={setAlertar}
                                setMsgStrong={setMsgStrong}
                                setMsgGralAlert={setMsgGralAlert}
                                setSuccessAlert={setSuccessAlert}
                                setNvaActCall={setNvaActCall}
                                setActividadStr={setActividadStr}
                                setVerCtaCteBool={setVerCtaCteBool}
                                setIdCtaCte={setIdCtaCte}
                                call={call}
                                setCall={setCall}
                                nvaActCall={nvaActCall}
                                alertar={alertar}
                                setNombreCtaCte={setNombreCtaCte}
                            />
                    }
                </Container>
            </>
        )
    }
}

export default ClientesView