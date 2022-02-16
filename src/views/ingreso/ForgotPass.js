import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  NavLink,
  Spinner
} from "reactstrap";
import { Link, Redirect } from "react-router-dom";
import UrlNodeServer from '../../api/NodeServer'
import axios from 'axios'

const ForgPass = ({ setColorAlert, setMsgAlert, setMsgAlertStrong, setAlertToggle }) => {
  const [email, setEmail] = useState("")
  const [esperar, setEsperar] = useState(false)
  const [done, setDone] = useState(false)

  const recuperarPass = async () => {
    const datos = {
      email: email
    }
    setEsperar(true)
    await axios.patch(UrlNodeServer.authDir.auth, datos)
      .then(res => {
        setEsperar(false)
        const respuesta = res.data
        const estatus = parseInt(respuesta.status)
        if (estatus === 200) {
          setColorAlert("success")
          setMsgAlertStrong("Contraseña cambiada!")
          setMsgAlert("Revise su correo que le tiene que haber llegado un correo con la nueva contraseña")
          setAlertToggle("")
          setDone(true)
          setTimeout(() => {
            setAlertToggle("none")
          }, 5000);
        } else {
          setColorAlert("danger")
          setMsgAlertStrong("Error inesperado!")
          setMsgAlert("Hubo un error al querer recuperar su contraseña. intente nuevamente más tarde.")
          setAlertToggle("")
          setTimeout(() => {
            setAlertToggle("none")
          }, 5000);
        }
      })
      .catch(() => {
        setColorAlert("danger")
        setMsgAlertStrong("Error inesperado!")
        setMsgAlert("Hubo un error al querer recuperar su contraseña. intente nuevamente más tarde.")
        setAlertToggle("")
        setTimeout(() => {
          setAlertToggle("none")
        }, 5000);
      })
  }

  if (done) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + "/auth/login"}
      />
    )
  } else {
    return (
      <>
        <Col lg="5" md="7">
          <Card className="bg-secondary shadow border-0">
            <CardBody className="px-lg-5">
              <div className="text-center text-muted mb-4">
                <span style={{ fontWeight: "bold" }}>Ingrese su casilla de correo:</span>
              </div>
              {
                esperar ?
                  <Col md="12" style={{ textAlign: "center" }}>
                    <Spinner color="primary" style={{ width: "250px", height: "250px" }} />
                  </Col> :
                  <Form onSubmit={e => {
                    e.preventDefault()
                    recuperarPass()
                  }}>
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="new-email" id="emailInp" required />
                      </InputGroup>
                    </FormGroup>

                    <div className="text-center">
                      <Button style={{ marginTop: "3em" }} color="primary" type="submit">
                        Recuperar Contraseña
                      </Button>
                    </div>
                  </Form>
              }
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              <NavLink
                className="text-light"
                to={process.env.PUBLIC_URL + "/auth/login"}
                tag={Link}
              >
                <small>Loguearse</small>
              </NavLink>
            </Col>
            <Col className="text-right" xs="6">

            </Col>
          </Row>
        </Col>
      </>
    );
  }
}

export default ForgPass;
