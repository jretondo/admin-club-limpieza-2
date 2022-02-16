import formatMoney from 'Function/NumberFormat';
import React, { useContext } from 'react';
import productSellContext from '../../../../context/productsSell';

const FilaProdSell = ({
    id,
    item
}) => {

    const { RemoveProduct } = useContext(productSellContext)

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.cant_prod}
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.vta_price / (1 + (item.iva / 100)))}
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.vta_price / (1 + (item.iva / 100)) * item.cant_prod)}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.iva}%
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.vta_price * item.cant_prod)}
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