import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useActividad } from '../../../Hooks/UseNvaActividad'
import { Redirect } from "react-router-dom"
// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    Container,
    Row,
    Spinner,
    Col,
    Form,
    FormGroup
} from "reactstrap"
// core components
import Header from "components/Headers/Header.js";
import UrlNodeServer from '../../../api/NodeServer'
import InfoForm from '../../../components/subComponents/Productos/InfoForm'
import CategoriasForm from '../../../components/subComponents/Productos/Categorias'
import SubCAtegoriasForm from '../../../components/subComponents/Productos/SubCategorias'
import ImagenesForm from '../../../components/subComponents/Productos/ImagenesForm'
import AlertaForm from '../../../components/subComponents/Alertas/Alerta1'
import { UseSecureRoutes } from "Hooks/UseSecureRoutes"
import ProdList from "./components/prodlist"
import moment from "moment"

const Productos = () => {
    const [alertar, setAlertar] = useState(false)
    const [msgStrongAlert, setMsgStrong] = useState("")
    const [msgGralAlert, setMsgGralAlert] = useState("")
    const [successAlert, setSuccessAlert] = useState(false)
    const [esperar, setEsperar] = useState(false)
    const [nvaOffer, setNvaOffer] = useState(false)
    const [nombreNvo, setNombreNvo] = useState("")
    const [costo, setCosto] = useState("")
    const [descrCortaNvo, setDescrCortaNvo] = useState("")
    const [categoriaNvo, setCategoriaNvo] = useState("")
    const [subCatNvo, setSubCatNvo] = useState("")
    const [unidad, setUnidad] = useState(0)
    const [venta, setVenta] = useState("")
    const [codBarra, setCodBarra] = useState("")
    const [ivaCosto, setIvaCosto] = useState(21)
    const [round, setRound] = useState(0)
    const [idProv, setIdProv] = useState("")
    const [precioVta, setPrecioVta] = useState("")
    const [roundBool, setRoundBool] = useState(false)
    const [vtaFijaBool, setVtaFijaBool] = useState(false)
    const [listaImgNvas, setListaImgNvas] = useState([])
    const [plantNvasImg, setPlantNvasImg] = useState(<></>)

    const [listaCat, setListaCat] = useState([])
    const [listaSubCat, setListaSubCat] = useState([])
    const [plantCat, setPlantCat] = useState(<></>)
    const [plantSubCat, setPlantSubCat] = useState(<></>)

    const [call, setCall] = useState(false)

    const [detallesBool, setDetallesBool] = useState(false)
    const [idDetalle, setIdDetalle] = useState(0)
    const [listaImgEliminadas, setListaImgEliminadas] = useState([])
    const [copiarDet, setCopiarDet] = useState(false)

    const [nvaActCall, setNvaActCall] = useState(false)
    const [actividadStr, setActividadStr] = useState("")

    const [busquedaBool, setBusquedaBool] = useState(false)
    const [palabraBuscada, setPalabraBuscada] = useState("")
    const [pagina, setPagina] = useState(1)

    const [lastUpdate, setLastUpdate] = useState("")

    useActividad(
        nvaActCall,
        actividadStr
    )

    const { loading, error } = UseSecureRoutes(
        UrlNodeServer.routesDir.sub.productos,
        call
    )

    useEffect(() => {
        if (detallesBool || copiarDet) {
            DetalleProducto()
        }
        // eslint-disable-next-line 
    }, [detallesBool, idDetalle])

    const ResetStatesForm = () => {
        setNombreNvo("")
        setCosto("")
        setDescrCortaNvo("")
        setCategoriaNvo("")
        setSubCatNvo("")
        setListaImgNvas([])
        setListaImgEliminadas([])
        setPlantNvasImg(<></>)
        setCopiarDet(false)
        setCodBarra("")
        setUnidad(0)
        setVenta("")
        setVtaFijaBool(false)
        setPrecioVta("")
    }

    const NvoProducto = async (update) => {
        setEsperar(true)
        let formData = new FormData();
        let typeSend = "POST"
        if (!copiarDet) {
            if (update) {
                formData.append("id", idDetalle);
                typeSend = "PUT"
                if (listaImgEliminadas.length > 0) {
                    // eslint-disable-next-line
                    listaImgEliminadas.map(imagen => {
                        formData.append("imagenEliminada", imagen);
                    })
                }
            }

        }
        if (listaImgNvas.length > 0) {
            await new Promise((resolve, reject) => {
                // eslint-disable-next-line
                listaImgNvas.map((img, key) => {
                    fetch(listaImgNvas[key][0])
                        .then(res => res.blob())
                        .then(blob => {
                            const fileImg = new File([blob], `${nombreNvo}${key}.jpg`, {
                                type: 'image/jpeg'
                            });
                            if (parseInt(listaImgNvas[key][1]) === 0) {
                                formData.append("product", fileImg, `${nombreNvo}${key}.jpg`);
                            }
                            if (key === listaImgNvas.length - 1) {
                                resolve()
                            }
                        })
                })
            })
        }

        formData.append("precio_compra", costo);
        formData.append("name", nombreNvo);
        formData.append("short_descr", descrCortaNvo);
        formData.append("category", categoriaNvo);
        formData.append("subcategory", subCatNvo);
        formData.append("cod_barra", codBarra);
        formData.append("unidad", unidad);
        formData.append("iva", ivaCosto);
        formData.append("id_prov", idProv);
        formData.append("porc_minor", venta);
        formData.append("vta_price", precioVta)
        if (vtaFijaBool) {
            formData.append("vta_fija", vtaFijaBool)
        }

        if (roundBool) {
            formData.append("round", round);
        } else {
            formData.append("round", 0);
        }

        async function postData(url = '', data = {}) {
            // Default options are marked with *
            const response = await fetch(url, {
                method: typeSend,
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            });
            return response;
        }
        postData(UrlNodeServer.productsDir.products, formData)
            .then(async data => {
                let respuesta = await data.json()
                const status = parseInt(respuesta.status)
                setEsperar(false)
                if (status === 200) {
                    if (update) {
                        setActividadStr("El usuario ha modificado el producto '" + nombreNvo + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Producto modificado con éxito!")
                    } else {
                        setActividadStr("El usuario ha agregado el producto '" + nombreNvo + "'")
                        setNvaActCall(!nvaActCall)
                        setMsgStrong("Producto caragado con éxito!")
                    }
                    setMsgGralAlert("")
                    setSuccessAlert(true)
                    setAlertar(!alertar)
                    ResetStatesForm()
                } else {
                    setMsgStrong("No se pudo cargar el producto correctamente!")
                    setMsgGralAlert("")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("No se pudo cargar el producto correctamente!")
                setMsgGralAlert("")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    const DetalleProducto = async () => {
        ResetStatesForm();
        setEsperar(true)
        await axios.get(`${UrlNodeServer.productsDir.sub.details}/${idDetalle}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setEsperar(false)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const gralData = respuesta.body.productGral[0]
                    const imgData = respuesta.body.productImg

                    setNombreNvo(gralData.name)
                    setCategoriaNvo(gralData.category)
                    setSubCatNvo(gralData.subcategory)
                    setDescrCortaNvo(gralData.short_descr)
                    setCosto(gralData.precio_compra)
                    setCodBarra(gralData.cod_barra)
                    setUnidad(gralData.unidad)
                    setVenta(gralData.porc_minor)
                    setIvaCosto(gralData.iva)
                    setPrecioVta(gralData.vta_price)
                    setVtaFijaBool(gralData.vta_fija)
                    setLastUpdate(gralData.update_time)
                    const roundConst = parseInt(gralData.round)
                    if (roundConst > 0) {
                        setRound(roundConst)
                        setRoundBool(true)
                    } else {
                        setRound(0)
                        setRoundBool(false)
                    }
                    if (imgData.length > 0) {
                        let imagenes = []
                        // eslint-disable-next-line
                        imgData.map((item, key) => {
                            if (item.url_img !== "") {
                                imagenes.push([item.url_img, item.id])
                            }
                            if (key === imgData.length - 1) {
                                setListaImgNvas(imagenes)
                            }
                        })
                    }

                } else {
                    setMsgStrong("Hubo un error al querer cargar el producto")
                    setMsgGralAlert("")
                    setSuccessAlert(false)
                    setAlertar(!alertar)
                }
            })
            .catch(() => {
                setEsperar(false)
                setMsgStrong("Hubo un error al querer cargar el producto")
                setMsgGralAlert("")
                setSuccessAlert(false)
                setAlertar(!alertar)
            })
    }

    if (error) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            </div>
        )
    } else {

        return (
            <>
                <AlertaForm
                    success={successAlert}
                    msgStrong={msgStrongAlert}
                    msgGral={msgGralAlert}
                    alertar={alertar}
                />
                <Header />
                <Container className="mt--7" fluid>
                    {
                        esperar ?
                            <div style={{ textAlign: "center", marginTop: "100px" }}>
                                <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} /> </div> :
                            <>
                                <ProdList
                                    detallesBool={detallesBool}
                                    nvaOffer={nvaOffer}
                                    setNvaOffer={setNvaOffer}
                                    call={call}
                                    setCall={setCall}
                                    ResetStatesForm={ResetStatesForm}
                                    setActividadStr={setActividadStr}
                                    nvaActCall={nvaActCall}
                                    setNvaActCall={setNvaActCall}
                                    alertar={alertar}
                                    setAlertar={setAlertar}
                                    setMsgStrong={setMsgStrong}
                                    setMsgGralAlert={setMsgGralAlert}
                                    setSuccessAlert={setSuccessAlert}
                                    setDetallesBool={setDetallesBool}
                                    setIdDetalle={setIdDetalle}
                                    setCopiarDet={setCopiarDet}
                                    setEsperar={setEsperar}
                                    busquedaBool={busquedaBool}
                                    setBusquedaBool={setBusquedaBool}
                                    palabraBuscada={palabraBuscada}
                                    setPalabraBuscada={setPalabraBuscada}
                                    pagina={pagina}
                                    setPagina={setPagina}
                                />

                                <Row style={
                                    detallesBool ?
                                        { display: "block", marginTop: "25px" } :
                                        !nvaOffer ?
                                            { display: "none", marginTop: "25px" } :
                                            { display: "block", marginTop: "25px" }} >
                                    <Col className="order-xl-1" md="12">
                                        <Card className="bg-secondary shadow">
                                            <CardHeader className="bg-white border-0">
                                                <Row className="align-items-center">
                                                    <Col xs="9">
                                                        {
                                                            detallesBool ?
                                                                <h3 className="mb-0">{nombreNvo}
                                                                    <span style={{ fontWeight: "bold", color: "red" }}>(Última modificación: {moment(lastUpdate).format("DD/MM/YYYY h:m")}hs)</span></h3> :
                                                                <h3 className="mb-0">Nuevo Producto</h3>
                                                        }

                                                    </Col>
                                                    <Col xs="3" style={{ textAlign: "right" }}>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                setNvaOffer(false);
                                                                setDetallesBool(false);
                                                            }}
                                                        > x
                                                        </button>
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                            <CardBody>
                                                <Form onSubmit={detallesBool ? e => {
                                                    e.preventDefault();
                                                    NvoProducto(true);
                                                } : e => {
                                                    e.preventDefault();
                                                    NvoProducto();
                                                }}>
                                                    <h6 className="heading-small text-muted mb-4">
                                                        Información del Producto
                                                    </h6>
                                                    <div className="pl-lg-4">
                                                        <InfoForm
                                                            nombreNvo={nombreNvo}
                                                            setNombreNvo={setNombreNvo}
                                                            descrCortaNvo={descrCortaNvo}
                                                            setDescrCortaNvo={setDescrCortaNvo}
                                                            costo={costo}
                                                            setCosto={setCosto}
                                                            unidad={unidad}
                                                            setUnidad={setUnidad}
                                                            venta={venta}
                                                            setVenta={setVenta}
                                                            codBarra={codBarra}
                                                            setCodBarra={setCodBarra}
                                                            round={round}
                                                            setRound={setRound}
                                                            roundBool={roundBool}
                                                            setRoundBool={setRoundBool}
                                                            ivaCosto={ivaCosto}
                                                            setIvaCosto={setIvaCosto}
                                                            precioVta={precioVta}
                                                            setPrecioVta={setPrecioVta}
                                                            vtaFijaBool={vtaFijaBool}
                                                            setVtaFijaBool={setVtaFijaBool}
                                                        />
                                                        <Row>
                                                            <hr className="my-4" />
                                                            <CategoriasForm
                                                                categoriaNvo={categoriaNvo}
                                                                setCategoriaNvo={setCategoriaNvo}
                                                                plantCat={plantCat}
                                                                setPlantCat={setPlantCat}
                                                                listaCat={listaCat}
                                                                setListaCat={setListaCat}
                                                                idProv={idProv}
                                                                setIdProv={setIdProv}
                                                            />

                                                            <SubCAtegoriasForm
                                                                subCatNvo={subCatNvo}
                                                                setSubCatNvo={setSubCatNvo}
                                                                setPlantSubCat={setPlantSubCat}
                                                                plantSubCat={plantSubCat}
                                                                listaSubCat={listaSubCat}
                                                                setListaSubCat={setListaSubCat}
                                                            />
                                                        </Row>
                                                    </div>

                                                    <hr className="my-4" />

                                                    <h6 className="heading-small text-muted mb-4">
                                                        Imagenes del producto
                                                    </h6>

                                                    <ImagenesForm
                                                        listaImgNvas={listaImgNvas}
                                                        setListaImgNvas={setListaImgNvas}
                                                        plantNvasImg={plantNvasImg}
                                                        setPlantNvasImg={setPlantNvasImg}
                                                        detallesBool={detallesBool}
                                                        listaImgEliminadas={listaImgEliminadas}
                                                        setListaImgEliminadas={setListaImgEliminadas}
                                                        nvaOffer={nvaOffer}
                                                        copiarDet={copiarDet}
                                                        setCopiarDet={setCopiarDet}
                                                    />

                                                    <Row style={{ marginTop: "15px" }}>
                                                        <Col lg="12" style={{ textAlign: "center" }}>
                                                            <FormGroup>
                                                                <button
                                                                    className="btn btn-warning"
                                                                    type="submit"
                                                                >
                                                                    {
                                                                        detallesBool ?
                                                                            "Aplicar Cambios" :
                                                                            "Agregar Nuevo Producto"
                                                                    }
                                                                </button>
                                                            </FormGroup>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                    }
                </Container>
            </>
        )
    }
}

export default Productos;
