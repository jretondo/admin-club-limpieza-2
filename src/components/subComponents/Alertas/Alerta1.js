import React, { useState, useEffect } from 'react'
import {
    Alert
} from "reactstrap"

const Alert1 = ({
    success,
    msgStrong,
    msgGral,
    alertar
}) => {
    const [alertToggle, setAlertToggle] = useState("none")

    useEffect(() => {
        MostrarAlerta()
        // eslint-disable-next-line
    }, [alertar])

    const MostrarAlerta = () => {
        if (msgStrong !== "") {
            setAlertToggle("")
            setTimeout(() => {
                setAlertToggle("none")
            }, 5000)
        }
    }

    return (
        <Alert color={success ? "success" : "danger"} style={{ transition: "0.6s ease", position: "fixed", right: 0, left: 0, top: 0, margin: "auto", marginTop: "30px", zIndex: "99999", textAlign: "center", display: `${alertToggle}` }} >
            <strong>{msgStrong}</strong> {msgGral}
        </Alert>
    )
}

export default Alert1