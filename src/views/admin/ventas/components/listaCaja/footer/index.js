import React, { useEffect, useState } from 'react';
import { Row } from 'reactstrap';
import TotalItemsVtas from './totalItem';

const FooterListVentas = ({
    listaCaja
}) => {
    const [totalesPlant, setTotalesPlant] = useState(<></>)

    useEffect(() => {
        try {
            const totales = listaCaja.totales

            if (totales.length > 0) {
                setTotalesPlant(
                    // eslint-disable-next-line
                    totales.map((item, key) => {
                        return (

                            <TotalItemsVtas
                                key={key}
                                id={key}
                                totalId={item.forma_pago}
                                totalImporte={item.SUMA}
                                colSize={4}
                            />
                        )
                    })
                )
            } else {
                setTotalesPlant(
                    <TotalItemsVtas
                        totalId={null}
                        totalImporte={0}
                        colSize={6}
                    />
                )
            }
        } catch (error) {
            setTotalesPlant(
                <TotalItemsVtas
                    totalId={null}
                    totalImporte={0}
                    colSize={6}
                />
            )
        }
    }, [listaCaja])

    return (
        <Row>
            {totalesPlant}
        </Row>
    )
}

export default FooterListVentas