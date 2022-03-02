import UrlNodeServer from '../../../../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'

const ProveedoresMod = ({
    setProveedor,
    setProveedoresList,
    proveedoresList,
    proveedor,
    colSize
}) => {
    useEffect(() => {
        getProv()
        // eslint-disable-next-line
    }, [])

    const getProv = async () => {
        await axios.get(UrlNodeServer.productsDir.sub.marcas, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const ptoVtaData = respuesta.body
                    setProveedoresList(
                        ptoVtaData.map((item, key) => {
                            return (
                                <option value={item.category} key={key} >{item.category}</option>
                            )
                        })
                    )
                } else {

                }
            }).catch((error) => { console.log('error :>> ', error); })
    }

    return (
        <Col md={colSize} >
            <Label for="marcasTxtList">Proveedores</Label>
            <FormGroup>
                <Input type="select" id="marcasTxtList" onChange={e => setProveedor(e.target.value)} value={proveedor}>
                    {proveedoresList}
                    <option value={""} key={100} >Todos las marcas</option>
                </Input>
            </FormGroup>
        </Col>
    )
}

export default ProveedoresMod