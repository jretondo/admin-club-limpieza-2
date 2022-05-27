import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import Paginacion from 'components/subComponents/Paginacion/Paginacion';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardFooter, CardHeader, Col, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import UrlNodeServer from '../../../../api/NodeServer'
import axios from 'axios'
import FilaCtaCte from 'components/subComponents/Listados/SubComponentes/FilaCtaCte';
import formatMoney from 'Function/NumberFormat';
import ModalCobroCtaCte from './modalCobro';

const titulos = ["Fecha", "Detalle", "Factura", "Importe"]
const CtaCteListClientMod = ({
    idCliente,
    nombreCliente,
    setVerCtaCteBool,
    call,
    setCall,
}) => {
    const [esperar, setEsperar] = useState(false)
    const [listado, setListado] = useState(<tr><td></td><td>Aún no posee movimientos en su Cta. Cte.</td></tr>)
    const [pagina, setPagina] = useState(1)
    const [ultimaPag, setUltimaPag] = useState(0)
    const [plantPaginas, setPlantPaginas] = useState(<></>)
    const [dataList, setDataList] = useState([])
    const [tipoCons, setTipoCons] = useState(0)
    const [total, setTotal] = useState("")
    const [modalCobro, setModalCobro] = useState(false)
    const [actualizar, setActualizar] = useState(false)

    const ListarCtaCte = async () => {
        let data
        if (parseInt(tipoCons) === 0) {
            data = {
                idCliente: idCliente
            }
        } else if (parseInt(tipoCons) === 1) {
            data = {
                idCliente: idCliente,
                debit: true
            }
        } else {
            data = {
                idCliente: idCliente,
                credit: true
            }
        }
        setEsperar(true)
        await axios.get(`${UrlNodeServer.clientesDir.sub.ctaCte}/${pagina}`, {
            params: data,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const body = respuesta.body
                    setDataList(body.pagesObj)
                    setUltimaPag(body.pagesObj.totalPag)
                    if (parseInt(body.pagesObj.totalPag) > 0) {
                        setTotal((body.suma[0].SUMA))
                        setListado(
                            body.data.map((item, key) => {
                                return (
                                    <FilaCtaCte
                                        key={key}
                                        id={key}
                                        item={item}
                                    />
                                )
                            })
                        )
                    } else {
                        setUltimaPag(1)
                        setListado(
                            <tr><td></td><td>Aún no posee movimientos en su Cta. Cte.</td></tr>
                        )
                    }
                } else {
                    setUltimaPag(1)
                    setListado(
                        <tr><td></td><td>Aún no posee movimientos en su Cta. Cte.</td></tr>
                    )
                }
            })
            .catch((error) => {
                console.log('error :>> ', error);
                setEsperar(false)
                setUltimaPag(1)
                setListado(
                    <tr><td></td><td>Aún no posee movimientos en su Cta. Cte.</td></tr>
                )
            })
    }

    useEffect(() => {
        ListarCtaCte()
    }, [idCliente, tipoCons, pagina, actualizar])

    return (<>
        {
            esperar ?
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                    <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div>
                :
                <>
                    <ModalCobroCtaCte
                        modal={modalCobro}
                        toggle={() => setModalCobro(!modalCobro)}
                        clienteID={idCliente}
                        actualizar={() => setActualizar(!actualizar)}
                    />
                    <Row>
                        <Col md="12" style={{ textAlign: "right" }} >
                            <Button color={"danger"} onClick={e => {
                                e.preventDefault()
                                setVerCtaCteBool(false)
                            }}>
                                X
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Card className="shadow">
                                <CardHeader className="border-0">
                                    <Row>
                                        <Col md="9  " >
                                            <h2 className="mb-0">Cuenta Corriente: {nombreCliente}</h2>
                                        </Col>
                                        <Col md="3" style={{ textAlign: "left" }}>
                                            <FormGroup>
                                                <Label for="exampleSelect">Tipo de Movimiento</Label>
                                                <Input type="select" name="select" id="exampleSelect" value={tipoCons} onChange={e => {
                                                    setTipoCons(e.target.value)
                                                }}>
                                                    <option value={0} >Todos</option>
                                                    <option value={1}>Débitos</option>
                                                    <option value={2}>Créditos</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                </CardHeader>
                                <ListadoTable
                                    listado={listado}
                                    titulos={titulos}
                                />
                                <CardFooter className="py-4">
                                    <Row>
                                        <Col md="9">

                                        </Col>
                                        <Col md="3">
                                            <Input style={parseInt(total) > 0 ? { fontWeight: "bold", textAlign: "right", fontSize: "18px", color: "green" } : { fontWeight: "bold", textAlign: "right", fontSize: "18px", color: "red" }} disabled value={"$ " + formatMoney(total)} />
                                        </Col>
                                    </Row>
                                    <nav aria-label="..." style={{ marginBottom: "20px" }}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={e => {
                                                e.preventDefault()
                                                setModalCobro(true)
                                            }} >
                                            Registrar Cobro
                                        </button>
                                    </nav>

                                    <Paginacion
                                        setPagina={setPagina}
                                        setCall={setCall}
                                        pagina={pagina}
                                        call={call}
                                        plantPaginas={plantPaginas}
                                        ultimaPag={ultimaPag}
                                        data={dataList}
                                        setPlantPaginas={setPlantPaginas}
                                        setUltimaPag={setUltimaPag}
                                    />
                                </CardFooter>
                            </Card></Col></Row>
                </>

        }
    </>)
}
export default CtaCteListClientMod