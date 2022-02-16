import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import FilaProdSell from 'components/subComponents/Listados/SubComponentes/FilaProdSell';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import productsSellContext from '../../../../../../context/productsSell';

const titulos = ["Producto", "Cant.", "$/un.", "$ s/IVA", "%IVA", "$ Final", ""]

const ProdListSell = () => {
    const [listProdVenta, setListProdVenta] = useState(<tr><td>No hay productos cargados aún</td></tr>)

    const { productsSellList, setTotalPrecio } = useContext(productsSellContext)

    useEffect(() => {
        let lista = []
        lista = productsSellList
        if (lista.length > 0) {
            let total = 0
            setListProdVenta(
                lista.map((item, key) => {
                    total = total + (item.vta_price * item.cant_prod)
                    if (key === lista.length - 1) {
                        setTotalPrecio(total)
                    }
                    return (
                        <FilaProdSell
                            key={key}
                            id={key}
                            item={item}
                        />
                    )
                })
            )
        } else {
            setTotalPrecio(0)
            setListProdVenta(<tr><td>No hay productos cargados aún</td></tr>)
        }
        // eslint-disable-next-line
    }, [productsSellList])

    return (
        <Row style={{ marginTop: "30px" }}>
            <Col md="12" >
                <ListadoTable
                    listado={listProdVenta}
                    titulos={titulos}
                />
            </Col>
        </Row>
    )
}

export default ProdListSell