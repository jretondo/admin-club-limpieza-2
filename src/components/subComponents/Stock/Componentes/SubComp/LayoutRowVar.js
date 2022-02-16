import React from 'react'
import {
    Col,
    FormGroup,
    Row,
    Input
} from "reactstrap";
const LayoutRowVar = ({ variedad, stock, id, tipoVar }) => {

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
                            disabled
                        />
                    </FormGroup>
                </Col>
                <Col lg="4">
                    <FormGroup>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Variedad..."
                            type="number"
                            value={stock}
                            disabled
                        />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default LayoutRowVar