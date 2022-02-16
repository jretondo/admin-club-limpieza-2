import React, { useState, useEffect } from "react";
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
import { seguridadClave } from 'Function/SecurityPass'
import axios from "axios";
import { UseSecureRoutes } from "Hooks/UseSecureRoutes";

const NvaPass = ({ setColorAlert, setMsgAlert, setMsgAlertStrong, setAlertToggle }) => {
  const [pass1, setPass1] = useState("")
  const [pass2, setPass2] = useState("")
  const [done, setDone] = useState(false)
  const [passSecureStr, setPassSecureStr] = useState("muy débil")
  const [passSecureColor, setPassSecureColor] = useState("danger")
  const [call, setCall] = useState(false)
  const { loading, error } = UseSecureRoutes(
    UrlNodeServer.routesDir.sub.changePass,
    call
  )

  useEffect(() => {
    setCall(!call)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!loading) {
      if (error) {
        setColorAlert("danger")
        setMsgAlertStrong("Error interno!")
        setMsgAlert("")
        setAlertToggle("")
        setTimeout(() => {
          setAlertToggle("none")
        }, 5000);
      } else {
        setColorAlert("success")
        setMsgAlertStrong("Cambie la contraseña!")
        setMsgAlert("")
        setAlertToggle("")
        setTimeout(() => {
          setAlertToggle("none")
        }, 5000);
      }
    }
    // eslint-disable-next-line 
  }, [loading])

  const recuperarPass = async (e) => {
    e.preventDefault()
    const seguridad = parseInt(seguridadClave(pass1))
    if (seguridad === 100) {
      if (pass1 === pass2) {
        const datos = {
          password: pass1
        }
        await axios.put(UrlNodeServer.authDir.auth, datos, {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('user-token') }
        })
          .then(() => {
            setColorAlert("success")
            setMsgAlertStrong("Contraseña cambiada con éxito!")
            setMsgAlert("Ingrese con sus nuevas credenciales")
            setAlertToggle("")
            setDone(true)
            setTimeout(() => {
              setAlertToggle("none")
            }, 5000);
          })
          .catch(() => {
            setColorAlert("danger")
            setMsgAlertStrong("Error inesperado!")
            setMsgAlert(error)
            setAlertToggle("")
            setTimeout(() => {
              setAlertToggle("none")
            }, 5000);
          })
      } else {
        setColorAlert("danger")
        setMsgAlertStrong("No coinciden las contraseñas!")
        setMsgAlert("Las contraseñas deben ser iguales.")
        setAlertToggle("")
        document.getElementById("emailInp").select()
        setTimeout(() => {
          setAlertToggle("none")
        }, 5000);
      }
    } else {
      setColorAlert("danger")
      setMsgAlertStrong("Contraseña insegura!")
      setMsgAlert("La contraseña debe ser segura.")
      setAlertToggle("")
      document.getElementById("emailInp").select()
      setTimeout(() => {
        setAlertToggle("none")
      }, 5000);
    }
  }

  const nivelPass = (e) => {
    setPass1(e)
    let seguridad = seguridadClave(e)
    if (seguridad < 20) {
      setPassSecureColor("danger")
      setPassSecureStr("muy débil")
    } else if (seguridad < 50) {
      setPassSecureColor("orange")
      setPassSecureStr("débil")
    } else if (seguridad < 100) {
      setPassSecureColor("info")
      setPassSecureStr("regular")
    } else {
      setPassSecureColor("success")
      setPassSecureStr("segura")
    }
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
                <span style={{ fontWeight: "bold" }}>Ingrese su nueva contraseña:</span>
              </div>

              <Form role="form" onSubmit={e => recuperarPass(e)}>
                {
                  loading ?
                    <div style={{ textAlign: "center" }}>
                      <Spinner type="grow" color="light" /> </div> :
                    <>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Nueva contraseña" type="password" value={pass1} onChange={e => nivelPass(e.target.value)} autoComplete="new-email" id="emailInp" required />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="mb-3">
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input placeholder="Repetir contraseña" type="password" value={pass2} onChange={e => setPass2(e.target.value)} autoComplete="new-email" id="emailInp2" required />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-muted font-italic">
                        <small>
                          Nivel de seguridad:{"  "}
                          <span className={"font-weight-700 text-" + passSecureColor}>{passSecureStr}</span>
                        </small>
                      </div>
                      <div className="text-center">
                        <Button style={{ marginTop: "3em" }} color="primary" type="submit">
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </>
                }
              </Form>
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

export default NvaPass;
