import React from 'react'
import {
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"

const PlantTagsForm = ({ id, tag, tagsList, setTagsList, setRelistar, relistar }) => {

    const EliminarTag = (e, key) => {
        e.preventDefault()
        let tagsArray = tagsList
        tagsArray.splice(key, 1)
        setTagsList(tagsArray)
        setRelistar(!relistar)
    }

    return (
        <Col md="3" key={id}>
            <button
                className="btn-icon-clipboard"
                id={"tag" + id}
                type="button"
                style={{ height: "60px", padding: "15px" }}
                onClick={e => EliminarTag(e, id)}
            >
                <Row>
                    <Col>
                        <span>{tag}</span>

                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <i className="fas fa-trash-alt"></i>
                    </Col>
                </Row>

            </button>
            <UncontrolledTooltip
                delay={0}
                trigger="hover focus"
                target={"tag" + id}
                placement="right"
            >
                Eliminar Tag
            </UncontrolledTooltip>
        </Col>
    )
}

export default PlantTagsForm