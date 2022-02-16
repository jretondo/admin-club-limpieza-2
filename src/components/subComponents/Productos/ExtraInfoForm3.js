import React from 'react'
import {
    Row,
    Col,
    FormGroup
} from "reactstrap"
// eslint-disable-next-line
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ExtraInfoForm2 = ({ model, setModel, titulo }) => {

    return (
        <Row>
            <Col lg="12">
                <FormGroup>

                    <label
                        className="form-control-label"
                        htmlFor="input-username"
                    >
                        {titulo}
                    </label>
                    <Row>
                        <Col md="12" style={{ marginTop: "10px" }}>
                            <ReactQuill
                                debug='info'
                                placeholder='Escriba o pegue algo...'
                                theme='snow'
                                value={model}
                                onChange={setModel}
                                modules={{
                                    toolbar: ['bold', 'italic', 'underline']
                                }}
                            />
                        </Col>
                    </Row>
                </FormGroup>
            </Col>
        </Row>
    )
}

export default ExtraInfoForm2