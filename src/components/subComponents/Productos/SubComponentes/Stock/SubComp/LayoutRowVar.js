import React from 'react'
import {
    Col,
    FormGroup,
    Row,
    Input
} from "reactstrap";
const LayoutRowVar = ({ variedad, stock, deleteRow, id, tipoVar }) => {

    return (
        <>
            <Row key={id}>
                <Col lg="8">
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
                <Col lg="4" style={{ textAlign: "left" }}>
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

export default LayoutRowVar