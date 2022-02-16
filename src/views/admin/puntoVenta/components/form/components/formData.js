import React from 'react'
import {
    Col,
    FormGroup,
    Input,
    Row
} from 'reactstrap'
import CrtImg from '../../../../../../assets/img/brand/crtImg.png'
import KeyImg from '../../../../../../assets/img/brand/keyImg.png'
const FormData = ({
    cuit,
    setCuit,
    razSoc,
    setRazSoc,
    ptoVta,
    setPtoVta,
    iniAct,
    setIniAct,
    direcciones,
    setDirecciones,
    iibb,
    setIibb,
    condIva,
    categoria,
    setCategoria,
    urlCrt,
    urlKey,
    setUrlCrt,
    setCertificado,
    setNvoCert,
    setUrlKey,
    setLlave,
    setNvoKey,
    setCondIva
}) => {

    const PickCert = (e) => {
        setUrlCrt(e.target.value)
        setCertificado(e.target.files[0])
        setNvoCert(true)
    }

    const PickKey = (e) => {
        setUrlKey(e.target.value)
        setLlave(e.target.files[0])
        setNvoKey(true)
    }

    return (
        <div className="pl-lg-4">
            <Row>
                <Col lg="4">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-cuit"
                        >
                            CUIT
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-cuit"
                            placeholder="CUIT..."
                            type="text"
                            value={cuit}
                            onChange={e => setCuit(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="8">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-raz"
                        >
                            Razón Social
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-raz"
                            placeholder="Razón Social..."
                            type="text"
                            value={razSoc}
                            onChange={e => setRazSoc(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="3">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-ptovta"
                        >
                            Punto de Venta
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-ptovta"
                            placeholder="Punto de venta..."
                            type="number"
                            value={ptoVta}
                            onChange={e => setPtoVta(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="3">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-inicio"
                        >
                            Inicio de Actividades
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-inicio"
                            placeholder="inicio de Actividades..."
                            type="date"
                            value={iniAct}
                            onChange={e => setIniAct(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                <Col lg="6">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-direccion"
                        >
                            Dirección
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-direccion"
                            placeholder="Dirección..."
                            type="text"
                            value={direcciones}
                            onChange={e => setDirecciones(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col lg="4">
                    <FormGroup>
                        <label
                            className="form-control-label"
                            htmlFor="input-iibb"
                        >
                            Ingreso Brutos
                        </label>
                        <Input
                            className="form-control-alternative"
                            id="input-iibb"
                            placeholder="Ingresos brutos..."
                            type="number"
                            value={iibb}
                            onChange={e => setIibb(e.target.value)}
                            required
                        />
                    </FormGroup>
                </Col>
                {
                    parseInt(condIva) === 0 ?
                        <>
                            <Col lg="6">
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-iva"
                                    >
                                        Cond. frente al IVA
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-iva"
                                        type="select"
                                        value={condIva}
                                        onChange={e => setCondIva(e.target.value)}
                                    >
                                        <option value={0} >Monotributista</option>
                                        <option value={1}>Exento</option>
                                        <option value={2}>No inscripto</option>
                                        <option value={3}>Inscripto</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col lg="2">
                                <FormGroup>
                                    <label
                                        className="form-control-label"
                                        htmlFor="input-cat"
                                    >
                                        Categoría
                                    </label>
                                    <Input
                                        className="form-control-alternative"
                                        id="input-cat"
                                        type="select"
                                        value={categoria}
                                        onChange={e => setCategoria(e.target.value)}
                                    >
                                        <option value={0}>A</option>
                                        <option value={1}>B</option>
                                        <option value={2}>C</option>
                                        <option value={3}>D</option>
                                    </Input>
                                </FormGroup>
                            </Col>
                        </> :
                        <Col lg="6">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-cond"
                                >
                                    Cond. frente al IVA
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    id="input-cond"
                                    type="select"
                                    value={condIva}
                                    onChange={e => setCondIva(e.target.value)}
                                >
                                    <option value={0}>Monotributista</option>
                                    <option value={1}>Exento</option>
                                    <option value={2}>No inscripto</option>
                                    <option value={3}>Inscripto</option>
                                </Input>
                            </FormGroup>
                        </Col>
                }
            </Row>
            <Row>
                <Col lg="6">
                    {
                        urlCrt === "" ?
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-crt"
                                >
                                    Certificado Digital (.crt)
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    style={{ marginTop: "10px" }}
                                    id="input-crt"
                                    placeholder="Logo..."
                                    type="file"
                                    accept=".crt"
                                    onChange={e => PickCert(e)}
                                    required
                                />
                            </FormGroup> :
                            <Col lg="4" style={{ padding: 0, margin: "auto", textAlign: "center" }}>
                                <img
                                    src={CrtImg}
                                    alt="logo"
                                    style={{
                                        height: "140px",
                                        marginTop: "15px"
                                    }}
                                />
                                <button
                                    onClick={e => setUrlCrt("")}
                                    className="btn btn-danger"
                                    style={{
                                        paddingInline: "10px",
                                        paddingTop: "4px",
                                        paddingBottom: "3px",
                                        borderRadius: "20px",
                                        position: "absolute",
                                        top: "5px",
                                        left: "8px"
                                    }}>
                                    <i className="fa fa-times" style={{ fontSize: "13px" }}></i>
                                </button>
                            </Col>
                    }

                </Col>
                <Col lg="6">
                    {
                        urlKey === "" ?
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-key"
                                >
                                    Llave privada (.key)
                                </label>
                                <Input
                                    className="form-control-alternative"
                                    style={{ marginTop: "10px" }}
                                    id="input-crt"
                                    placeholder="Logo..."
                                    type="file"
                                    accept=".key"
                                    onChange={e => PickKey(e)}
                                    required
                                />
                            </FormGroup> :
                            <Col lg="4" style={{ padding: 0, margin: "auto", textAlign: "center" }}>

                                <img
                                    src={KeyImg}
                                    alt="logo"
                                    style={{
                                        height: "140px",
                                        marginTop: "15px"
                                    }}
                                />
                                <button
                                    onClick={e => setUrlKey("")}
                                    className="btn btn-danger"
                                    style={{
                                        paddingInline: "10px",
                                        paddingTop: "4px",
                                        paddingBottom: "3px",
                                        borderRadius: "20px",
                                        position: "absolute",
                                        top: "5px",
                                        left: "8px"
                                    }}>
                                    <i className="fa fa-times" style={{ fontSize: "13px" }}></i>
                                </button>
                            </Col>
                    }
                </Col>
            </Row>
        </div>
    )
}

export default FormData