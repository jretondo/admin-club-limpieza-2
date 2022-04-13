import UrlNodeServer from '../../../../../../api/NodeServer';
import axios from 'axios';
import CompleteCerosLeft from 'Function/CompleteCeroLeft';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react'
import {
    Button,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Row,
} from "reactstrap";
import ModalSearchCuit from './modalSearchCuit';
import NdocInput from './ndocInput';
import PtosVtas from './ptosVta';
import Form from 'reactstrap/lib/Form';
const InvoiceHeader = ({
    setPtoVta,
    factFiscBool,
    setFactFiscBool,
    clienteBool,
    setClienteBool,
    tipoDoc,
    ndoc,
    setTipoDoc,
    setNdoc,
    setRazSoc,
    setEmailCliente,
    setEnvioEmailBool,
    razSoc,
    formaPago,
    setFormaPago,
    envioEmailBool,
    emailCliente,
    ptoVta,
    invalidNdoc,
    setInvalidNdoc,
    tfact,
    setTfact,
    setCondIvaCli
}) => {
    const [ptoVtaList, setPtoVtaList] = useState(<option>No hay puntos de venta relacionados</option>)
    const [cbteStr, setCbteStr] = useState("")
    const [cuitSearchModal, setCuitSearchModal] = useState(false)
    const [nroCbte, setNroCbte] = useState(0)

    const FormatearNroCte = useCallback(async () => {
        const cbte = await CompleteCerosLeft(nroCbte, 8)
        const pv = await CompleteCerosLeft(ptoVta.pv, 5)
        setCbteStr(pv + "-" + cbte)
    }, [nroCbte, ptoVta.pv])

    const cuitSearchToggle = () => {
        setCuitSearchModal(!cuitSearchModal)
    }

    const lastInvoice = useCallback(async () => {
        console.log('factFiscBool :>> ', factFiscBool);
        let fiscalBool = "true"
        if (parseInt(factFiscBool) === 0) {
            fiscalBool = ""
        }
        let query = `?pvId=${ptoVta.id}&fiscal=${fiscalBool}&tipo=${tfact}&entorno=`

        await axios.get(UrlNodeServer.invoicesDir.sub.last + query, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const response = res.data
                const status = response.status
                if (status === 200) {
                    setNroCbte(parseInt(response.body.lastInvoice) + 1)
                } else {
                    setNroCbte(1)
                }
            })
            .catch(() => {
                setNroCbte(1)
            })
    }, [ptoVta.id, factFiscBool, tfact])


    useEffect(() => {
        lastInvoice()
    }, [ptoVta, factFiscBool, lastInvoice])

    useEffect(() => {
        FormatearNroCte()
    }, [nroCbte, ptoVta, FormatearNroCte])

    return (
        <>
            <ModalSearchCuit
                cuitSearchToggle={cuitSearchToggle}
                cuitSearchModal={cuitSearchModal}
                setTipoDoc={setTipoDoc}
                setEmailCliente={setEmailCliente}
                setNdoc={setNdoc}
                setRazSoc={setRazSoc}
                setEnvioEmailBool={setEnvioEmailBool}
            />
            <Form>
                <Row>
                    <Col style={{ border: "2px solid red", padding: "15px", margin: 0 }} >
                        <Row>
                            <Col md="8">
                                <Row>
                                    <Col md="4" >
                                        <FormGroup>
                                            <Label for="exampleEmail">Fecha</Label>
                                            <Input type="date" value={moment(new Date()).format("YYYY-MM-DD")} disabled />
                                        </FormGroup>
                                    </Col>
                                    <PtosVtas
                                        setPtoVta={setPtoVta}
                                        setPtoVtaList={setPtoVtaList}
                                        ptoVtaList={ptoVtaList}
                                        ptoVta={ptoVta}
                                        colSize={6}
                                    />
                                    <Col md="2" >
                                        <FormGroup>
                                            <Label for="factFiscTxt">Fiscal</Label>
                                            <Input type="select" id="factFiscTxt" value={factFiscBool} onChange={e => setFactFiscBool(e.target.value)} >
                                                <option value={0}>No</option>
                                                {
                                                    ptoVta.cond_iva === 0 ? null :
                                                        <option value={1}>Si</option>
                                                }
                                            </Input>
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="4" >
                                <Row>
                                    <Col md="4">
                                        <FormGroup>
                                            <Label for="factFiscTxt">T. Fact.</Label>
                                            <Input type="select" id="factFiscTxt" value={tfact} onChange={e => setTfact(e.target.value)} >
                                                {
                                                    parseInt(factFiscBool) === 1 ?
                                                        ptoVta.cond_iva === 0 ?
                                                            <option value={0}>X</option> :
                                                            ptoVta.cond_iva === 1 ?
                                                                <>
                                                                    <option value={1}>A</option>
                                                                    <option value={6}>B</option>
                                                                </> :
                                                                <option value={11}>C</option> :
                                                        <option value={0}>X</option>
                                                }


                                            </Input>
                                        </FormGroup>
                                    </Col>
                                    <Col md="8">
                                        <Label for="exampleEmail">Nº Comprobante</Label>
                                        <FormGroup>
                                            <Input type="text" id="exampleSelect" value={cbteStr} disabled />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="3" >
                                <FormGroup>
                                    <Label for="tipoClienteTxt">Cliente</Label>
                                    <Input onChange={e => setClienteBool(e.target.value)} value={clienteBool} type="select" id="tipoClienteTxt" >
                                        <option value={0} >Consumidor Final</option>
                                        <option value={1} >Cliente Identificado</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            {
                                parseInt(clienteBool) === 1 ?
                                    <>
                                        <Col md="2" >
                                            <FormGroup>
                                                <Label for="factFiscTxt">Tipo Doc.</Label>
                                                <Input type="select" id="factFiscTxt" value={tipoDoc} onChange={e => setTipoDoc(e.target.value)} >
                                                    <option value={80}>CUIT</option>
                                                    <option value={96}>DNI</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                        <NdocInput
                                            tipoDoc={tipoDoc}
                                            setTipoDoc={setTipoDoc}
                                            ndoc={ndoc}
                                            setNdoc={setNdoc}
                                            setRazSoc={setRazSoc}
                                            setEmailCliente={setEmailCliente}
                                            setEnvioEmailBool={setEnvioEmailBool}
                                            invalidNdoc={invalidNdoc}
                                            setInvalidNdoc={setInvalidNdoc}
                                            ptoVta={ptoVta}
                                            setTfact={setTfact}
                                            setCondIvaCli={setCondIvaCli}
                                            factFiscBool={factFiscBool}
                                            colSize={3}
                                        />
                                        <Col md="4">
                                            <Label for="razSocTxt">{parseInt(tipoDoc) === 80 ? "Raz. Soc." : "Nombre"}</Label>
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    id="razSocTxt"
                                                    value={razSoc}
                                                    onChange={e => setRazSoc(e.target.value)}
                                                    required
                                                />
                                                < InputGroupAddon addonType="append">
                                                    <Button className="btn btn-info" onClick={(e) => {
                                                        e.preventDefault();
                                                        setCuitSearchModal(true);
                                                    }} >
                                                        <i className="fas fa-search" ></i>
                                                    </Button>
                                                </InputGroupAddon>
                                            </ InputGroup>
                                        </Col>
                                    </> :
                                    <></>
                            }
                        </Row>
                        <Row>
                            <Col md="3" >
                                <FormGroup>
                                    <Label for="factFiscTxt">Forma de Pago</Label>
                                    <Input type="select" value={formaPago} id="factFiscTxt" onChange={e => setFormaPago(e.target.value)} >
                                        <option value={0}>Efectivo</option>
                                        <option value={1}>Mercado Pago</option>
                                        <option value={2}>Débito</option>
                                        <option value={3}>Crédito</option>
                                        {
                                            parseInt(clienteBool) === 1 ?
                                                <option value={4}>Cuenta Corriente</option> :
                                                null
                                        }
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md="3" >
                                <Label for="factFiscTxt">Envíar Factura por Email</Label>
                                <Input type="select" value={envioEmailBool} id="factFiscTxt" onChange={e => setEnvioEmailBool(e.target.value)} >
                                    <option value={0}>No</option>
                                    <option value={1}>Si</option>
                                </Input>
                            </Col>
                            {
                                parseInt(envioEmailBool) === 1 ?
                                    <Col md="6">
                                        <Label for="razSocTxt">Email Cliente</Label>
                                        <FormGroup>
                                            <Input type="text" id="razSocTxt" value={emailCliente} onChange={e => setEmailCliente(e.target.value)} />
                                        </FormGroup>
                                    </Col>
                                    :
                                    <></>
                            }
                        </Row>
                    </Col>
                </Row>
            </Form>
        </>

    )
}

export default InvoiceHeader