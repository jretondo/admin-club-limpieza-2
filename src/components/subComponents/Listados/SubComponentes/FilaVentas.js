import CompleteCerosLeft from '../../../../Function/CompleteCeroLeft';
import formatMoney from 'Function/NumberFormat';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { BsFileEarmarkPdfFill, BsTelegram, BsFillXCircleFill } from "react-icons/bs";

const FilaVentas = ({
    id,
    item
}) => {

    const [comprobante, setComprobante] = useState({
        pv: "00000",
        cbte: "00000000"
    })

    const completarCeros = async () => {
        const pvStr = await CompleteCerosLeft(item.pv, 5)
        const cbteStr = await CompleteCerosLeft(item.cbte, 8)

        setComprobante({
            pv: pvStr,
            cbte: cbteStr
        })
    }

    useEffect(() => {
        completarCeros()
        // eslint-disable-next-line
    }, [])

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha).format("DD/MM/YYYY")}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.raz_soc_cliente === "" ? "Consumidor Final" : item.raz_soc_cliente} {parseInt(item.tipo_doc_cliente) === 80 ? "(CUIT: " + item.n_doc_cliente + ")" : parseInt(item.tipo_doc_cliente) === 96 ? "(DNI: " + item.n_doc_cliente + ")" : ""}
            </td>
            <td>
                {item.letra} {comprobante.pv} - {comprobante.cbte}
            </td>
            <td style={{ textAlign: "center" }}>
                {parseInt(item.forma_pago) === 0 ? "Efectivo" :
                    parseInt(item.forma_pago) === 1 ? "Mercado Pago" :
                        parseInt(item.forma_pago) === 2 ? "Débito" :
                            parseInt(item.forma_pago) === 3 ? "Crédito" :
                                parseInt(item.forma_pago) === 4 ? "Cuenta Corriente" :
                                    "Transferencia"
                }
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.total_fact)}
            </td>
            <td className="text-right">
                <UncontrolledDropdown>
                    <DropdownToggle
                        className="btn-icon-only text-light"
                        href="#pablo"
                        role="button"
                        size="sm"
                        color=""
                        onClick={e => e.preventDefault()}
                    >
                        <i className="fas fa-ellipsis-v" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow" right>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => e.preventDefault(e)}
                        >
                            <BsFileEarmarkPdfFill />
                            Ver Factura
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => e.preventDefault(e)}
                        >
                            <BsTelegram />
                            Envíar Factura
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => e.preventDefault(e)}
                        >
                            <BsFillXCircleFill />
                            Cancelar Factura
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaVentas