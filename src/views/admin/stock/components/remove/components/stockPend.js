import UrlNodeServer from '../../../../../../api/NodeServer';
import axios from 'axios';
import React, { useEffect } from 'react';
import { Col, FormGroup, Input, Label } from 'reactstrap';

const StockPend = ({
    colSize,
    prodId,
    ptoVtaId,
    stock,
    setStock
}) => {

    const getStockPend = async () => {
        await axios.get(`${UrlNodeServer.stockDir.sub.stockProd}?idProd=${prodId}&pvId=${ptoVtaId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                try {
                    setStock(respuesta.body)
                } catch (error) {
                    setStock(0)
                }
            } else {
                setStock(0)
            }
        }).catch(() => { setStock(0) })
    }

    useEffect(() => {
        getStockPend()
    }, [prodId, ptoVtaId])

    return (
        <Col md={colSize}>
            <FormGroup>
                <Label for="ptoVtaTxt">Stock Pendiente</Label>
                <Input value={stock} required disabled />
            </FormGroup>
        </Col>
    )
}

export default StockPend