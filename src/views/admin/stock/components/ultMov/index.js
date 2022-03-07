import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import HeaderUltMovStock from './components/header';
import ListaStockMod from './components/list';

const UlMovMod = () => {
    const [listaStock, setListaStock] = useState([])
    const [pagina, setPagina] = useState(1)
    const [loading, setLoading] = useState(false)

    return (
        <Card style={{ marginTop: "30px" }}>
            <CardBody>
                <HeaderUltMovStock
                    setListaStock={setListaStock}
                    pagina={pagina}
                    setLoading={setLoading}
                />
                <ListaStockMod
                    listaStock={listaStock}
                    pagina={pagina}
                    setPagina={setPagina}
                    loading={loading}
                />
            </CardBody>
        </Card>
    )
}

export default UlMovMod