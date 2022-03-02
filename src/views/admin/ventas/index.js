import Header from 'components/Headers/Header';
import React, { useEffect, useState } from 'react';
import { Collapse, Container, Spinner, Card, CardBody, ButtonGroup } from 'reactstrap';
import VenderModule from './components/vender';
import { Redirect } from "react-router-dom";
import { UseSecureRoutes } from "Hooks/UseSecureRoutes";
import UrlNodeServer from '../../../api/NodeServer';
import ListaCajaModule from './components/listaCaja';
import ConsultaVentasModule from './components/consultas';
import ButtonOpenCollapse from '../../../components/buttonOpen';
import { useWindowSize } from '../../../Hooks/UseWindowSize';

const VentasModule = () => {
    const [call, setCall] = useState(false)
    const [moduleActive, setModuleActive] = useState(0)
    const width = useWindowSize()

    const activeVentas = () => {
        setModuleActive(0)
    }
    const activeConsultas = () => {
        setModuleActive(1)
    }
    const activeCajaLista = () => {
        setModuleActive(2)
    }

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.stock,
        call
    )

    if (loading) {
        return (
            <div style={{ textAlign: "center" }}  >
                <Spinner type="grow" color="light" /> </div>
        )
    } else if (error) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else {
        return (
            <>
                <Header />
                <Container className="mt--7" fluid>
                    <div style={{ width: "100%" }}>
                        <Card style={{ marginTop: "5px", marginBottom: "20px" }}>
                            <CardBody style={{ textAlign: "center" }}>
                                <ButtonGroup vertical={width > 1030 ? false : true}>
                                    <ButtonOpenCollapse
                                        action={activeVentas}
                                        tittle={"Vender Productos"}
                                        active={moduleActive === 0 ? true : false}
                                    />
                                    <ButtonOpenCollapse
                                        action={activeCajaLista}
                                        tittle={"Listar Caja"}
                                        active={moduleActive === 2 ? true : false}
                                    />
                                    <ButtonOpenCollapse
                                        action={activeConsultas}
                                        tittle={"Consulta de Ventas"}
                                        active={moduleActive === 1 ? true : false}
                                    />
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                        <Collapse isOpen={moduleActive === 0 ? true : false} >
                            <VenderModule />
                        </Collapse>

                        <Collapse isOpen={moduleActive === 2 ? true : false} >
                            <ListaCajaModule />
                        </Collapse>

                        <Collapse isOpen={moduleActive === 1 ? true : false} >
                            <ConsultaVentasModule />
                        </Collapse>
                    </div>
                </Container>
            </>
        )
    }
}

export default VentasModule