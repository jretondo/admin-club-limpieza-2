import React from 'react'
import {
    Col,
    FormGroup,
    Row,
    Input
} from "reactstrap";
const LayoutRowVar = ({ tipoVarBool, tipoVar, setTipoVar, ConfTypeVar, QuitarType }) => {

    return (
        <>
            {
                !tipoVarBool ?
                    <Row>
                        <Col lg="8">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                >
                                    Tipo de Variedad
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-email"
                                    placeholder="Tpo de Variedad..."
                                    type="text"
                                    value={tipoVar}
                                    required
                                    disabled
                                />
                            </FormGroup>
                        </Col>
                        <Col lg="4" style={{ textAlign: "left" }}>
                            <button
                                className="btn btn-danger"
                                style={{ marginTop: "32px" }}
                                onClick={e => QuitarType(e)}
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        </Col>
                    </Row> :
                    <Row>
                        <Col lg="8">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                >
                                    Tipo de Variedad
                                    </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-email"
                                    placeholder="Tpo de Variedad..."
                                    type="text"
                                    value={tipoVar}
                                    onChange={e => setTipoVar(e.target.value)}
                                    required
                                />
                            </FormGroup>
                        </Col>
                        <Col lg="4" style={{ textAlign: "left" }}>
                            <button
                                className="btn btn-success"
                                style={{ marginTop: "32px" }}
                                onClick={e => ConfTypeVar(e)}
                            >
                                <i className="fa fa-check"></i>
                            </button>
                        </Col>
                    </Row>
            }
        </>
    )
}

export default LayoutRowVar