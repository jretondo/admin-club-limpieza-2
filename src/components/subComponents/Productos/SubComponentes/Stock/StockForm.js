import React from 'react'
import {
    Col,
    FormGroup
} from "reactstrap";
const StockForm = ({
    cpraMaxNvo,
    setCpraMaxNvo,
    setVariedadesBool
}) => {

    const volver = (e) => {
        e.preventDefault()
        setVariedadesBool(true)
    }

    return (
        <>
            <Col lg="4">
                <FormGroup>
                    <button
                        className="btn btn-primary"
                        onClick={e => volver(e)}
                        style={{ marginTop: "30px" }}
                    >
                        Producto con Variación
                        </button>
                </FormGroup>
            </Col>
        </>
    )
}

export default StockForm