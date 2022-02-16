import React, { useState } from 'react'
import {
    Col,
    FormGroup,
    Row,
    Input
} from "reactstrap";
const LayoutRowVar = ({ variedad, stock, id, tipoVar, setNvoStockArray, nvoStockArray, idVar }) => {
    const [valorStock, setValorStock] = useState(stock)

    const CambiaArray = (e, idArray, idVariedad, variedadNom) => {
        e.preventDefault()
        setValorStock(e.target.value)
        const listado = nvoStockArray
        listado.splice(idArray, 1, { "idVar": idVariedad, "cant": e.target.value, "variedad": variedadNom })
        setNvoStockArray(listado)
    }
    return (
        <>
            <Row key={id}>
                <Col lg="8">
                    <FormGroup>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder={tipoVar + "..."}
                            type="text"
                            value={variedad}
                            disabled
                        />
                    </FormGroup>
                </Col>
                <Col lg="4">
                    <FormGroup>
                        <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="Variedad..."
                            type="number"
                            value={valorStock}
                            onChange={e => CambiaArray(e, id, idVar, variedad)}
                            required
                        />
                    </FormGroup>
                </Col>
            </Row>
        </>
    )
}

export default LayoutRowVar