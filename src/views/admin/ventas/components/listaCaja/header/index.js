import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Row, Spinner } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import PtosVtas from '../../vender/header/ptosVta';
import UsuariosList from './usersList';
import { BsFileEarmarkPdfFill, BsCardList } from "react-icons/bs";
import axios from 'axios';
import UrlNodeServer from '../../../../../../api/NodeServer';
import swal from 'sweetalert';
import FileSaver from 'file-saver';

const HeaderListaCaja = ({
    setListaCaja,
    pagina,
    setLoading
}) => {
    const hoy = (moment(new Date()).format("YYYY-MM-DD"))
    const [ptosVta, setPtoVta] = useState({ id: 0 })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [user, setUser] = useState({ id: 0 })
    const [usersList, setUsersList] = useState(<option>No hay usuarios listados</option>)
    const [desde, setDesde] = useState(hoy)
    const [hasta, setHasta] = useState(hoy)
    const [loadingPDF, setLoadingPDF] = useState(false)

    const getDataInvoices = async () => {
        setLoading(true)
        const query = `?userId=${user.id}&ptoVta=${ptosVta.id}&desde=${moment(desde).format("YYYY-MM-DD")}&hasta=${moment(hasta).format("YYYY-MM-DD")}`
        await axios.get(UrlNodeServer.invoicesDir.sub.cajaList + "/" + pagina + query, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setLoading(false)
                const status = res.data.status
                if (status === 200) {
                    setListaCaja(res.data.body)
                } else {
                    setListaCaja([])
                }
            })
            .catch(() => {
                setLoading(false)
                setListaCaja([])
            })
    }

    const printPDF = async () => {

        setLoadingPDF(true)
        const query = `?userId=${user.id}&ptoVta=${ptosVta.id}&desde=${moment(desde).format("YYYY-MM-DD")}&hasta=${moment(hasta).format("YYYY-MM-DD")}`
        await axios.get(UrlNodeServer.invoicesDir.sub.cajaListPDF + query, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                Accept: 'application/pdf',
            }
        })
            .then(res => {
                let headerLine = res.headers['content-disposition'];
                const largo = parseInt(headerLine.length)
                let filename = headerLine.substring(21, largo);
                var blob = new Blob([res.data], { type: "application/pdf" });
                FileSaver.saveAs(blob, filename);
                setLoadingPDF(false)
                swal("Listado de Caja!", "El listado de caja ha sido generado con éxito!", "success");
            })
            .catch((error) => {
                setLoadingPDF(false)
                setListaCaja([])
                swal("Listado de Caja!", "Hubo un error al querer listar la caja!", "error");
            })
    }

    useEffect(() => {
        getDataInvoices()
        // eslint-disable-next-line
    }, [pagina])

    return (
        <Form onSubmit={e => {
            e.preventDefault()
            getDataInvoices()
        }}>
            <Row>
                <Col md="8" >
                    <Row>
                        <PtosVtas
                            setPtoVta={setPtoVta}
                            setPtoVtaList={setPtoVtaList}
                            ptoVtaList={ptoVtaList}
                            ptoVta={ptosVta}
                            colSize={12}
                        />
                    </Row>
                    <Row>
                        <UsuariosList
                            setUser={setUser}
                            setUsersList={setUsersList}
                            user={user}
                            usersList={usersList}
                            colSize={4}
                        />
                        <Col md="4">
                            <FormGroup>
                                <Label for="desdeTxtCaja">Desde</Label>
                                <Input
                                    type="date"
                                    id="desdeTxtCaja"
                                    value={desde}
                                    onChange={e => setDesde(e.target.value)}
                                    max={hasta}
                                />
                            </FormGroup>
                        </Col>
                        <Col md="4">
                            <Label for="desdeTxtCaja">Hasta</Label>
                            <Input
                                type="date"
                                id="desdeTxtCaja"
                                value={hasta}
                                onChange={e => setHasta(e.target.value)}
                                max={hoy}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col md="4" >
                    <Row style={{ paddingTop: "10%" }}>
                        <Col style={{ textAlign: "center", margin: "15px" }} >
                            <Button
                                color="primary"
                                style={{ height: "100px", width: "170px", fontSize: "16px" }}
                                type="submit"
                            >
                                <Row>
                                    <span style={{ textAlign: "center", width: "100%" }}> Listar Ventas</span>
                                </Row>
                                <Row >
                                    <span style={{ textAlign: "center", width: "100%", fontSize: "25px" }}> <BsCardList /></span>
                                </Row>
                            </Button>
                        </Col>
                        <Col style={{ textAlign: "center", margin: "15px" }} >
                            {
                                loadingPDF ?
                                    <div style={{ textAlign: "center" }}  >
                                        <Spinner type="border" color="red" style={{ width: "5rem", height: "5rem" }} /> </div>
                                    :
                                    <Button
                                        color="danger"
                                        style={{ height: "100px", width: "170px", fontSize: "16px" }}
                                        onClick={e => {
                                            e.preventDefault()
                                            printPDF()
                                        }}
                                    >
                                        <Row>
                                            <span style={{ textAlign: "center", width: "100%" }}> Imprimir PDF</span>
                                        </Row>
                                        <Row >
                                            <span style={{ textAlign: "center", width: "100%", fontSize: "25px" }}> <BsFileEarmarkPdfFill /></span>
                                        </Row>
                                    </Button>
                            }

                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    )
}

export default HeaderListaCaja
