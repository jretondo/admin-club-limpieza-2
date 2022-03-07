import React, { useState, useEffect } from 'react'
import axios from 'axios'
import UrlNodeServer from '../../../../api/NodeServer'
import {
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    DropdownToggle,
    Media,
    // Badge
} from "reactstrap"
import swal from 'sweetalert'
import formatMoney from 'Function/NumberFormat'
import ModalNewStock from './ModalNewStock'
import ModalMoverStock from './ModalMoverStock'
import Button from 'reactstrap/lib/Button'
import ModalChangeCodBarras from './ModalChangeCod'

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
    setCopiarDet,
    primero,
    pagina,
    setPagina,
    setNvaOffer
}) => {
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [modal3, setModal3] = useState(false)

    const [compraBool, setCompraBool] = useState(false)
    const [newCompra, setNewCompra] = useState(item.precio_compra)

    const EliminarOff = async (e, id, name, primero, pagina) => {
        e.preventDefault()
        swal({
            title: "Eliminar " + name + "!",
            text: "¿Está seguro de eliminar este producto? Esta desición es permanente.",
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
                    await axios.delete(`${UrlNodeServer.productsDir.products}/${id}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                        }
                    })
                        .then(res => {
                            setEsperar(false)
                            const status = parseInt(res.data.status)
                            if (status === 200) {
                                if (primero) {
                                    if (pagina > 1) {
                                        setPagina(parseInt(pagina - 1))
                                    }
                                }
                                setActividadStr("El usuario ha eliminado el producto '" + name + "'")
                                setNvaActCall(!nvaActCall)
                                setMsgStrong("Producto eliminado con éxito!")
                                setMsgGralAlert("")
                                setSuccessAlert(true)
                                setAlertar(!alertar)
                                setCall(!call)
                            } else {
                                setMsgStrong("Hubo un error! ")
                                setMsgGralAlert("No se pudo eliminar el producto.")
                                setSuccessAlert(false)
                                setAlertar(!alertar)
                            }
                        })
                        .catch(() => {
                            setEsperar(false)
                            setMsgStrong("Hubo un error! ")
                            setMsgGralAlert("No se pudo eliminar el producto.")
                            setSuccessAlert(false)
                            setAlertar(!alertar)
                        })
                }
            });
    }

    const copiarDetalle = (e, id) => {
        e.preventDefault()
        setNvaOffer(true)
        setIdDetalle(id)
        setCopiarDet(true)
    }

    const VerDetalles = (e, id) => {
        e.preventDefault()
        setIdDetalle(id)
        setDetallesBool(true)
    }

    const NuevoStock = (e) => {
        e.preventDefault()
        setModal(true)
    }

    const MoverStock = (e) => {
        e.preventDefault()
        setModal2(true)
    }

    const asignarCodModal = (e) => {
        e.preventDefault()
        setModal3(true)
    }

    const actChangePrice = () => {
        setCompraBool(true)
        setTimeout(() => {
            document.getElementById("inpNewCostTxt").focus()
            document.getElementById("inpNewCostTxt").select()
        }, 300);
    }

    const changeNewCompra = (e) => {
        if (e.keyCode === 13) {
            updatePriceCompra()
        } else if (e.keyCode === 27) {
            setCompraBool(false)
        }
    }

    const updatePriceCompra = async () => {
        const data = {
            cost: newCompra
        }
        await axios.put(`${UrlNodeServer.productsDir.sub.cost}/${item.id_prod}`, data, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token')
            }
        }).then(res => {
            const respuesta = res.data
            const status = respuesta.status
            if (status === 200) {
                const data = respuesta.body
                if (data.affectedRows > 0) {
                    swal("Actualizar Precio de Compra", "Precio modificado con éxito", "success");
                } else {
                    swal("Actualizar Precio de Compra", "Hubo un error inesperado!", "error");
                }
            } else {
                swal("Actualizar Precio de Compra", "Hubo un error inesperado!", "error");
            }
        }).catch((error) => {
            swal("Actualizar Precio de Compra", "Hubo un error inesperado! => " + error, "error");
        }).finally(() => {
            setTimeout(() => {
                setCompraBool(false)
                setCall(!call)
            }, 1500);
        })
    }

    useEffect(() => {
        if (compraBool) {
            setTimeout(() => {
                document.getElementById("inpNewCostTxt").addEventListener("blur", () => {
                    setCompraBool(false)
                })
                return () => document.getElementById("inpNewCostTxt").removeEventListener()
            }, 300);
        }

    }, [compraBool])

    return (
        <>
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
                                <span style={{ fontSize: "17px" }}  > {item.name}</span><br />
                                <span style={{ fontSize: "11px" }} >
                                    <Button
                                        color="primary"
                                        onClick={asignarCodModal}
                                        style={{
                                            fontSize: "12px",
                                            padding: "5px",
                                            paddingTop: 0,
                                            paddingBottom: 0,
                                            borderRadius: "50%",
                                            marginRight: "5px"
                                        }}
                                    >+</Button>
                                    (Cód.: {item.cod_barra})
                                </span>
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
                <td style={{ textAlign: "center" }} onDoubleClick={() => actChangePrice()} >
                    {
                        compraBool ?
                            <input id="inpNewCostTxt" value={newCompra} onChange={e => setNewCompra(e.target.value)} onKeyDown={e => changeNewCompra(e)} /> :
                            "$" + formatMoney(item.precio_compra)
                    }

                </td>
                <td style={{ textAlign: "center" }}>
                    $ {formatMoney((item.precio_compra * ((item.iva / 100) + 1)))}
                </td>
                <td style={{ textAlign: "center" }}>
                    {"$ " + formatMoney(item.vta_price) + " (" + item.porc_minor}%)
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
                                onClick={e => NuevoStock(e)}
                            >
                                <i className="fas fa-plus"></i>
                                Agregar Stock
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => MoverStock(e)}
                            >
                                <i className="fas fa-arrow-right"></i>
                                Mover Stock
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => VerDetalles(e, item.id_prod)}
                            >
                                <i className="fas fa-search"></i>
                                Ver detalles
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => EliminarOff(e, item.id_prod, item.name, primero, pagina)}
                            >
                                <i className="fas fa-trash-alt"></i>
                                Eliminar
                            </DropdownItem>
                            <DropdownItem
                                href="#pablo"
                                onClick={e => copiarDetalle(e, item.id_prod)}
                            >
                                <i className="fas fa-copy"></i>
                                Copiar Producto
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </td>
            </tr>
            <ModalNewStock
                modal={modal}
                setModal={setModal}
                item={item}
                setActividadStr={setActividadStr}
                nvaActCall={nvaActCall}
                setNvaActCall={setNvaActCall}
                alertar={alertar}
                setAlertar={setAlertar}
                setMsgStrong={setMsgStrong}
                setMsgGralAlert={setMsgGralAlert}
                setSuccessAlert={setSuccessAlert}
                setCall={setCall}
                call={call}
            />
            <ModalMoverStock
                modal={modal2}
                setModal={setModal2}
                item={item}
                setActividadStr={setActividadStr}
                nvaActCall={nvaActCall}
                setNvaActCall={setNvaActCall}
                alertar={alertar}
                setAlertar={setAlertar}
                setMsgStrong={setMsgStrong}
                setMsgGralAlert={setMsgGralAlert}
                setSuccessAlert={setSuccessAlert}
                setCall={setCall}
                call={call}
            />
            <ModalChangeCodBarras
                setModal={setModal3}
                modal={modal3}
                item={item}
                setCall={setCall}
                call={call}
            />
        </>
    )
}

export default FilaProducto