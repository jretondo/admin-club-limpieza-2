import React, { useEffect, useState } from "react";
import { useActividad } from '../../../Hooks/UseNvaActividad'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    ButtonGroup,
    Card,
    CardBody,
    Collapse,
    Container,
    Spinner,
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../../api/NodeServer'

import { UseSecureRoutes } from "Hooks/UseSecureRoutes";
import { useWindowSize } from "Hooks/UseWindowSize";
import ButtonOpenCollapse from "components/buttonOpen";
import UlMovMod from "./components/ultMov";
import ListaStockMod from './components/listaStock';
import ConsultaStockMod from "./components/consulta";

const ProductsItems = () => {
    const [call, setCall] = useState(false)

    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")

    const [moduleActive, setModuleActive] = useState(0)
    const width = useWindowSize()

    useActividad(
        nvaActCall,
        actividadStr
    )

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.stock,
        call
    )


    const activeUltStock = () => {
        setModuleActive(0)
    }
    const activeListaStock = () => {
        setModuleActive(1)
    }
    const activeConsultaStock = () => {
        setModuleActive(2)
    }

    useEffect(() => {
        setCall(!call)
        // eslint-disable-next-line
    }, [])


    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            </div>
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
                                        action={activeUltStock}
                                        tittle={"Últimos Movimientos"}
                                        active={moduleActive === 0 ? true : false}
                                    />
                                    <ButtonOpenCollapse
                                        action={activeListaStock}
                                        tittle={"Listado de Stock"}
                                        active={moduleActive === 1 ? true : false}
                                    />
                                    <ButtonOpenCollapse
                                        action={activeConsultaStock}
                                        tittle={"Consulta de Stock"}
                                        active={moduleActive === 2 ? true : false}
                                    />
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                        <Collapse isOpen={moduleActive === 0 ? true : false} >
                            <UlMovMod />
                        </Collapse>

                        <Collapse isOpen={moduleActive === 1 ? true : false} >
                            <ListaStockMod />
                        </Collapse>

                        <Collapse isOpen={moduleActive === 2 ? true : false} >
                            <ConsultaStockMod />
                        </Collapse>
                    </div>
                </Container>
            </>
        )
    }
}

export default ProductsItems;
