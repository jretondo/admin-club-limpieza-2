import ListadoTable from 'components/subComponents/Listados/ListadoTable';
import FilaVentas from 'components/subComponents/Listados/SubComponentes/FilaVentas';
import Paginacion from 'components/subComponents/Paginacion/Paginacion';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import FilaEspera from './FilaEspera';

const titulos = ["Fecha", "Cliente", "Factura", "Forma de Pago", "Importe", ""]

const VentasListMod = ({
    listaCaja,
    pagina,
    setPagina,
    loading
}) => {
    const [call, setCall] = useState(false)
    const [plantPaginas, setPlantPaginas] = useState(<></>)
    const [ultimaPag, setUltimaPag] = useState(1)
    const [dataState, setDataState] = useState({})
    const [listadoVentas, setListadoVentas] = useState(<tr><td></td><td>No hay ventas con los filtros colocados</td></tr>)

    useEffect(() => {
        console.log('listaCaja.data :>> ', listaCaja.data);
        try {
            const data = listaCaja.data
            const pagesObj = listaCaja.pagesObj
            if (data.length > 0) {
                setDataState(pagesObj)
                setUltimaPag(pagesObj.totalPag)
                setListadoVentas(
                    // eslint-disable-next-line
                    data.map((item, key) => {
                        return (
                            <FilaVentas
                                key={key}
                                id={key}
                                item={item}
                            />
                        )
                    })
                )
            } else {
                setListadoVentas(
                    <tr><td></td><td>No hay ventas con los filtros colocados</td></tr>
                )
            }
        } catch (error) {
            setListadoVentas(
                <tr><td></td><td>No hay ventas con los filtros colocados</td></tr>
            )
        }
    }, [listaCaja])

    return (
        <>
            <Row>
                <Col>
                    {
                        loading ?
                            <ListadoTable
                                titulos={titulos}
                                listado={<FilaEspera />}
                            /> :
                            <ListadoTable
                                titulos={titulos}
                                listado={listadoVentas}
                            />
                    }
                </Col>
            </Row>
            <Row style={{ marginTop: "20px" }}>
                <Col>
                    {
                        loading ? null :
                            <Paginacion
                                setPagina={setPagina}
                                setCall={setCall}
                                pagina={pagina}
                                call={call}
                                plantPaginas={plantPaginas}
                                ultimaPag={ultimaPag}
                                data={dataState}
                                setPlantPaginas={setPlantPaginas}
                                setUltimaPag={setUltimaPag}
                            />
                    }
                </Col>
            </Row>
        </>
    )
}

export default VentasListMod