import React, { useState } from 'react'
import {
    Col,
    FormGroup,
    Row,
    Input
} from "reactstrap";
const LayoutRowVarPlant = ({ variedad, stock, deleteRow, id, tipoVar, acceptPlant, listaVarNvas, setListaVarNvas }) => {
    const [stockInd, setStockInd] = useState(0)
    const [aceptado, setAceptado] = useState(false)

    const Confirmar = (e, id, stockInd, variedad) => {
        console.log('stockInd', stockInd)
        acceptPlant(e, id, stockInd, variedad)
        setAceptado(true)
    }

    return (
        <>
            <Row key={id}>
                <Col lg="4">
                    <FormGroup>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder={tipoVar + "..."}
                            type="text"
                            value={variedad}
                            required
                            disabled
                        />
                    </FormGroup>
                </Col>
                <Col lg="4">
                    <FormGroup>
                        {
                            aceptado ?
                                <Input
                                    className="form-control-alternative"
                                    id="input-email"
                                    placeholder="Variedad..."
                                    type="number"
                                    value={listaVarNvas[id][1]}
                                    min={0}
                                    required
                                    disabled
                                /> :
                                <Input
                                    className="form-control-alternative"
                                    id="input-email"
                                    placeholder="Variedad..."
                                    type="number"
                                    value={stockInd}
                                    onChange={e => setStockInd(e.target.value)}
                                    min={0}
                                    required
                                />
                        }

                    </FormGroup>
                </Col>
                <Col lg="4" style={{ textAlign: "left" }}>
                    {
                        aceptado ?
                            null :
                            <button
                                className="btn btn-success"
                                onClick={e => Confirmar(e, id, stockInd, variedad)}
                            >
                                <i className="fa fa-check"></i>
                            </button>
                    }
                    <button
                        className="btn btn-danger"
                        onClick={e => deleteRow(e, id)}
                    >
                        <i className="fa fa-times"></i>
                    </button>
                </Col>
            </Row>
        </>
    )
}

export default LayoutRowVarPlant