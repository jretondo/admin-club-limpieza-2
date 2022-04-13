import React from 'react'
import { Button } from 'reactstrap'
import moment from 'moment';
import formatMoney from 'Function/NumberFormat';

const FilaCtaCte = ({
    id,
    item
}) => {

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha).format("DD/MM/YYYY HH:MM")} Hs
            </td>
            <td style={{ textAlign: "center" }}>
                {item.detalle}
            </td>
            <td style={{ textAlign: "center" }}>
                <Button color={"danger"}>
                    Ver
                </Button>
            </td>
            <td style={{ textAlign: "right" }}>
                <span style={parseFloat(item.importe) > 0 ? { marginRight: "20px", fontSize: "16px", color: "green", fontWeight: "bold" } : { marginRight: "20px", fontSize: "16px", color: "red", fontWeight: "bold" }}>
                    $ {formatMoney(item.importe)}
                </span>
            </td>
        </tr>
    )
}

export default FilaCtaCte