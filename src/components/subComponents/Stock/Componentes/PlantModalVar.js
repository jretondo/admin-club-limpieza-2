import React, { useEffect, useState } from 'react'
import {
    Modal,
    Button
} from "reactstrap";

const PlantModalForm = ({ setToggleTipoVar, toggleModalTipoVar, setNvaVar, listaTipoasVar, selectPlant }) => {
    const [plantTiposVar, setPlantTiposVar] = useState(<></>)

    useEffect(() => {
        if (listaTipoasVar.length) {
            if (listaTipoasVar.length > 0) {
                ListaTiposVar()
            }
        }
        // eslint-disable-next-line
    }, [listaTipoasVar.length])

    const cerrar = () => {
        setNvaVar(true)
        setToggleTipoVar(false)
    }

    const ListaTiposVar = () => {
        setPlantTiposVar(
            listaTipoasVar.map((tipos, key) => {
                return (
                    <button
                        key={key}
                        className="btn-icon-clipboard"
                        type="button"
                        style={{ height: "60px", padding: "15px" }}
                        onClick={e => selectPlant(e, tipos.tipo)}
                    >
                        {tipos.tipo}
                    </button>
                )
            })
        )
    }

    return (
        <>
            <Modal
                className="modal-dialog-centered"
                isOpen={toggleModalTipoVar}
                toggle={() => cerrar()}
            >
                <div className="modal-header">
                    <h4 className="modal-title">
                        Lista de Tipos de Variedades
                    </h4>
                    <button
                        aria-label="Close"
                        className="close"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => cerrar()}
                    >
                        <span aria-hidden={true}>×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {plantTiposVar}
                </div>
                <div className="modal-footer">
                    <Button
                        color="primary"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => setToggleTipoVar(false)}
                    >
                        Nueva Variedad
                    </Button>
                    <Button
                        color="warning"
                        data-dismiss="modal"
                        type="button"
                        onClick={() => cerrar()}
                    >
                        Cerrar
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default PlantModalForm