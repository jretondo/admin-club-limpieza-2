import formatMoney from 'Function/NumberFormat';
import React from 'react';

const FilaVentas = ({
    id,
    item
}) => {

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {item.prod_name}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.sub_category}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.category}
            </td>
            <td style={{ textAlign: "center" }}>
                {formatMoney(item.total, 0)}
            </td>
            <td style={{ textAlign: "center" }}>
                $ {formatMoney(item.costoTotal)}
            </td>
        </tr>
    )
}

export default FilaVentas