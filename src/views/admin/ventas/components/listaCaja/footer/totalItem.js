import formatMoney from 'Function/NumberFormat';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, FormGroup, Input, Label } from 'reactstrap';

const TotalItemsVtas = ({
    id,
    totalId,
    totalImporte,
    colSize
}) => {
    const [totalStr, setTotalStr] = useState("")
    const [tituloStr, setTituloStr] = useState("")

    const format = useCallback(() => {
        switch (parseInt(totalId)) {
            case 0:
                setTituloStr("Total Efectivo")
                break;
            case 1:
                setTituloStr("Total Mercado Pago")
                break;
            case 2:
                setTituloStr("Total Dédito")
                break;
            case 3:
                setTituloStr("Total Crédito")
                break;
            case 4:
                setTituloStr("Total Cuenta Corriente")
                break;
            case 5:
                setTituloStr("Total Transferencias")
                break;

            default:
                setTituloStr("No hay totales para mostrar")
                break;
        }

        setTotalStr(formatMoney(totalImporte))
    }, [totalId, totalImporte])

    useEffect(() => {
        format()
    }, [format])

    return (
        <Col md={colSize} key={id}>
            <FormGroup>
                <Label>{tituloStr}</Label>
                <Input type="text" value={"$ " + totalStr} disabled />
            </FormGroup>
        </Col>
    )
}

export default TotalItemsVtas