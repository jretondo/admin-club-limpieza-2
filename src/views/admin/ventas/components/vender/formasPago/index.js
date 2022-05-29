import formatMoney from 'Function/NumberFormat';
import React, { useEffect, useState } from 'react';
import { Button, Col, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import FilaPago from './filaPago';
import ModalPago from './modalPago';

const FormasPagoMod = ({
    variosPagos,
    setVariosPagos,
    formaPago,
    clienteBool,
    factFiscBool,
    total,
    setTotal
}) => {
    const [modal, setModal] = useState(false)
    const [listado, setListado] = useState(<tr style={{ borderTop: "1px solid #e9ecef", borderBottom: "1px solid #e9ecef" }}><td>Aún no hay pagos registrados</td></tr>)


    const listarPagos = () => {
        let efectivoRow = <></>
        let efectivo = 0
        let mercadoPagoRow = <></>
        let mercadoPago = 0
        let debitoRow = <></>
        let debito = 0
        let creditoRow = <></>
        let credito = 0
        let ctacteRow = <></>
        let ctacte = 0
        let TotalSuma = 0
        if (variosPagos.length > 0) {
            variosPagos.map((item, key) => {
                TotalSuma = TotalSuma + parseFloat(item.importe)
                switch (parseInt(item.tipo)) {
                    case 0:
                        efectivo = efectivo + parseFloat(item.importe)
                        break;
                    case 1:
                        mercadoPago = mercadoPago + parseFloat(item.importe)
                        break;
                    case 2:
                        debito = debito + parseFloat(item.importe)
                        break;
                    case 3:
                        credito = credito + parseFloat(item.importe)
                        break;
                    case 4:
                        ctacte = ctacte + parseFloat(item.importe)
                        break;
                    default:
                        break;
                }
                if (key === (variosPagos.length - 1)) {
                    if (efectivo > 0) {
                        efectivoRow = <FilaPago
                            tipo={0}
                            tipoTxt="Efectivo"
                            importe={efectivo}
                            variosPagos={variosPagos}
                            setVariosPagos={setVariosPagos}
                        />
                    }
                    if (mercadoPago > 0) {
                        mercadoPagoRow = <FilaPago
                            tipo={1}
                            tipoTxt="Mercado Pago"
                            importe={mercadoPago}
                            variosPagos={variosPagos}
                            setVariosPagos={setVariosPagos}
                        />
                    }
                    if (debito > 0) {
                        debitoRow = <FilaPago
                            tipo={2}
                            tipoTxt="Débito"
                            importe={debito}
                            variosPagos={variosPagos}
                            setVariosPagos={setVariosPagos}
                        />
                    }
                    if (credito > 0) {
                        creditoRow = <FilaPago
                            tipo={3}
                            tipoTxt="Crédito"
                            importe={credito}
                            variosPagos={variosPagos}
                            setVariosPagos={setVariosPagos}
                        />
                    }
                    if (ctacte > 0) {
                        ctacteRow = <FilaPago
                            tipo={4}
                            tipoTxt="Cuenta Corriente"
                            importe={ctacte}
                            variosPagos={variosPagos}
                            setVariosPagos={setVariosPagos}
                        />
                    }
                    setListado(<>
                        {efectivoRow}
                        {mercadoPagoRow}
                        {debitoRow}
                        {creditoRow}
                        {ctacteRow}
                    </>)
                    setTotal(TotalSuma)
                }
            })
        } else {
            setListado(<tr style={{ borderTop: "1px solid #e9ecef", borderBottom: "1px solid #e9ecef" }}><td>Aún no hay pagos registrados</td></tr>)
            setTotal(0)
        }

    }

    useEffect(() => {
        listarPagos()
    }, [variosPagos])

    if (parseInt(formaPago) === 5) {
        return (
            <>
                <h2 style={{ textAlign: "center" }}>
                    Pagos {" "}
                    <Button color="success" style={{ borderRadius: "10%" }} onClick={e => {
                        e.preventDefault()
                        setModal(true)
                    }}>
                        <i className="fa fa-plus"></i>
                    </Button>
                </h2>
                <Table className="align-items-center table-flush">
                    <tbody>
                        {listado}
                    </tbody>
                </Table>

                <Row style={{ marginTop: "20px" }}>
                    <Col md="4" style={{ marginLeft: "auto", textAlign: "right" }}>
                        <Label style={{ fontSize: "25px", fontWeight: "bold" }} >
                            Pago Total:
                        </Label>
                    </Col>
                    <Col md="8" >
                        <FormGroup>
                            <Input style={{ fontSize: "20px", fontWeight: "bold", textAlign: "right" }} type="text" value={"$ " + formatMoney(total)} disabled />
                        </FormGroup>
                    </Col>
                </Row>

                <ModalPago
                    modal={modal}
                    toggle={() => setModal(!modal)}
                    variosPagos={variosPagos}
                    setVariosPagos={setVariosPagos}
                    clienteBool={clienteBool}
                    factFiscBool={factFiscBool}
                />
            </>
        )
    } else {
        return (null)
    }

}

export default FormasPagoMod