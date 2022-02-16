import React, { useState, useEffect } from "react";
import { useToken } from '../../Hooks/UseFetchToken'
import UrlNodeServer from '../../api/NodeServer'
import Header from "components/Headers/Header.js";
import {
    Spinner
} from "reactstrap";
import { Redirect } from "react-router-dom";
const Index = () => {
    const [url, setUrl] = useState("")
    const [call, setCall] = useState(false)
    const [cookie, setCookie] = useState("")
    const { dataT, loadingT, errorT } = useToken(
        url,
        call,
        cookie
    )

    useEffect(() => {
        setCookie(localStorage.getItem("loginInfo"))
        setUrl(UrlNodeServer.Veriflog)
        setCall(!call)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (!loadingT) {
            if (!errorT) {
                if (dataT.nombre) {
                    localStorage.setItem("Nombre", dataT.nombre)
                    localStorage.setItem("Apellido", dataT.apellido)
                }
            }
        }
        // eslint-disable-next-line
    }, [loadingT])

    if (loadingT) {
        return (
            <div style={{ textAlign: "center" }}>
                <Spinner type="grow" color="light" /> </div>
        )
    } else if (errorT) {
        return (
            <Redirect
                className="text-light"
                to={process.env.PUBLIC_URL + "/"}
            />
        )
    } else {
        return (
            <>
                <Header />
            </>
        )
    }
}

export default Index;
