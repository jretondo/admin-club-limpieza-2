import React, { useEffect } from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
} from "reactstrap"
import PlantImgFomr from './SubComponentes/Imagenes/PlantImg'
var unavez = true
const ImagenesForm = ({
    listaImgNvas,
    setListaImgNvas,
    plantNvasImg,
    setPlantNvasImg,
    detallesBool,
    listaImgEliminadas,
    setListaImgEliminadas,
    nvaOffer,
    copiarDet
}) => {

    const handdlePaste = (e) => {

        var items = e.clipboardData.items;
        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].type.indexOf("image") === 0) {
                    if (unavez) {
                        unavez = false
                        // eslint-disable-next-line
                        setTimeout(() => {
                            // eslint-disable-next-line
                            unavez = true
                        }, 1500);
                        var blob = items[i].getAsFile();
                        var img = new Image();
                        var URLObj = window.URL || window.webkitURL;
                        img.src = URLObj.createObjectURL(blob);
                        let listaImg = listaImgNvas
                        listaImg.push([img.src, 0])
                        setListaImgNvas(listaImg)
                        PlantillaNvasImg()
                        break
                    }
                };
            }
        }
    }

    useEffect(() => {
        if (nvaOffer) {
            if (!copiarDet) {
                setListaImgNvas([])
            }
        }
        if (detallesBool) {
            if (listaImgNvas.length !== 0) {
                window.addEventListener("paste", handdlePaste);
                return () => {
                    window.removeEventListener("paste", handdlePaste);
                }
            }
        } else {
            window.addEventListener("paste", handdlePaste);
            return () => {
                window.removeEventListener("paste", handdlePaste);
            }
        }
        // eslint-disable-next-line
    }, [nvaOffer])

    useEffect(() => {
        PlantillaNvasImg()
        // eslint-disable-next-line
    }, [listaImgNvas.length])

    const AddNvaImg = (e) => {
        const urlNvaImg = URL.createObjectURL(e.target.files[0])
        let listaImg = listaImgNvas
        listaImg.push([urlNvaImg, 0])
        setListaImgNvas(listaImg)
        document.getElementById("imgNvaAltNva").value = ""
        PlantillaNvasImg()
    }

    const PlantillaNvasImg = async () => {
        const cantidad = parseInt(listaImgNvas.length)
        if (cantidad > 0) {

            await setPlantNvasImg(
                // eslint-disable-next-line
                listaImgNvas.map((urlimg, key) => {
                    if (urlimg[0] !== "product.png") {
                        return (
                            <PlantImgFomr
                                key={key}
                                id={key}
                                idImg={urlimg[1]}
                                urlimg={urlimg[0]}
                                listaImgNvas={listaImgNvas}
                                setListaImgNvas={setListaImgNvas}
                                PlantillaNvasImg={PlantillaNvasImg}
                                detallesBool={detallesBool}
                                listaImgEliminadas={listaImgEliminadas}
                                setListaImgEliminadas={setListaImgEliminadas}
                            />
                        )
                    }
                })
            )
        } else {
            setPlantNvasImg(<></>)
        }
    }

    return (
        <>
            <Col lg="12" style={{ textAlign: "center" }}>
                <FormGroup>

                    <Input
                        className="form-control-alternative"
                        id="imgNvaAltNva"
                        type="file"
                        accept=".jpg"
                        onChange={e => AddNvaImg(e)}
                    />
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                    <Row style={{ borderRadius: "15px" }}>
                        <span>Presione <span style={{ color: "red" }}>'Ctrl' + v </span>para pegar una imagen</span>
                    </Row>
                </FormGroup>
            </Col>
            <Col md="12">
                <FormGroup>
                    <Row style={{ background: "white", borderRadius: "15px" }}>
                        {plantNvasImg}
                    </Row>
                </FormGroup>
            </Col>
        </>
    )
}

export default ImagenesForm