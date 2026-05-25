import formatMoney from 'Function/NumberFormat';
import React, { useContext, useState } from 'react';
import productSellContext from '../../../../context/productsSell';

const FilaProdSell = ({
    id,
    item
}) => {
    const [updateDiscount, setUpdateDiscount] = useState(false)
    const [newDiscount, setNewDiscount] = useState(item.descuento_porcentaje || 0)

    const { RemoveProduct, aplicarDescuento } = useContext(productSellContext)

    const actChangeDiscount = () => {
        setUpdateDiscount(true)
        setTimeout(() => {
            const input = document.getElementById(`inpDiscountText-${item.key}`)
            if (input) {
                input.focus()
                input.select()
            }
        }, 300)
    }

    const saveDiscount = () => {
        const discount = parseFloat(newDiscount)
        if (isNaN(discount)) {
            aplicarDescuento(item.key, 0)
            setNewDiscount(0)
            setUpdateDiscount(false)
            return
        }
        if (discount < 0 || discount > 100) {
            setUpdateDiscount(false)
            setNewDiscount(item.descuento_porcentaje || 0)
            return
        }
        aplicarDescuento(item.key, discount)
        setUpdateDiscount(false)
    }

    const descuentoPorcentaje = parseFloat(item.descuento_porcentaje) || 0
    const precioConDescuento = item.vta_price * (1 - (descuentoPorcentaje / 100))

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.cant_prod}
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(precioConDescuento)}
            </td>
            <td style={{ textAlign: "center" }} onDoubleClick={() => actChangeDiscount()}>
                {updateDiscount ? (
                    <input
                        type="number"
                        min={0}
                        max={100}
                        id={`inpDiscountText-${item.key}`}
                        value={newDiscount}
                        onChange={e => setNewDiscount(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                saveDiscount()
                            }
                            if (e.key === 'Escape') {
                                setNewDiscount(item.descuento_porcentaje || 0)
                                setUpdateDiscount(false)
                            }
                        }}
                        onBlur={() => saveDiscount()}
                    />
                ) : (
                    descuentoPorcentaje
                )}
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(precioConDescuento / (1 + (item.iva / 100)) * item.cant_prod)}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.iva}%
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(precioConDescuento * item.cant_prod)}
            </td>
            <td className="text-right">
                <button
                    onClick={() => RemoveProduct(item.key)}
                    className='btn btn-danger' style={{ round: "50%" }}>
                    X
                </button>
            </td>
        </tr>
    )
}

export default FilaProdSell
