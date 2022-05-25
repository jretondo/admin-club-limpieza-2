import React from 'react';
import { Button, Card, CardBody, Col, Row, Spinner } from 'reactstrap';
import { BiRefresh, BiTimer } from 'react-icons/bi';
import './infoAfip.css';

const InfoAfipMod = ({
    afipStatus,
    refreshAfip,
    setRefreshAfip
}) => {
    return (
        <Card style={{ marginBottom: "10px" }}>
            <CardBody style={{ padding: "0.5rem" }}>
                <Row>
                    <Col md="6" className="estadoAfip1">
                        <span>
                            Estado de servidor del AFIP:
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
        <span style={{ color: "green", fontWeight: "bold" }}>{infoStr}</span><span style={latencia < 500 ? { color: "green", fontSize: "20px" } : latencia > 1000 ? { color: "red", fontSize: "20px" } : { color: "orange", fontSize: "20px" }} >{" "}<BiTimer /></span>
        <span
            style={latencia < 500 ? { color: "green" } : latencia > 1000 ? { color: "red" } : { color: "orange" }}
        > {latencia}ms{" "}({latencia < 500 ? "Rápido" : latencia > 1000 ? "Muy Lento" : "Lento"})</span ></>
    )
}

export default InfoAfipMod