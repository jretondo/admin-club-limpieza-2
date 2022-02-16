import UrlNodeServer from '../../../../../api/NodeServer'
import ListadoTable from 'components/subComponents/Listados/ListadoTable'
import Paginacion from 'components/subComponents/Paginacion/Paginacion'
import React, { useState, useEffect } from 'react'
import { Card, CardFooter, CardHeader, Col, Row, Spinner } from 'reactstrap'
import axios from 'axios'
import FilaPtoVta from 'components/subComponents/Listados/SubComponentes/FilaPuntoVenta'

const titulos = ["Cuit", "Razón Social", "Nº PV", "Dirección", ""]

const ListPtoVta = ({
    detallesBool,
    nvaOffer,
    setNvaOffer,
    setCall,
    call,
    setActividadStr,
    nvaActCall,
    setNvaActCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setDetallesBool,
    setIdDetalle
}) => {
    const [plantPaginas, setPlantPaginas] = useState([])
    const [ultimaPag, setUltimaPag] = useState(0)
    const [listado, setListado] = useState([])
    const [pagina, setPagina] = useState(1)
    const [esperar, setEsperar] = useState(false)
    const [dataState, setdataState] = useState([])

    useEffect(() => {
        ListarPV()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        ListarPV()
        // eslint-disable-next-line
    }, [pagina, call])

    const ListarPV = async () => {
        setEsperar(true)
        await axios.get(`${UrlNodeServer.ptosVtaDir.ptosVta}/${pagina}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            },
        })
            .then(res => {
                setEsperar(false)
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
                                <td>
                                    <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay puntos de venta cargados</span>
                                </td>
                            </tr>
                        )
                    } else {
                        setdataState(pagesObj)
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
                                    <FilaPtoVta
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
                                        setEsperar={setEsperar}
                                        nvaOffer={nvaOffer}
                                        setDetallesBool={setDetallesBool}
                                        setIdDetalle={setIdDetalle}
                                        primero={primero}
                                        pagina={pagina}
                                        setPagina={setPagina}
                                    />
                                )
                            })
                        )
                    }
                } else {
                    setListado(
                        <tr style={{ textAlign: "center", width: "100%" }}>
                            <td>
                                <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay puntos de venta cargados</span>
                            </td>
                        </tr>
                    )
                    setUltimaPag(1)
                }
            })
            .catch((error) => {
                setEsperar(false)
                console.error(error)
                setListado(
                    <tr style={{ textAlign: "center", width: "100%" }}>
                        <td>
                            <span style={{ textAlign: "center", marginRight: "auto", marginLeft: "auto" }}> No hay puntos de venta cargados</span>
                        </td>
                    </tr>
                )
                setUltimaPag(1)
            })
    }

    const NvaOferta = (e) => {
        e.preventDefault()
        setNvaOffer(true)
        setCall(!call)
    }


    return (
        <Row style={
            detallesBool ?
                { display: "none" } :
                nvaOffer ?
                    { display: "none" } :
                    { display: "block" }}>
            <Col>
                <Card className="shadow">
                    <CardHeader className="border-0">
                        <Row>
                            <Col>
                                <h3 className="mb-0">Puntos de Venta</h3>
                            </Col>
                        </Row>

                    </CardHeader>
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            <>
                                <ListadoTable
                                    listado={listado}
                                    titulos={titulos}
                                />
                                <CardFooter className="py-4">
                                    <nav aria-label="..." style={{ marginBottom: "20px" }}>
                                        <button
                                            className="btn btn-primary"
                                            style={nvaOffer ? { display: "none" } : { display: "block" }}
                                            onClick={e => NvaOferta(e)}
                                        >
                                            Nuevo Punto de Venta
                                        </button>
                                    </nav>
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
                                </CardFooter>
                            </>
                    }
                </Card>
            </Col>
        </Row>
    )
}

export default ListPtoVta