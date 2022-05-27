import React, { useState } from 'react'
import { Button, Spinner } from 'reactstrap'
import moment from 'moment';
import formatMoney from 'Function/NumberFormat';
import axios from 'axios';
import UrlNodeServer from 'api/NodeServer';
import swal from 'sweetalert';
import FileSaver from 'file-saver';

const FilaCtaCte = ({
    id,
    item
}) => {
    const [wait, setWait] = useState(false)
    const getFact = async (idFact, importe) => {
        let query = ""
        let urlGet = UrlNodeServer.invoicesDir.sub.factDataPDF
        if (importe > 0) {
            urlGet = UrlNodeServer.clientesDir.sub.payments
        }
        setWait(true)
        await axios.get(urlGet + "/" + idFact + query, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                Accept: 'application/pdf',
            }
        })
            .then(res => {
                let headerLine = res.headers['content-disposition'];
                const largo = parseInt(headerLine.length)
                let filename = headerLine.substring(21, largo);
                var blob = new Blob([res.data], { type: "application/pdf" });
                FileSaver.saveAs(blob, filename);
                swal("Reimpresión de factura", "Factura reimpresa con éxito!", "success");
            })
            .catch(error => {
                console.error(error);
                swal("Reimpresión de factura", "Hubo un error al querer reimprimir la factura!", "error");
            }).finally(() => {
                setWait(false)
            })
    }

    return (
        <tr key={id}>
            <td style={{ textAlign: "center" }}>
                {moment(item.fecha).format("DD/MM/YYYY HH:MM")} Hs
            </td>
            <td style={{ textAlign: "center" }}>
                {item.detalle}
            </td>
            <td style={{ textAlign: "center" }}>
                {
                    wait ?
                        <Spinner color={"danger"} />
                        :
                        <Button onClick={e => {
                            e.preventDefault()
                            getFact(item.id_factura, parseFloat(item.importe))
                        }} color={"danger"}>
                            Ver
                        </Button>
                }
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