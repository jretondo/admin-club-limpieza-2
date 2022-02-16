import React from 'react'
import {
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"

const ExtraInfoPlantForm = ({ id, info, infoExtraList, setInfoExtraList, PlantillaExtras }) => {

    const EliminarInfo = (e, key) => {
        e.preventDefault()
        let infoArray = infoExtraList
        infoArray.splice(key, 1)
        setInfoExtraList(infoArray)
        PlantillaExtras()
    }

    return (
        <Col md="12" key={id}>
            <button
                className="btn-icon-clipboard"
                id={"info" + id}
                type="button"
                style={{ height: "60px", padding: "15px" }}
                onClick={e => EliminarInfo(e, id)}
            >
                <Row>
                    <Col>
                        <span style={{ fontWeight: "bold" }}>{info[0] + ":"}</span><span>{" " + info[1]}</span>

                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <i className="fas fa-trash-alt"></i>
                    </Col>
                </Row>

            </button>
            <UncontrolledTooltip
                delay={0}
                trigger="hover focus"
                target={"info" + id}
                placement="top"
            >
                Eliminar información
            </UncontrolledTooltip>
        </Col>
    )
}

export default ExtraInfoPlantForm