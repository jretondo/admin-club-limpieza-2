import React, { useEffect, useState } from 'react'
import Paginacion from '../Listados/ListadoTable'
import FilaProducto from '../Listados/SubComponentes/FilaDetStock'

const titulos = ["Fecha", "Cantidad", "Observación"]

const ListadoStockDet = ({
    itemsFilas
}) => {
    const [plantFilas, setPlantFilas] = useState(<></>)
    useEffect(() => {
        LlenarFilas()
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        LlenarFilas()
        // eslint-disable-next-line
    }, [itemsFilas])

    const LlenarFilas = () => {
        const cantidad = parseInt(itemsFilas.length)
        if (cantidad > 0) {
            setPlantFilas(
                itemsFilas.map((item, key) => {
                    return (
                        <FilaProducto
                            id={key}
                            key={key}
                            item={item}
                        />
                    )
                })
            )
        } else {
            setPlantFilas(
                <tr><td>
                    No hay movimientos de stock
                </td></tr>
            )
        }
    }

    return (
        <>
            <Paginacion
                listado={plantFilas}
                titulos={titulos}
            />
        </>
    )
}

export default ListadoStockDet