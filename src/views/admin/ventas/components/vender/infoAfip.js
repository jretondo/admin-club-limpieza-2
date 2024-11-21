import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row, Spinner, Tooltip } from 'reactstrap';
import { BiRefresh, BiTimer } from 'react-icons/bi';
import { BsInfoCircle, BsTrash } from 'react-icons/bs';
import './infoAfip.css';
import axios from 'axios';
import UrlNodeServer from '../../../../../api/NodeServer';

const InfoAfipMod = ({
    afipStatus,
    refreshAfip,
    setRefreshAfip
}) => {
    const [tooltip, setTooltip] = useState(false)
    const [tooltip2, setTooltip2] = useState(false)
    const [processing, setProcessing] = useState(false)

    const resetToken = async () => {
        if (processing) return
        setProcessing(true)
        await axios.put(UrlNodeServer.invoicesDir.sub.resetTokenAfip, {}, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            if (res.data.status === 200) {
                swal("Token reseteado", "El token de AFIP fue reseteado con éxito", "success");
                setRefreshAfip(!refreshAfip)
            } else {
                swal("Error!", "Algo falló al querer resetear el token", "error");
            }
        }).catch(err => {
            console.log('object :>> ', err);
            swal("Error!", "Algo falló al querer resetear el token", "error");
        }).finally(() => { setProcessing(false) })
    }

    return (
        <Card style={{ marginBottom: "10px" }}>
            <CardBody style={{ padding: "0.5rem" }}>
                <Row>
                    <Col md="6" className="estadoAfip1">
                        <span>
                            Estado de los servidores de AFIP:
                        </span>
                        <span style={{ fontSize: "20px" }}></span>
                    </Col>
                    <Col md="6" className="estadoAfip2">
                        {
                            afipStatus.status === 0 ?
                                <WaitMode /> : afipStatus.status === 200 ?
                                    <SuccessMode
                                        infoStr={afipStatus.info}
                                        latencia={afipStatus.latencia}
                                    /> : afipStatus.status === 500 ?
                                        <ErrorMode
                                            errorStr={afipStatus.info}
                                        /> : <UndefinedMode />
                        }
                        <Button
                            onClick={() => setRefreshAfip(!refreshAfip)}
                            style={{ marginLeft: "15px", paddingInline: "5px", paddingTop: "2px", paddingBottom: "2px" }} color={"primary"}>
                            <BiRefresh style={{ fontSize: "20px" }} />
                        </Button>
                        <Button id="infoAfip" color={"primary"} style={{ fontSize: "20px", background: "#0081c9", color: "white", paddingInline: "5px", paddingTop: "1px", paddingBottom: "2px", borderRadius: "20%" }}><BsInfoCircle /></Button>
                        <Tooltip placement="right" isOpen={tooltip} target="infoAfip" toggle={() => setTooltip(!tooltip)}>
                            En caso de que el servidor esté muy lento y la generación de la factura demore más de 5 segundos. El proceso será interrumpido y luego se le enviará un email de aviso para descargarla consultandola en el sistema.
                        </Tooltip>
                        <Button id="resetToken" color={"danger"} style={{ fontSize: "20px", color: "white", paddingInline: "5px", paddingTop: "1px", paddingBottom: "2px", borderRadius: "20%" }} onClick={e => {
                            e.preventDefault()
                            resetToken()
                        }} ><BsTrash /></Button>
                        <Tooltip placement="right" isOpen={tooltip2} target="resetToken" toggle={() => setTooltip2(!tooltip2)}>
                            Este botón permite reiniciar el token de AFIP, en caso de que el sistema no pueda conectarse a los servidores de AFIP.
                        </Tooltip>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    )
}

const WaitMode = () => {
    return (
        <Spinner color="primary" />
    )
}

const ErrorMode = ({ errorStr }) => {
    return (
        <> <span style={{ color: "red", fontWeight: "bold" }}>{errorStr}</span><span style={{ fontSize: "20px" }}></span></>
    )
}

const UndefinedMode = () => {
    return (
        <> <span style={{ color: "red", fontWeight: "bold" }}>Error desconocido</span><span style={{ fontSize: "20px" }}></span></>
    )
}

const SuccessMode = ({ infoStr, latencia }) => {
    return (<>
        <span style={{ color: "green", fontWeight: "bold" }}>{infoStr}</span><span style={
            latencia < 300 ? { color: "green", fontSize: "20px" }
                : latencia < 600 ? { color: "#0081c9", fontSize: "20px" }
                    : latencia < 1000 ? { color: "orange", fontSize: "20px" }
                        : { color: "red", fontSize: "20px" }} >{" "}<BiTimer /></span>
        <span
            style={
                latencia < 300 ? { color: "green" }
                    : latencia < 600 ? { color: "#0081c9" }
                        : latencia < 1000 ? { color: "orange" }
                            : { color: "red" }}
        > {latencia}ms{" "}({
                latencia < 300 ? "Rápido"
                    : latencia < 600 ? "Normal"
                        : latencia < 1000 ? "Lento"
                            : "Muy Lento"})</span ></>
    )
}

export default InfoAfipMod