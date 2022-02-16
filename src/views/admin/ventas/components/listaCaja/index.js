import React, { useState } from 'react';
import { Card, CardBody } from 'reactstrap';
import FooterListVentas from './footer';
import HeaderListaCaja from './header';
import VentasListMod from './lista';

const ListaCajaModule = () => {
    const [listaCaja, setListaCaja] = useState([])
    const [pagina, setPagina] = useState(1)
    const [loading, setLoading] = useState(false)

    return (
        <Card style={{ marginTop: "30px" }}>
            <CardBody>
                <HeaderListaCaja
                    setListaCaja={setListaCaja}
                    pagina={pagina}
                    setLoading={setLoading}
                />
                <VentasListMod
                    listaCaja={listaCaja}
                    pagina={pagina}
                    setPagina={setPagina}
                    loading={loading}
                />
                <FooterListVentas
                    listaCaja={listaCaja}
                />
            </CardBody>
        </Card>
    )
}

export default ListaCajaModule