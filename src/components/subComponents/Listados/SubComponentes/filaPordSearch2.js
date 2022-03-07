import formatMoney from 'Function/NumberFormat';
import React from 'react';

const FilaProdSearch2 = ({
    id,
    item,
    setProdText,
    setProdId,
    prodSearchToggle
}) => {

    const SelectProd = (name, id) => {
        prodSearchToggle()
        setProdText(name)
        setProdId(id)
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.category}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.subcategory}
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.vta_price)}
            </td>
            <td className="text-right">
                <button
                    onClick={() => SelectProd(item.name, item.id_prod)}
                    className='btn btn-success'>
                    <i className="fas fa-check" ></i>
                </button>
            </td>
        </tr>
    )
}

export default FilaProdSearch2