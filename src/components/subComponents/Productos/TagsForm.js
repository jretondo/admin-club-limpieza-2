import React, { useEffect } from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../api/NodeServer'
import {
    Row,
    Col,
    FormGroup,
    Input,
} from "reactstrap";
import TagsListModal from './SubComponentes/Tags/TagsListModal'
import PlantTagsForm from './SubComponentes/Tags/PlantTagsForm'
import PlantModalTagsForm from './SubComponentes/Tags/PlantModalTags'

const TagsForm = ({
    tagNvo,
    setTagNvo,
    setModalListaTags,
    modalListaTags,
    tagsPlant,
    setTagsPlant,
    tagsList,
    setTagsList,
    plantTags,
    setPlantTags,
    listadoTags,
    setListadoTags,
    relistar,
    setRelistar
}) => {

    useEffect(() => {
        ListarTags()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        PlantillaModalTags()
        PlantillaTags()
        // eslint-disable-next-line
    }, [listadoTags, tagsList.length])

    useEffect(() => {
        PlantillaModalTags()
        PlantillaTags()
        // eslint-disable-next-line
    }, [relistar])

    const PlantillaTags = () => {
        const cantidad = tagsList.length
        if (cantidad > 0) {
            setTagsPlant(
                tagsList.map((tag, key) => {

                    return (
                        <PlantTagsForm
                            key={key}
                            id={key}
                            tag={tag}
                            tagsList={tagsList}
                            setTagsList={setTagsList}
                            setRelistar={setRelistar}
                            relistar={relistar}
                        />
                    )
                })
            )
            PlantillaModalTags()
        } else {
            setTagsPlant(<></>)
            PlantillaModalTags()
        }
    }

    const NvoTag = (e) => {
        e.preventDefault()
        if (tagNvo !== "") {
            let tagsArray = []
            tagsArray = tagsList
            tagsArray.push(tagNvo)
            setTagsList(tagsArray)
            setRelistar(!relistar)
            setTagNvo("")
        }
    }

    const AbrirModalTags = (e) => {
        e.preventDefault()
        setModalListaTags(true)
    }

    const ListarTags = async () => {
        await axios.get(UrlNodeServer.GetTagList)
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)

                if (status === 200) {
                    setListadoTags(respuesta.result)
                }
            })
    }

    const PlantillaModalTags = () => {
        setPlantTags(
            listadoTags.map((tags, key) => {
                var found = tagsList.find(function (element) {
                    return element === tags.tag
                })

                const presente = found

                return (
                    <PlantModalTagsForm
                        key={key}
                        id={key}
                        tags={tags}
                        presente={presente}
                        tagsList={tagsList}
                        setTagsList={setTagsList}
                        setRelistar={(relistar) => setRelistar(relistar)}
                        relistar={relistar}
                    />
                )
            })
        )
    }

    return (
        <Row>
            <Col lg="12">
                <FormGroup>

                    <label
                        className="form-control-label"
                        htmlFor="input-username"
                    >
                        Tags
                    </label>
                    <Row>
                        <Col md="9" style={{ marginTop: "20px" }}>
                            <Input
                                className="form-control-alternative"
                                id="input-username"
                                placeholder="Tag..."
                                type="text"
                                value={tagNvo}
                                onChange={e => setTagNvo(e.target.value)}
                            />
                        </Col>
                        <Col md="3" style={{ marginTop: "20px" }}>
                            <Row>

                                <button
                                    className="btn btn-primary"
                                    onClick={e => NvoTag(e)}
                                >
                                    Agregar
                                </button>

                                <button
                                    className="btn btn-primary"
                                    onClick={e => AbrirModalTags(e)}
                                >
                                    Listado
                                </button>

                            </Row>
                        </Col>
                    </Row>
                    <TagsListModal
                        setModalListaTags={(modalListaTags) => setModalListaTags(modalListaTags)}
                        modalListaTags={modalListaTags}
                        plantTags={plantTags}
                    />
                </FormGroup>
                <FormGroup>
                    <Row style={{ background: "white", borderRadius: "15px", marginLeft: "5px", marginRight: "5px" }}>
                        {tagsPlant}
                    </Row>
                </FormGroup>
            </Col>
        </Row>
    )
}

export default TagsForm