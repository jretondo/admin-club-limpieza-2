import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Row, Spinner, Tooltip } from 'reactstrap';
import { BiRefresh, BiTimer } from 'react-icons/bi';
import { BsInfoCircle } from 'react-icons/bs';
import './infoAfip.css';

const InfoAfipMod = ({
    afipStatus,
    refreshAfip,
    setRefreshAfip
}) => {
    const [tooltip, setTooltip] = useState(false)
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