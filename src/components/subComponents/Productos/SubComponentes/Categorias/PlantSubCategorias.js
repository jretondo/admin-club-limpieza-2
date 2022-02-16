import React from 'react'
import {
    Row,
    Col,
    UncontrolledTooltip,
} from "reactstrap"

const PlantSubCategorias = ({ id, categoria, subCatNvo, setSubCatNvo }) => {

    const SelectSubCategoria = (e, subCategoria) => {
        e.preventDefault()
        setSubCatNvo(subCategoria)
    }

    return (
        <Col md="6" key={id}>
            <button
                className="btn-icon-clipboard"
                id={"Subcat" + id}
                type="button"
                style={subCatNvo !== categoria.subcategory ? { padding: "15px", transition: "0.6s ease" } : { padding: "15px", transition: "0.6s ease", background: "#db2929" }}
                onClick={e => SelectSubCategoria(e, categoria.subcategory)}
            >
                <Row>
                    <Col>
                        <span style={subCatNvo !== categoria.subcategory ? { fontWeight: "bold", transition: "0.6s ease" } : { fontWeight: "bold", transition: "0.6s ease", color: "white" }}>{categoria.subcategory}</span>

                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <i style={subCatNvo !== categoria.subcategory ? { transition: "0.6s ease" } : { transition: "0.6s ease", color: "white" }} className="fas fa-copy"></i>
                    </Col>
                </Row>

            </button>
            <UncontrolledTooltip
                delay={0}
                trigger="hover focus"
                target={"Subcat" + id}
                placement="top"
            >
                {
                    subCatNvo !== categoria.subcategory ?
                        "Copiar subcategoria" :
                        "Subcategoria copiada"
                }
            </UncontrolledTooltip>
        </Col>
    )
}

export default PlantSubCategorias