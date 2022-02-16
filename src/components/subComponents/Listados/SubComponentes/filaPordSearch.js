import formatMoney from 'Function/NumberFormat';
import React from 'react';

const FilaProdSearch = ({
    id,
    item,
    setProdText,
    prodSearchToggle,
    findProd
}) => {
    const SelectProd = (codBarra) => {
        prodSearchToggle()
        setProdText(codBarra)
        findProd(codBarra)
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
                    onClick={() => SelectProd(item.cod_barra)}
                    className='btn btn-success'>
                    <i className="fas fa-check" ></i>
                </button>
            </td>
        </tr>
    )
}

export default FilaProdSearch