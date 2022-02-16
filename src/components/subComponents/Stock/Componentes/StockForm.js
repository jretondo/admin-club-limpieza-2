import React from 'react'
import {
    Col,
    FormGroup,
    Input,
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
                    <label
                        className="form-control-label"
                        htmlFor="input-email"
                    >
                        Stock
                        </label>
                    <Input
                        className="form-control-alternative"
                        id="input-email"
                        placeholder="Stock..."
                        type="number"
                        value={cpraMaxNvo}
                        min={0}
                        onChange={e => setCpraMaxNvo(e.target.value)}
                        required
                    />
                </FormGroup>
            </Col>
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