import React, { useState } from 'react';
import { Button, Col, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import ModalSearchProd from './modalSearch';

const ProductosFiltro = ({
    colSize,
    setProdId
}) => {
    const [prodSearchModal, setProdSearchModal] = useState(false)
    const [prodText, setProdText] = useState("Todos los productos")

    const prodSearchToggle = () => { setProdSearchModal(!prodSearchModal) }

    return (
        <Col md={colSize}>
            <Label for="ptoVtaTxt">Producto</Label>
            <InputGroup>
                <Input value={prodText} disabled />
                <InputGroupAddon addonType="append"><Button color="primary" onClick={prodSearchToggle}>Buscar</Button></InputGroupAddon>
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