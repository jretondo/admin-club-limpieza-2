import React from 'react'
import {
    Form,
    FormGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
    InputGroup,
    Row,
} from "reactstrap"
import Col from 'reactstrap/lib/Col'

const BusquedaProdForm = ({
    busquedaBool,
    setPalabraBuscada,
    palabraBuscada,
    setBusquedaBool,
    call,
    setCall,
    titulo
}) => {

    const BuscarPalabra = (e) => {
        e.preventDefault()
        setBusquedaBool(true)
        setCall(!call)
    }

    const CancelaBusqueda = (e) => {
        e.preventDefault()
        setBusquedaBool(false)
        setPalabraBuscada("")
        setCall(!call)
    }

    if (busquedaBool) {
        return (
            <Form
                className="navbar-search navbar-search-dark form-inline mr-3 d-md-flex ml-lg-auto"
                style={{ textAlign: "right" }}
            >
                <FormGroup className="mb-0" style={{ marginLeft: "auto" }}>
                    <Row>
                        <Col style={{ textAlign: "center", paddingTop: "25px", paddingRight: 0 }} >
                            <span>Palabra buscada</span>
                        </Col>
                        <Col md="6" >
                            <InputGroup className="input-group-alternative" style={{ borderRadius: 0 }}>
                                <Input
                                    value={palabraBuscada}
                                    type="text"
                                    style={{ color: "#7a66de", padding: "30px", fontWeight: "bold", fontSize: "18px" }}
                                    disabled
                                />
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <button
                                            className="btn btn-danger"
                                            onClick={e => CancelaBusqueda(e)}
                                        >X</button>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                </FormGroup>
            </Form>
        )
    } else {
        return (
            <Form
                className="navbar-search navbar-search-dark form-inline mr-3 d-md-flex ml-lg-auto"
                style={{ textAlign: "right" }}
                onSubmit={e => BuscarPalabra(e)}
            >
                <FormGroup className="mb-0" style={{ marginLeft: "auto" }}>
                    <Row>
                        <Col style={{ textAlign: "center", paddingTop: "16px", paddingRight: 0 }} >
                            <span>{titulo}</span>
                        </Col>
                        <Col md="6" >
                            <InputGroup className="input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <i className="fas fa-search" style={{ color: "black" }} />
                                    </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                    placeholder="Buscar"
                                    type="text"
                                    style={{ color: "black" }}
                                    value={palabraBuscada}
                                    onChange={e => setPalabraBuscada(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                    </Row>
                </FormGroup>
            </Form>
        )
    }
}

export default BusquedaProdForm