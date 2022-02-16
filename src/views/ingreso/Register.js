import React, { useState } from "react"
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  UncontrolledTooltip,
  NavLink,
  Spinner,
  Modal
} from "reactstrap"
import { Link, Redirect } from "react-router-dom";
import UrlNodeServer from '../../api/NodeServer';
import axios from 'axios';
import { privacidadLegal } from '../../components/Legales/Privacidad';
import { terminosLegales } from '../../components/Legales/Terminos'

const letras_mayusculas = "ABCDEFGHYJKLMNÑOPQRSTUVWXYZ"
const letras = "abcdefghyjklmnñopqrstuvwxyz"
const numeros = "0123456789"

const Register = ({ setColorAlert, setMsgAlert, setMsgAlertStrong, setAlertToggle }) => {
  const [cuit, setCuit] = useState("")
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [passSecureStr, setPassSecureStr] = useState("muy débil")
  const [passSecureColor, setPassSecureColor] = useState("danger")
  const [verPassToggle, setVerPassToggle] = useState(false)
  const [typeInpPass, setTypeInpPass] = useState("password")
  const [esperar, setEsperar] = useState(false)
  const [privacidad, setPrivacidad] = useState(false)
  const [terminos, setTerminos] = useState(false)
  const [registrado, setregistrado] = useState(false)

  const PrivacidadToggle = (e) => {
    e.preventDefault()
    setPrivacidad(!privacidad)
  }

  const TerminosToggle = (e) => {
    e.preventDefault()
    setTerminos(!terminos)
  }

  function createMarkup1() {
    return { __html: privacidadLegal };
  }

  function createMarkup2() {
    return { __html: terminosLegales };
  }

  const registrar = async (e) => {
    e.preventDefault()
    const largoCuit = cuit.length
    const seguridad = seguridadClave(pass)

    if (largoCuit !== 11) {
      setColorAlert("danger")
      setMsgAlertStrong("CUIT erroneo!")
      setMsgAlert("Revise el número de CUIT.")
      setAlertToggle("")
      document.getElementById("cuitInp").select()
      document.getElementById("cuitInp").focus()
      setTimeout(() => {
        setAlertToggle("none")
      }, 4000);
    } else if (seguridad < 100) {
      setColorAlert("danger")
      setMsgAlertStrong("Contraseña insegura!")
      setMsgAlert("La contraseña tiene que tener mayúsculas, minúsculas, números y al menos 8 carácteres")
      setAlertToggle("")
      document.getElementById("passInp").select()
      document.getElementById("passInp").focus()
      setTimeout(() => {
        setAlertToggle("none")
      }, 5000);
    } else {
      setEsperar(true)
      const datos1 = {
        cuit: cuit
      }
      try {

        await axios.post(UrlNodeServer.datosAfip, datos1)
          .then(async res1 => {
            const respuesta = res1.data
            const estatusServer = respuesta.estatus
            const respuesta1 = respuesta.datosAfip
            if (respuesta) {

              if (estatusServer === 200) {

                const datos2 = {
                  cuit: cuit,
                  email: email
                }

                await axios.post(UrlNodeServer.verificaUsu, datos2)
                  .then(async res2 => {
                    const respuesta2 = res2.data
                    const estatus2 = parseInt(respuesta2.status)
                    if (estatus2 === 200) {
                      const cantidad = respuesta2.result[0].CANT
                      if (cantidad === 0) {
                        const datosGenerales = respuesta1.datosGenerales
                        const datosMonotributo = respuesta1.datosMonotributo
                        const datosRegimenGeneral = respuesta1.datosRegimenGeneral
                        const tipoPersona = datosGenerales.tipoPersona
                        let razonSocial
                        let condIva
                        let persJuridica
                        let catMono
                        let nombre
                        let apellido
                        let impuesto
                        if (tipoPersona === "JURIDICA") {
                          razonSocial = datosGenerales.razonSocial
                          persJuridica = 1
                          nombre = ""
                          apellido = ""
                        } else {
                          razonSocial = datosGenerales.apellido + " " + datosGenerales.nombre
                          nombre = datosGenerales.nombre
                          apellido = datosGenerales.apellido
                          persJuridica = 0
                        }

                        if (datosMonotributo) {
                          impuesto = ""
                          condIva = 6
                          catMono = datosMonotributo.categoriaMonotributo.descripcionCategoria
                          catMono = catMono.substring(0, 1)
                        } else {
                          impuesto = datosRegimenGeneral.impuesto

                          impuesto.forEach(item => {
                            const idImp = parseInt(item.idImpuesto)

                            if (idImp === 30) {
                              condIva = 1
                            } else if (idImp === 32) {
                              condIva = 3
                            }
                          });
                        }

                        const datos3 = {
                          cuit: cuit,
                          email: email,
                          pass: pass,
                          razonSocial: razonSocial,
                          condIva: condIva,
                          catMono: catMono,
                          persJuridica: persJuridica,
                          nombre: nombre,
                          apellido: apellido
                        }

                        await axios.post(UrlNodeServer.nvoUsu, datos3)
                          .then(res3 => {
                            const respuesta3 = res3.data
                            const estatus3 = parseInt(respuesta3.status)

                            if (estatus3 === 200) {
                              const affected = parseInt(respuesta3.result.affectedRows)

                              if (affected > 0) {
                                setEsperar(false)
                                setColorAlert("success")
                                setMsgAlertStrong("Registrado con éxito!")
                                setMsgAlert("Revise su casilla de email para confirmar su cuenta.")
                                setAlertToggle("")
                                document.getElementById("cuitInp").select()
                                document.getElementById("cuitInp").focus()
                                setCuit("")
                                setEmail("")
                                setPass("")
                                setPassSecureColor("danger")
                                setPassSecureStr("muy débil")
                                setregistrado(true)
                                setTimeout(() => {
                                  setAlertToggle("none")
                                }, 4000);
                              } else {
                                setEsperar(false)
                                setColorAlert("warning")
                                setMsgAlertStrong("Error inesperado!")
                                setMsgAlert("Intente nuevamente o reporte el error.")
                                setAlertToggle("")
                                document.getElementById("cuitInp").select()
                                document.getElementById("cuitInp").focus()
                                setTimeout(() => {
                                  setAlertToggle("none")
                                }, 4000);
                              }
                            } else {
                              setEsperar(false)
                              setColorAlert("warning")
                              setMsgAlertStrong("Error inesperado!")
                              setMsgAlert("Intente nuevamente o reporte el error.")
                              setAlertToggle("")
                              document.getElementById("cuitInp").select()
                              document.getElementById("cuitInp").focus()
                              setTimeout(() => {
                                setAlertToggle("none")
                              }, 4000);
                            }
                          })
                      } else {
                        setEsperar(false)
                        setColorAlert("danger")
                        setMsgAlertStrong("Usuario ya existente!")
                        setMsgAlert("El cuit o email que quiere registrar ya existe! Logueese o recupere la contraseña.")
                        setAlertToggle("")
                        document.getElementById("cuitInp").select()
                        document.getElementById("cuitInp").focus()
                        setTimeout(() => {
                          setAlertToggle("none")
                        }, 4000);
                      }
                    } else {
                      setEsperar(false)
                      setColorAlert("warning")
                      setMsgAlertStrong("Error inesperado!")
                      setMsgAlert("Intente nuevamente o reporte el error.")
                      setAlertToggle("")
                      document.getElementById("cuitInp").select()
                      document.getElementById("cuitInp").focus()
                      setTimeout(() => {
                        setAlertToggle("none")
                      }, 4000);
                    }
                  })
              } else {
                setEsperar(false)
                setColorAlert("danger")
                setMsgAlertStrong("Servidores caídos!")
                setMsgAlert("Le pedimos mil disculpas, pero los servidores de AFIP se encuentran inhabilitados por el momento. Pruebe más tarde.")
                setAlertToggle("")
                document.getElementById("cuitInp").select()
                document.getElementById("cuitInp").focus()
                setTimeout(() => {
                  setAlertToggle("none")
                }, 7000);
              }
            } else {
              setEsperar(false)
              setColorAlert("danger")
              setMsgAlertStrong("CUIT erroneo!")
              setMsgAlert("Revise el número de CUIT.")
              setAlertToggle("")
              document.getElementById("cuitInp").select()
              document.getElementById("cuitInp").focus()
              setTimeout(() => {
                setAlertToggle("none")
              }, 4000);
            }
          })
      } catch (error) {
        setEsperar(false)
        setColorAlert("warning")
        setMsgAlertStrong("Error inesperado!")
        setMsgAlert("Intente nuevamente o reporte el error.")
        setAlertToggle("")
        document.getElementById("cuitInp").select()
        document.getElementById("cuitInp").focus()
        setTimeout(() => {
          setAlertToggle("none")
        }, 4000);
      }
    }
  }

  const togglePass = (e) => {
    e.preventDefault()
    if (verPassToggle) {
      setTypeInpPass("password")
    } else {
      setTypeInpPass("text")
    }
    setVerPassToggle(!verPassToggle)
  }

  const nivelPass = (e) => {
    setPass(e)
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

  function seguridadClave(clave) {
    var seguridad = 0;
    if (clave.length !== 0) {
      if (tieneNumeros(clave) && tieneLetras(clave)) {
        seguridad += 30;
      }
      if (tieneMinusculas(clave) && tieneMayusculas(clave)) {
        seguridad += 30;
      }
      if (clave.length >= 3 && clave.length <= 4) {
        seguridad += 10;
      } else {
        if (clave.length >= 5 && clave.length <= 7) {
          seguridad += 30;
        } else {
          if (clave.length > 7) {
            seguridad += 40;
          }
        }
      }
    }
    return seguridad
  }

  function tieneNumeros(texto) {
    for (let i = 0; i < texto.length; i++) {
      if (numeros.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  function tieneLetras(texto) {
    texto = texto.toLowerCase();
    for (let i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  function tieneMinusculas(texto) {
    for (let i = 0; i < texto.length; i++) {
      if (letras.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }

  function tieneMayusculas(texto) {
    for (let i = 0; i < texto.length; i++) {
      if (letras_mayusculas.indexOf(texto.charAt(i), 0) !== -1) {
        return 1;
      }
    }
    return 0;
  }
  if (registrado) {
    return (
      <Redirect
        className="text-light"
        to={process.env.PUBLIC_URL + "/auth/login"}
      />
    )
  } else {
    return (
      <>
        <Col lg="6" md="8">
          <Card className="bg-secondary shadow border-0">
            <CardHeader className="bg-transparent">
              <div className="text-muted text-center mt-2 mb-4">
                <span style={{ fontWeight: "bold" }}>Registrese y obtenga <span style={{ fontWeight: "bold", color: "rgb(242, 197, 27)" }}>tres meses </span> de prueba totalmente <span style={{ fontWeight: "bold", color: "rgb(242, 197, 27)" }}>gratis!</span></span>
              </div>
            </CardHeader>
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center text-muted mb-4">
                <span>Complete el siguiente formulario para registrarse:</span>
              </div>
              {
                esperar ?
                  <Col md="12" style={{ textAlign: "center" }}>
                    <Spinner color="primary" style={{ width: "250px", height: "250px" }} />
                  </Col>
                  :
                  <Form role="form" onSubmit={e => registrar(e)}>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-shop" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="CUIT" type="number" id="cuitInp" value={cuit} onChange={e => setCuit(e.target.value)} required />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-email-83" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Email" type="email" autoComplete="new-email" value={email} onChange={e => setEmail(e.target.value)} required />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input placeholder="Contraseña" type={typeInpPass} autoComplete="new-password" value={pass} onChange={e => nivelPass(e.target.value)} id="passInp" required />
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <a href="/xa" id="verPass" onClick={e => togglePass(e)}> <i className="fas fa-eye" style={verPassToggle ? { color: "red" } : { color: "gray" }}></i></a>
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormGroup>

                    <UncontrolledTooltip
                      delay={0}
                      placement="top"
                      target="passInp"
                    >La contraseña debe contener mayúsculas, minúsculas, números y tener al menos 8 carácteres
                    </UncontrolledTooltip>
                    <UncontrolledTooltip
                      delay={0}
                      placement="top"
                      target="verPass"
                    >{
                        verPassToggle ?
                          "Ocultar Contraseña" :
                          "Ver Contraseña"
                      }

                    </UncontrolledTooltip>
                    <div className="text-muted font-italic">
                      <small>
                        Nivel de seguridad:{"  "}
                        <span className={"font-weight-700 text-" + passSecureColor}>{passSecureStr}</span>
                      </small>
                    </div>
                    <Row className="my-4">
                      <Col xs="12">
                        <div className="custom-control custom-control-alternative custom-checkbox">
                          <input
                            className="custom-control-input"
                            id="customCheckRegister"
                            type="checkbox"
                            required
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheckRegister"
                          >
                            <span className="text-muted">
                              Estoy de acuerdo con las{" "}
                              <a href="#pablo" onClick={e => PrivacidadToggle(e)}>
                                Politicas de Privacidad
                              </a>
                            </span>
                          </label>
                        </div>
                      </Col>
                      <Col xs="12">
                        <div className="custom-control custom-control-alternative custom-checkbox">
                          <input
                            className="custom-control-input"
                            id="customCheckRegister2"
                            type="checkbox"
                            required
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="customCheckRegister2"
                          >
                            <span className="text-muted">
                              Estoy de acuerdo con los{" "}
                              <a href="#pablo" onClick={e => TerminosToggle(e)}>
                                Terminos y Condiciones
                              </a>
                            </span>
                          </label>
                        </div>
                      </Col>
                    </Row>
                    <div className="text-center">
                      <Button className="mt-4" color="primary" type="submit">
                        Crear Cuenta
                      </Button>
                    </div>
                  </Form>
              }
            </CardBody>
          </Card>
          <Row className="mt-3">
            <Col xs="6">
              {
                esperar ?
                  null :
                  <NavLink
                    className="text-light"
                    to={process.env.PUBLIC_URL + "/auth/login"}
                    tag={Link}
                  >
                    <small>Loguearse</small>
                  </NavLink>
              }
            </Col>
          </Row>
        </Col>
        <Modal
          className="modal-dialog-centered"
          isOpen={privacidad}
          toggle={() => setPrivacidad(!privacidad)}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Politicas de Privacidad
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setPrivacidad(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">

            <div dangerouslySetInnerHTML={createMarkup1()} />

          </div>
          <div className="modal-footer">
            <Button
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={() => setPrivacidad(false)}
            >
              Cerrar
            </Button>
          </div>
        </Modal>

        <Modal
          className="modal-dialog-centered"
          isOpen={terminos}
          toggle={() => setTerminos(!terminos)}
        >
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Terminos Y Condiciones
            </h5>
            <button
              aria-label="Close"
              className="close"
              data-dismiss="modal"
              type="button"
              onClick={() => setTerminos(false)}
            >
              <span aria-hidden={true}>×</span>
            </button>
          </div>
          <div className="modal-body">
            <div dangerouslySetInnerHTML={createMarkup2()} />
          </div>
          <div className="modal-footer">
            <Button
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={() => setTerminos(false)}
            >
              Cerrar
            </Button>
          </div>
        </Modal>

      </>
    );
  }
}

export default Register;
