import React from 'react'
import {
    Col,
    FormGroup,
    Row,
    Input
} from "reactstrap";
const LayoutRowVar = ({ variedadNva, setVariedadNva, stockNvo, setStockNvo, NvaVariedad, tipoVar }) => {

    return (
        <>
            <Row>
                <Col lg="8">
                    <FormGroup>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder={tipoVar + "..."}
                            type="text"
                            value={variedadNva}
                            onChange={e => setVariedadNva(e.target.value)}
                        />
                    </FormGroup>
                </Col>
                <Col lg="4" style={{ textAlign: "left" }}>
                    <button
                        className="btn btn-success"
                        onClick={e => NvaVariedad(e)}
                    >
                        <i className="fa fa-plus"></i>
                    </button>
                </Col>
            </Row>
        </>
    )
}

export default LayoutRowVar