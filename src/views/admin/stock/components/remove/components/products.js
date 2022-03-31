import React, { useState } from 'react';
import { Button, Col, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import ModalSearchProd from './modalSearch';
import './shimmer.css';

const ProductosFiltro = ({
    colSize,
    setProdId,
    loading
}) => {
    const [prodSearchModal, setProdSearchModal] = useState(false)
    const [prodText, setProdText] = useState("")

    const prodSearchToggle = () => { setProdSearchModal(!prodSearchModal) }

    return (
        <Col md={colSize}>
            <Label for="ptoVtaTxt">Producto</Label>
            <InputGroup>
                <Input className={loading ? "shimmer3" : ""} value={prodText} disabled />
                <InputGroupAddon addonType="append"><Button className={loading ? "shimmer2" : ""} disabled={loading} color="primary" onClick={prodSearchToggle}>Buscar</Button></InputGroupAddon>
            </InputGroup>
            <ModalSearchProd
                prodSearchModal={prodSearchModal}
                prodSearchToggle={prodSearchToggle}
                setProdText={setProdText}
                setProdId={setProdId}
            />
        </Col>
    )
}

export default ProductosFiltro