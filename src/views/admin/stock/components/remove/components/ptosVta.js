import UrlNodeServer from '../../../../../../api/NodeServer'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Col, FormGroup, Input, Label } from 'reactstrap'

const PtosVtas = ({
    setPtoVta,
    setPtoVtaList,
    ptoVtaList,
    ptoVta,
    colSize,
    loading
}) => {
    useEffect(() => {
        getPv()
        // eslint-disable-next-line
    }, [])

    const getPv = async () => {
        await axios.get(UrlNodeServer.ptosVtaDir.sub.userPv, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        })
            .then(res => {
                const respuesta = res.data
                const status = parseInt(respuesta.status)
                if (status === 200) {
                    const ptoVtaData = respuesta.body.data
                    setPtoVtaList(
                        ptoVtaData.map((item, key) => {
                            if (key === 0) {
                                setPtoVta(item)
                            }
                            return (
                                <option value={JSON.stringify(item)} key={key} >{`(P.V.: ${item.pv}) ${item.direccion}`}</option>
                            )
                        })
                    )
                } else {

                }
            }).catch((error) => { console.log('error :>> ', error); })
    }

    return (
        <Col md={colSize} >
            <Label for="ptoVtaTxt">Punto de Venta</Label>
            <FormGroup>
                <Input className={loading ? "shimmer3" : ""} disabled={loading} type="select" id="ptoVtaTxt" onChange={e => setPtoVta(JSON.parse(e.target.value))} value={JSON.stringify(ptoVta)}>
                    {ptoVtaList}
                    <option value={JSON.stringify({ id: -1 })} key={99} >Deposito</option>
                </Input>
            </FormGroup>
        </Col>
    )
}

export default PtosVtas