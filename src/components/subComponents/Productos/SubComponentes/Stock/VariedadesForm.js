import React, { useState, useEffect } from 'react'
import {
    Col,
    FormGroup
} from "reactstrap";
import ModalTiposVar from './PlantModalVar'
import VarNvasForm from './VarNvasForm'
import axios from 'axios'
import UrlNodeServer from '../../../../../api/NodeServer';

const VariedadesForm = ({
    setVariedadesBool,
    variedadesBool,
    tipoVar,
    setTipoVar,
    listaVarNvas,
    setListaVarNvas
}) => {
    const [toggleModalTipoVar, setToggleTipoVar] = useState(false)
    const [nvaVar, setNvaVar] = useState(true)
    const [listaTipoasVar, setListaTipoasVar] = useState([])
    const [copiasPlant, setCopiasPlant] = useState(false)

    useEffect(() => {
        if (listaVarNvas.length) {
            if (listaVarNvas.length > 0) {
                setNvaVar(false)
            }
        }
        // eslint-disable-next-line
    }, [listaVarNvas.length])

    useEffect(() => {
        listaTipos()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!variedadesBool) {
            setListaTipoasVar([])
            setTipoVar("")
        }
        // eslint-disable-next-line
    }, [variedadesBool])

    const listaTipos = async () => {
        await axios.get(UrlNodeServer.productsDir.sub.tipos, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    setListaTipoasVar(respuesta.body)
                } else {
                    setListaTipoasVar([])
                }
            })
            .catch(() => {
                setListaTipoasVar([])
            })
    }

    const selectPlant = async (e, tipo) => {
        e.preventDefault()
        setTipoVar(tipo)
        await axios.get(`${UrlNodeServer.productsDir.sub.variedades}/${tipo}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                setToggleTipoVar(false)
                setCopiasPlant(true)
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    let variedades = []
                    // eslint-disable-next-line
                    respuesta.body.map((item, key) => {
                        variedades.push(item.variedad)
                        if (key === respuesta.body.length - 1) {
                            setListaVarNvas(variedades)
                        }
                    })
                } else {
                    setListaVarNvas([])
                }
            })
            .catch(() => {
                setListaVarNvas([])
            })
    }

    const AddVar = (e) => {
        e.preventDefault()
        setNvaVar(false)
        setToggleTipoVar(true)
    }

    return (
        <>
            <Col lg="8" style={{ textAlign: "center" }}>
                {nvaVar ?
                    <button
                        className="btn btn-primary"
                        onClick={e => AddVar(e)}
                        style={{ marginTop: "30px" }}
                    >
                        Nueva Variedad
                    </button> :
                    <VarNvasForm
                        tipoVar={tipoVar}
                        setTipoVar={setTipoVar}
                        listaVarNvas={listaVarNvas}
                        setListaVarNvas={setListaVarNvas}
                        copiasPlant={copiasPlant}
                        setCopiasPlant={setCopiasPlant}
                    />}
            </Col>
            <Col lg="4" style={{ textAlign: "center" }}>
                <FormGroup>
                    <button
                        className="btn btn-primary"
                        onClick={e => {
                            e.preventDefault();
                            setVariedadesBool(false);
                        }}
                        style={{ marginTop: "30px" }}
                    >
                        Salir de Variedades
                    </button>
                </FormGroup>
            </Col>
            <ModalTiposVar
                toggleModalTipoVar={toggleModalTipoVar}
                setToggleTipoVar={setToggleTipoVar}
                setNvaVar={setNvaVar}
                listaTipoasVar={listaTipoasVar}
                selectPlant={selectPlant}
            />
        </>
    )

}

export default VariedadesForm