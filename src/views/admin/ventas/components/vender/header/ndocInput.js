import UrlNodeServer from 'api/NodeServer'
import React from 'react'
import { Col, FormFeedback, FormGroup, Input, Label } from 'reactstrap'
import { verificadorCuit } from 'Function/VerificadorCuit'
import axios from 'axios'

const NdocInput = ({
    tipoDoc,
    ndoc,
    setTipoDoc,
    setNdoc,
    setRazSoc,
    setEmailCliente,
    setEnvioEmailBool,
    invalidNdoc,
    setInvalidNdoc,
    ptoVta,
    setTfact,
    setCondIvaCli,
    factFiscBool,
    colSize
}) => {
    const Find = async () => {
        if (parseInt(tipoDoc) === 96) {
            const largo = ndoc.length
            if (largo > 8 || largo < 7) {
                setInvalidNdoc(true)
            } else {
                setInvalidNdoc(false)
            }
            await axios.get(`${UrlNodeServer.clientesDir.clientes}/${1}`, {
                params: {
                    search: ndoc,
                    cantPerPage: 1
                },
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            })
                .then(res => {
                    const respuesta = res.data
                    const status = parseInt(respuesta.status)
                    if (status === 200) {
                        const body = respuesta.body
                        if (body.pagesObj.totalPag > 0) {
                            const cliente = body.data[0]
                            let tipoCliente = cliente.cuit
                            if (tipoCliente === 0) {
                                tipoCliente = 80
                            }
                            setTipoDoc(tipoCliente)
                            setNdoc(cliente.ndoc)
                            setRazSoc(cliente.razsoc)
                            if (cliente.email.length > 0) {
                                setEmailCliente(cliente.email)
                                setEnvioEmailBool(1)
                            }
                        } else {
                            setEmailCliente("")
                            setEnvioEmailBool(0)
                        }
                    } else {
                        setEmailCliente("")
                        setEnvioEmailBool(0)
                    }
                })
                .catch(() => {
                    setEmailCliente("")
                    setEnvioEmailBool(0)
                })
        } else {
            const esCuit = verificadorCuit(ndoc).isCuit
            if (esCuit) {
                setInvalidNdoc(false)

                await getDataFiscalClient()

                await axios.get(`${UrlNodeServer.clientesDir.clientes}/${1}`, {
                    params: {
                        search: ndoc,
                        cantPerPage: 1
                    },
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                    }
                })
                    .then(res => {
                        const respuesta = res.data
                        const status = parseInt(respuesta.status)
                        if (status === 200) {
                            const body = respuesta.body
                            if (body.pagesObj.totalPag > 0) {
                                const cliente = body.data[0]
                                let tipoCliente = cliente.cuit
                                if (tipoCliente === 0) {
                                    tipoCliente = 80
                                }
                                setTipoDoc(tipoCliente)
                                setNdoc(cliente.ndoc)
                                setRazSoc(cliente.razsoc)
                                if (cliente.email.length > 0) {
                                    setEmailCliente(cliente.email)
                                    setEnvioEmailBool(1)
                                }
                            } else {
                                setEmailCliente("")
                                setEnvioEmailBool(0)
                            }
                        } else {
                            setEmailCliente("")
                            setEnvioEmailBool(0)
                        }
                    })
                    .catch(() => {
                        setEmailCliente("")
                        setEnvioEmailBool(0)
                    })
            } else {
                setInvalidNdoc(true)
            }
        }
    }
    const getDataFiscalClient = async () => {
        console.log('pasa :>> ');
        const verifCuit = await verificadorCuit(ndoc)
        if (ptoVta.cert_file && ptoVta.key_file && verifCuit.isCuit) {

            const query = `?cuit=${ndoc}&cert=${ptoVta.cert_file}&key=${ptoVta.key_file}&cuitPv=${ptoVta.cuit}`
            await axios.get(UrlNodeServer.clientesDir.sub.dataFiscal + query, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            })
                .then(res => {
                    const respuesta = res.data
                    const status = respuesta.status
                    if (status === 200) {
                        if (respuesta.body.status === 200) {
                            if (respuesta.body.data.datosMonotributo) {
                                setRazSoc(respuesta.body.data.datosGenerales.nombre + " " + respuesta.body.data.datosGenerales.apellido)
                                setTfact(6)
                                setCondIvaCli(6)
                            } else {
                                if (respuesta.body.data.datosGenerales.nombre) {
                                    setRazSoc(respuesta.body.data.datosGenerales.nombre + " " + respuesta.body.data.datosGenerales.apellido)
                                } else {
                                    setRazSoc(respuesta.body.data.datosGenerales.razonSocial)
                                }
                                const impuesto = respuesta.body.data.datosRegimenGeneral.impuesto
                                const iva = impuesto.find(imp => imp.idImpuesto === 30);
                                if (iva !== undefined) {
                                    setTfact(1)
                                    setCondIvaCli(1)
                                } else {
                                    setTfact(6)
                                    setCondIvaCli(4)
                                }
                            }
                        }
                    }
                })
                .catch(() => {
                    if (ptoVta.cond_iva === 6) {
                        setTfact(11)
                    } else {
                        setTfact(6)
                    }
                })

        } else {
            if (ptoVta.cond_iva === 6) {
                setTfact(11)
            } else {
                setTfact(6)
            }
        }
    }

    return (
        <Col md={colSize}>
            <Label for="ndocTxt">{parseInt(tipoDoc) === 80 ? "Nº CUIT" : "Nº Doc."}</Label>
            <FormGroup>
                <Input
                    invalid={invalidNdoc}
                    type="number"
                    id="ndocTxt"
                    value={ndoc}
                    onChange={e => setNdoc(e.target.value)}
                    onBlur={() => Find()}
                />
                <FormFeedback>{tipoDoc === 80 ? "El CUIT no es válido. Reviselo!" : "El DNI no es válido. Reviselo!"}</FormFeedback>
            </FormGroup>
        </Col>
    )
}

export default NdocInput