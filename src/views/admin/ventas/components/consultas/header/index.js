import React, { useEffect, useState } from 'react';
import { Col, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import Button from 'reactstrap/lib/Button';
import PtosVtas from '../../vender/header/ptosVta';
import { BsSearch } from "react-icons/bs";
import axios from 'axios';
import UrlNodeServer from '../../../../../../api/NodeServer';

const HeaderListaCaja = ({
    setListaCaja,
    pagina,
    setLoading
}) => {
    const [ptosVta, setPtoVta] = useState({ id: 0 })
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [nro, setnro] = useState("")
    const [concepto, setConcepto] = useState("")
    const [factFiscBool, setFactFiscBool] = useState(0)

    const getDataInvoices = async () => {
        setLoading(true)
        let cbteStr = ""
        if (nro) {
            cbteStr = nro
        }
        let conceptoStr = ""
        if (concepto) {
            conceptoStr = concepto
        }
        const query = `?pvId=${ptosVta.id}&fiscal=${factFiscBool}&cbte=${cbteStr}&search=${conceptoStr}`;
        await axios.get(UrlNodeServer.invoicesDir.invoices + "/" + pagina + query, {
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
                <Col md="10" >
                    <Row>
                        <PtosVtas
                            setPtoVta={setPtoVta}
                            setPtoVtaList={setPtoVtaList}
                            ptoVtaList={ptoVtaList}
                            ptoVta={ptosVta}
                            colSize={4}
                        />
                        <Col md="2">
                            <Label for="nroCbteTxt">Nº Comprobante</Label>
                            <Input
                                type="number"
                                id="nroCbteTxt"
                                value={nro}
                                onChange={e => setnro(e.target.value)}
                                min={1}
                                placeholder="Nº Comprobante..."
                            />
                        </Col>
                        <Col md="4">
                            <Label for="conceptoTxt">Concepto o cliente</Label>
                            <Input
                                type="text"
                                id="conceptoTxt"
                                value={concepto}
                                onChange={e => setConcepto(e.target.value)}
                                placeholder="Nº CAE, fecha, cliente, cuit..."
                            />
                        </Col>
                        <Col md="2">
                            <FormGroup>
                                <Label for="factFiscTxt">Fiscal</Label>
                                <Input type="select" id="factFiscTxt" value={factFiscBool} onChange={e => setFactFiscBool(e.target.value)} >
                                    <option value={0}>No</option>
                                    <option value={1}>Si</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                </Col>
                <Col md="2" >
                    <Row >
                        <Col style={{ textAlign: "center", margin: "15px" }} >
                            <Button
                                color="primary"
                                style={{ height: "70px", width: "170px", fontSize: "16px" }}
                                type="submit"
                            >
                                <span style={{ textAlign: "center", width: "100%" }}> Buscar</span>
                                <span style={{ textAlign: "center", width: "100%", fontSize: "25px" }}> <BsSearch /></span>
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    )
}

export default HeaderListaCaja
