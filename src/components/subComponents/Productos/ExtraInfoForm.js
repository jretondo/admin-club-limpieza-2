import React, { useEffect } from 'react'
import {
    Row,
    Col,
    FormGroup,
    Input,
} from "reactstrap"
import ExtraInfoPlantForm from './SubComponentes/ExtraInfo/ExtraInfoPlant'

const ExtraInfoForm = ({
    infoExtraList,
    setInfoExtraList,
    titInfExtraNvo,
    setTitInfExtraNvo,
    descrInfExtraNvo,
    setDescrInfExtraNvo,
    infoExtraPlant,
    setInfoExtraPlant
}) => {

    useEffect(() => {
        PlantillaExtras()
        // eslint-disable-next-line
    }, [infoExtraList.length])

    const handleKeyDownInfoExtra = (e) => {
        const cant1 = parseInt(titInfExtraNvo.length)
        const cant2 = parseInt(descrInfExtraNvo.length)
        if (e.keyCode === 13) {
            e.preventDefault()
            if (cant1 > 0 && cant2 > 0) {
                NvaInfoExtra2()
            }
        }
    }

    const NvaInfoExtra = (e) => {
        e.preventDefault()
        let infoArray = []
        infoArray = infoExtraList
        infoArray.push([titInfExtraNvo, descrInfExtraNvo])
        setTitInfExtraNvo("")
        setDescrInfExtraNvo("")
        document.getElementById("input-infextra").select()
        PlantillaExtras()
    }

    const NvaInfoExtra2 = () => {
        let infoArray = []
        infoArray = infoExtraList
        infoArray.push([titInfExtraNvo, descrInfExtraNvo])
        setInfoExtraList(infoArray)
        console.log('info', infoExtraList)
        setTitInfExtraNvo("")
        setDescrInfExtraNvo("")
        document.getElementById("input-infextra").select()
        PlantillaExtras()
    }

    const PlantillaExtras = () => {
        const cant1 = parseInt(infoExtraList.length)

        if (cant1 > 0) {
            setInfoExtraPlant(
                infoExtraList.map((info, key) => {
                    return (
                        <ExtraInfoPlantForm
                            key={key}
                            id={key}
                            info={info}
                            infoExtraList={infoExtraList}
                            setInfoExtraList={(infoExtraList) => setInfoExtraList(infoExtraList)}
                            PlantillaExtras={PlantillaExtras}
                        />
                    )
                })
            )
        } else {
            setInfoExtraPlant(<></>)
        }
    }

    return (
        <Row>
            <Col lg="12">
                <FormGroup>

                    <label
                        className="form-control-label"
                        htmlFor="input-username"
                    >
                        Información extra
                </label>
                    <Row>
                        <Col md="5" style={{ marginTop: "10px" }}>
                            <Input
                                className="form-control-alternative"
                                id="input-infextra"
                                placeholder="Tipo de información..."
                                type="text"
                                onKeyDown={e => handleKeyDownInfoExtra(e)}
                                value={titInfExtraNvo}
                                onChange={e => setTitInfExtraNvo(e.target.value)}
                            />
                        </Col>
                        <Col md="5" style={{ marginTop: "10px" }}>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Descripción..."
                                type="text"
                                onKeyDown={e => handleKeyDownInfoExtra(e)}
                                value={descrInfExtraNvo}
                                onChange={e => setDescrInfExtraNvo(e.target.value)}
                            />
                        </Col>
                        <Col md="2" style={{ marginTop: "10px" }}>
                            <button
                                className="btn btn-primary"
                                onClick={e => NvaInfoExtra(e)}
                            >
                                Agregar
                    </button>
                        </Col>
                    </Row>
                </FormGroup>
                <FormGroup>
                    <Row style={{ background: "white", borderRadius: "15px", marginLeft: "5px", marginRight: "5px" }}>
                        {infoExtraPlant}
                    </Row>
                </FormGroup>
            </Col>
        </Row>
    )
}

export default ExtraInfoForm