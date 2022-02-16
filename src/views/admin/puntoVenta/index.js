import React, { useState } from "react"
import { useActividad } from '../../../Hooks/UseNvaActividad'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Container,
    Spinner
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js"
import UrlNodeServer from '../../../api/NodeServer'
import AlertaForm from '../../../components/subComponents/Alertas/Alerta1'
import { UseSecureRoutes } from "Hooks/UseSecureRoutes";
import ListPtoVta from "./components/list"
import FormPtoVta from './components/form'

const ProductsItems = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")

    const [nvaOffer, setNvaOffer] = useState(false)
    const [call, setCall] = useState(false)
    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.ptosVta,
        call
    )

    useActividad(
        nvaActCall,
        actividadStr
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
                    <ListPtoVta
                        detallesBool={detallesBool}
                        nvaOffer={nvaOffer}
                        setNvaOffer={setNvaOffer}
                        setCall={setCall}
                        call={call}
                        setActividadStr={setActividadStr}
                        nvaActCall={nvaActCall}
                        setNvaActCall={setNvaActCall}
                        alertar={alertar}
                        setAlertar={setAlertar}
                        setMsgStrong={setMsgStrong}
                        setMsgGralAlert={setMsgGralAlert}
                        setSuccessAlert={setSuccessAlert}
                        setDetallesBool={setDetallesBool}
                        setIdDetalle={setIdDetalle}
                    />
                    <FormPtoVta
                        detallesBool={detallesBool}
                        idDetalle={idDetalle}
                        call={call}
                        setCall={setCall}
                        alertar={alertar}
                        setAlertar={setAlertar}
                        setMsgStrong={setMsgStrong}
                        setMsgGralAlert={setMsgGralAlert}
                        setSuccessAlert={setSuccessAlert}
                        setDetallesBool={setDetallesBool}
                        setNvaOffer={setNvaOffer}
                        nvaOffer={nvaOffer}
                    />
                </Container>
            </>
        )
    }
}

export default ProductsItems;
