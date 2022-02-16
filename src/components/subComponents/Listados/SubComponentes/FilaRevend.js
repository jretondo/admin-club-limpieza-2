import React from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../api/NodeServer'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle
} from "reactstrap"
import swal from 'sweetalert'

const FilaProducto = ({
    id,
    item,
    setActividadStr,
    nvaActCall,
    setNvaActCall,
    alertar,
    setAlertar,
    setMsgStrong,
    setMsgGralAlert,
    setSuccessAlert,
    setCall,
    call,
    setEsperar,
    setDetallesBool,
    setIdDetalle,
    primero,
    pagina,
    setPagina
}) => {

    const EliminarOff = async (e, id, name, primero, pagina) => {
        e.preventDefault()
        swal({
            title: "Eliminar el revendedor " + name + "!",
            text: "¿Está seguro de eliminar este revendedor? Esta desición es permanente.",
            icon: "warning",
            buttons: {
                cancel: "No",
                Si: true
            },
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    setEsperar(true)
                    await axios.delete(`${UrlNodeServer.revendedoresDir.revendedores}/${id}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                        }
                    })
                        .then(res => {
                            const status = parseInt(res.data.status)
                            if (status === 200) {
                                if (primero) {
                                    if (pagina > 1) {
                                        setPagina(parseInt(pagina - 1))
                                    }
                                }
                                setActividadStr("El usuario ha eliminado el revendedor '" + name + "'")
                                setNvaActCall(!nvaActCall)
                                setMsgStrong("Revendedor eliminado con éxito!")
                                setMsgGralAlert("")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                                setCall(!call)
                                setEsperar(false)
                            } else {
                                setEsperar(false)
                                setMsgStrong("Hubo un error!")
                                setMsgGralAlert(" Intente nuevamente.")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        })
                }
            });
    }

    const VerDetalles = (e, id) => {
        e.preventDefault()
        setIdDetalle(id)
        setDetallesBool(true)
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.nombre + " " + item.apellido}
            </td>
            <td style={{ textAlign: "center" }}>
                {"DNI " + item.ndoc}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.telefono}
            </td>
            <td style={{ textAlign: "center" }}>
                <a href={`mailto:${item.email}`}> {item.email}</a>
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
                            onClick={e => VerDetalles(e, item.id)}
                        >
                            <i className="fas fa-search"></i>
                            Ver detalles
                        </DropdownItem>
                        <DropdownItem
                            href="#pablo"
                            onClick={e => EliminarOff(e, item.id, item.nombre + " " + item.apellido, primero, pagina)}
                        >
                            <i className="fas fa-trash-alt"></i>
                            Eliminar
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </td>
        </tr>
    )
}

export default FilaProducto