import UrlNodeServer from '../../../../api/NodeServer'
import React from 'react'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media
} from "reactstrap"

const FilaProducto = ({
    id,
    item,
    setDetallesBool,
    setIdDetalle,
    setNvoStockBool,
    setNombreNvo
}) => {

    const VerStock = (e, id, nombre) => {
        e.preventDefault()
        setIdDetalle(id)
        setDetallesBool(true)
        setNombreNvo(nombre)
    }

    const NvoStock = (e, id, nombre) => {
        e.preventDefault()
        setIdDetalle(id)
        setNvoStockBool(true)
        setNombreNvo(nombre)
    }

    return (
        <tr key={id}>
            <th scope="row">
                <Media className="align-items-center">
                    <Media>
                        <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={e => e.preventDefault()}
                        >
                            <img
                                alt="..."
                                src={UrlNodeServer.publicFolder.prodImages + item.url_img}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </a>
                        <span className="mb-0 text-sm" style={{ marginLeft: "10px" }}>
                            {item.name}
                        </span>
                    </Media>
                </Media>
            </th>
            <td style={{ textAlign: "center" }}>
                {item.category}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.subcategory}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.precio_compra}
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
                            onClick={e => VerStock(e, item.id_prod, item.name)}
                        >
                            <i className="fas fa-search"></i>
                            Ver stock
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => NvoStock(e, item.id_prod, item.name)}
                        >
                            <i className="fas fa-box"></i>
                            Cargar Stock
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaProducto