import React, { useState, useEffect } from 'react'
import {
    Col,
    FormGroup,
    Row
} from "reactstrap"
import LONewRowVar from './SubComp/LayoutNewRowVar'
import LORowType from './SubComp/LayoutRowTypeVar'
import LORowVar from './SubComp/LayoutRowVar'
import LORowPlant from './SubComp/LayoutRowVarPlant'
import swal from 'sweetalert'

const VarNvasForm = ({
    tipoVar,
    setTipoVar,
    listaVarNvas,
    setListaVarNvas,
    copiasPlant,
    setCopiasPlant
}) => {
    const [variedadNva, setVariedadNva] = useState("")
    const [stockNvo, setStockNvo] = useState(0)
    const [tipoVarBool, setTipoVarBool] = useState(true)
    const [plantVar, setPlantVar] = useState(<></>)

    useEffect(() => {
        if (parseInt(listaVarNvas.length) > 0) {
            listarNvasVar()
        } else {
            setPlantVar(<></>)
        }
        // eslint-disable-next-line
    }, [listaVarNvas.length])

    useEffect(() => {
        if (listaVarNvas.length) {
            if (listaVarNvas.length > 0) {
                setTipoVarBool(false)
            }
        }
        // eslint-disable-next-line
    }, [listaVarNvas.length])

    const ConfTypeVar = (e) => {
        e.preventDefault()
        setTipoVarBool(false)
    }

    const QuitarType = (e) => {
        e.preventDefault()
        setTipoVarBool(true)
        setVariedadNva("")
        setStockNvo(0)
        swal({
            title: "Cuidado!",
            text: "¿Desea eliminar la lista de variedades cargadas?",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    setListaVarNvas([])
                }
            });
    }

    const deleteRow = (e, id) => {
        e.preventDefault()
        let listado = listaVarNvas
        listado.splice(id, 1)
        setListaVarNvas(listado)
        listarNvasVar()
    }

    const NvaVariedad = (e) => {
        e.preventDefault()
        setCopiasPlant(false)
        let listado = listaVarNvas
        listado.push(variedadNva)
        setListaVarNvas(listado)
        setVariedadNva("")
        setStockNvo(0)
    }

    const acceptPlant = (e, id, stockNvo, variedad) => {
        e.preventDefault()
        let listado = listaVarNvas
        listado.splice(id, 1, variedad)
        setListaVarNvas(listado)
    }

    const listarNvasVar = () => {
        setPlantVar(
            listaVarNvas.map((item, key) => {
                if (copiasPlant) {
                    return (
                        <LORowPlant
                            key={key}
                            variedad={item}
                            stock={0}
                            deleteRow={deleteRow}
                            acceptPlant={acceptPlant}
                            id={key}
                            tipoVar={tipoVar}
                            listaVarNvas={listaVarNvas}
                            setListaVarNvas={setListaVarNvas}
                        />
                    )
                } else {
                    return (
                        <LORowVar
                            key={key}
                            variedad={item}
                            stock={item[1]}
                            deleteRow={deleteRow}
                            id={key}
                            tipoVar={tipoVar}
                        />
                    )
                }
            })
        )
    }

    return (
        <>
            <LORowType
                tipoVarBool={tipoVarBool}
                tipoVar={tipoVar}
                setTipoVar={setTipoVar}
                ConfTypeVar={ConfTypeVar}
                QuitarType={QuitarType}
            />
            {
                !tipoVarBool ?
                    <Row>
                        <Col lg="8">
                            <FormGroup>
                                <label
                                    className="form-control-label"
                                    htmlFor="input-email"
                                >
                                    {tipoVar}
                                </label>
                            </FormGroup>
                        </Col>

                        <Col lg="4" style={{ textAlign: "left" }}>

                        </Col>
                    </Row> :
                    null
            }

            {plantVar}
            {
                !tipoVarBool ?
                    <LONewRowVar
                        variedadNva={variedadNva}
                        setVariedadNva={setVariedadNva}
                        stockNvo={stockNvo}
                        setStockNvo={setStockNvo}
                        NvaVariedad={NvaVariedad}
                        tipoVar={tipoVar}
                    /> :
                    null
            }

        </>
    )
}

export default VarNvasForm