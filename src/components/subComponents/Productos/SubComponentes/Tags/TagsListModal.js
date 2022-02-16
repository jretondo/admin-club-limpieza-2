import React from 'react'
import {
    Modal,
    Button
} from "reactstrap";

const TagListModal = ({ setModalListaTags, modalListaTags, plantTags }) => {

    return (
        <Modal
            className="modal-dialog-centered"
            isOpen={modalListaTags}
            toggle={() => setModalListaTags(false)}
        >
            <div className="modal-header">
                <h4 className="modal-title">
                    Listado de tags
            </h4>
                <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setModalListaTags(false)}
                >
                    <span aria-hidden={true}>×</span>
                </button>
            </div>
            <div className="modal-body">
                {plantTags}
            </div>
            <div className="modal-footer">
                <Button
                    color="warning"
                    data-dismiss="modal"
                    type="button"
                    onClick={() => setModalListaTags(false)}
                >
                    Cerrar
            </Button>
            </div>
        </Modal>
    )
}

export default TagListModal