import React from 'react';
import { BsArrowDownCircle, BsArrowUpCircle } from 'react-icons/bs';
import { Button, Col, Row } from 'reactstrap';

const FilaOrden = ({
    title,
    position,
    subir,
    bajar
}) => {

    return (
        <Row style={position === 0 ? {} : { marginTop: "5px" }} >
            <Col md="8" style={{ paddingTop: "5px" }}>
                <span style={{ margin: "auto", marginTop: "10px" }}>
                    {title}
                </span>
            </Col>
            <Col md="4">
                <Row style={{ textAlign: "right" }}>
                    <Col md="12" style={{ textAlign: "right" }}>
                        {
                            position === 0 ?
                                <Button
                                    onClick={e => {
                                        e.preventDefault()
                                    }}
                                    color={"gray"} style={{ padding: 0, margin: 0, borderRadius: "50%", marginInline: "5px" }} disabled={position === 0 ? true : false} ><BsArrowUpCircle size={"30px"} /></Button>
                                :
                                <Button
                                    onClick={e => {
                                        e.preventDefault()
                                        subir(position)
                                    }}
                                    color={"success"} style={{ padding: 0, margin: 0, borderRadius: "50%", marginInline: "5px" }} disabled={position === 0 ? true : false} ><BsArrowUpCircle size={"30px"} /></Button>
                        }
                        {
                            position === 3 ?
                                <Button
                                    onClick={e => {
                                        e.preventDefault()
                                    }}
                                    color={"gray"} style={{ padding: 0, margin: 0, borderRadius: "50%", marginInline: "5px" }} disabled={position === 3 ? true : false}><BsArrowDownCircle size={"30px"} /></Button>
                                :
                                <Button
                                    onClick={e => {
                                        e.preventDefault()
                                        bajar(position)
                                    }}
                                    color={"danger"} style={{ padding: 0, margin: 0, borderRadius: "50%", marginInline: "5px" }} disabled={position === 3 ? true : false}><BsArrowDownCircle size={"30px"} /></Button>
                        }
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export default FilaOrden