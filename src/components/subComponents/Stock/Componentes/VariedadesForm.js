import React, { useState, useEffect } from 'react'
import {
    Col,
    FormGroup
} from "reactstrap";
import ModalTiposVar from './PlantModalVar'
import VarNvasForm from './VarNvasForm'
import axios from 'axios'
import NodeServer from '../../../../../../Globals/NodeServer'

const VariedadesForm = ({
    setVariedadesBool,
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
        ObtenerTiposVar()
        // eslint-disable-next-line
    }, [])

    const ObtenerTiposVar = async () => {
        await axios.get(NodeServer.TiposVariedades)
            .then(res => {
                const resultado = res.data
                setListaTipoasVar(resultado.result)
            })
    }

    const selectPlant = async (e, tipo) => {
        e.preventDefault()
        setTipoVar(tipo)
        const datos = {
            tipoVar: tipo
        }
        await axios.post(NodeServer.Variedades, datos)
            .then(async res => {
                const resultado = res.data

                if (resultado.result.length) {
                    if (resultado.result.length > 0) {
                        setToggleTipoVar(false)
                        setCopiasPlant(true)
                        let listado = []
                        // eslint-disable-next-line
                        await resultado.result.map(variedad => {
                            listado.push([variedad.variedad, 0])
                        })
                        setListaVarNvas(listado)
                    }
                }
                console.log('resultado.result', resultado.result)
            })
    }

    const volver = (e) => {
        e.preventDefault()
        setVariedadesBool(false)
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
                        onClick={e => volver(e)}
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