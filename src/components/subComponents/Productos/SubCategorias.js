import React, { useEffect } from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../api/NodeServer'
import {
    Row,
    Col,
    FormGroup,
    Input,

} from "reactstrap"
import PlantSubCategoriasForm from './SubComponentes/Categorias/PlantSubCategorias'

const Categorias = ({
    subCatNvo,
    setSubCatNvo,
    setPlantSubCat,
    plantSubCat,
    listaSubCat,
    setListaSubCat
}) => {

    useEffect(() => {
        LlenarListSubCat()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        PlantSubcategorias()
        // eslint-disable-next-line
    }, [listaSubCat.length, subCatNvo])

    const LlenarListSubCat = async () => {
        await axios.get(UrlNodeServer.productsDir.sub.proveedores, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)

                if (status === 200) {
                    setListaSubCat(respuesta.body)
                }
            })
    }


    const PlantSubcategorias = async () => {
        setPlantSubCat(
            listaSubCat.map((categoria, key) => {
                return (
                    <PlantSubCategoriasForm
                        key={key}
                        id={key}
                        categoria={categoria}
                        subCatNvo={subCatNvo}
                        setSubCatNvo={(subCatNvo) => setSubCatNvo(subCatNvo)}
                    />
                )
            })
        )
    }


    return (
        <>
            <Col lg="6">
                <FormGroup>
                    <label
                        className="form-control-label"
                        htmlFor="input-email"
                    >
                        Marca
                    </label>
                    <Input
                        className="form-control-alternative"
                        id="input-email"
                        placeholder="Marca..."
                        type="text"
                        value={subCatNvo}
                        onChange={e => setSubCatNvo(e.target.value)}
                        style={{ textTransform: "capitalize" }}
                        required
                    />
                </FormGroup>
                <FormGroup>
                    <Row style={{ background: "white", borderRadius: "15px", marginLeft: "5px", marginRight: "5px" }}>
                        {plantSubCat}
                    </Row>
                </FormGroup>
            </Col>

        </>
    )
}

export default Categorias