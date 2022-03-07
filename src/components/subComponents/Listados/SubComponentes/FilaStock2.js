import moment from 'moment';
import React from 'react';

const FilaVentas = ({
    id,
    item
}) => {

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha).format("DD/MM/YYYY")}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.prod_name}
            </td>
            <td style={{ textAlign: "left" }}>
                {item.pv_descr}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.nro_remito}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.sub_category}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.category}
            </td>
            <td style={{ textAlign: "center" }}>
                {item.cant}
            </td>
        </tr>
    )
}

export default FilaVentas