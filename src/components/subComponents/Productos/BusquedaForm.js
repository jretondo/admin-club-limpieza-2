import React, { useEffect, useState } from 'react'
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
    setPalabraBuscada,
    palabraBuscada,
    setBusquedaBool,
    call,
    setCall,
    titulo
}) => {
    const [primera, setPrimera] = useState(false)

    const BuscarPalabra = () => {
        setBusquedaBool(true)
        setCall(!call)
    }

    const changeText = (e) => {
        if (palabraBuscada.length > 0) {
            setPrimera(true)
        }
        setPalabraBuscada(e.target.value)
    }

    useEffect(() => {
        if (palabraBuscada.length === 0) {
            if (primera) {
                BuscarPalabra()
            }
        }
    }, [palabraBuscada])

    useEffect(() => {
        document.getElementById("inp-busqueda").focus()
    }, [])

    return (
        <Form
            className="navbar-search navbar-search-dark form-inline mr-3 d-md-flex ml-lg-auto"
            style={{ textAlign: "right" }}
            onSubmit={e => {
                e.preventDefault()
                BuscarPalabra(e)
            }}
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
                                onChange={e => changeText(e)}
                                id="inp-busqueda"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </FormGroup>
        </Form>
    )

}

export default BusquedaProdForm