import React from 'react'
import {
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"

const PlantModalTagsForm = ({ id, tags, presente, tagsList, setTagsList, setRelistar, relistar }) => {

    const SelectTagList = (e, tag) => {
        e.preventDefault()
        let tagsArray = []
        tagsArray = tagsList
        tagsArray.push(tag)
        setTagsList(tagsArray)
        setRelistar(!relistar)
    }

    return (
        <Col md="12" key={id}>
            <button
                className="btn-icon-clipboard"
                id={"tagList" + id}
                type="button"
                style={presente !== tags.tag ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                onClick={presente !== tags.tag ? e => SelectTagList(e, tags.tag) : e => e.preventDefault()}
            >
                <Row>
                    <Col>
                        <span style={presente !== tags.tag ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{tags.tag}</span>

                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <i style={presente !== tags.tag ? { transition: "0.6s ease" } : { transition: "0.6s ease", color: "white" }} className="fas fa-copy"></i>
                    </Col>
                </Row>

            </button>
            <UncontrolledTooltip
                delay={0}
                trigger="hover focus"
                target={"tagList" + id}
                placement="top"
            >
                {
                    presente !== tags.tag ?
                        "Copiar tag" :
                        "Tag copiado"
                }

            </UncontrolledTooltip>
        </Col>
    )
}

export default PlantModalTagsForm