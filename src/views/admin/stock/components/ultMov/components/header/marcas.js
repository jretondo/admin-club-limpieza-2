import UrlNodeServer from '../../../../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'

const MarcasMod = ({
    setMarca,
    setMarcasList,
    marcasList,
    marca,
    colSize
}) => {
    useEffect(() => {
        getMarcas()
        // eslint-disable-next-line
    }, [])

    const getMarcas = async () => {
        await axios.get(UrlNodeServer.productsDir.sub.proveedores, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const ptoVtaData = respuesta.body
                    setMarcasList(
                        ptoVtaData.map((item, key) => {
                            return (
                                <option value={item.subcategory} key={key} >{item.subcategory}</option>
                            )
                        })
                    )
                } else {

                }
            }).catch((error) => { console.log('error :>> ', error); })
    }

    return (
        <Col md={colSize} >
            <Label for="marcasTxtList">Marcas</Label>
            <FormGroup>
                <Input type="select" id="marcasTxtList" onChange={e => setMarca(e.target.value)} value={marca}>
                    {marcasList}
                    <option value={""} key={100} >Todos las marcas</option>
                </Input>
            </FormGroup>
        </Col>
    )
}

export default MarcasMod