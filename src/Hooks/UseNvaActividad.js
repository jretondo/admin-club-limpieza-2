import { useState, useEffect } from 'react'
import UrlNodeServer from '../api/NodeServer'

export const useActividad = (call, actividad) => {
    const [data2, setData] = useState([])
    const [loading2, setLoading] = useState(true)
    const [error2, setError] = useState(null)

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true)
            setData([])
            setError(null)
            let token
            try {
                token = localStorage.getItem("loginInfo")
            } catch (error) {
                token = ""
            }

            const datos = {
                actividad
            }

            try {
                let res = await fetch(UrlNodeServer.NvaActividad, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': token
                    },
                    body: JSON.stringify(datos),
                })
                let data = await res.json()
                const status = parseInt(data.status)
                if (status === 200) {
                    setData(data.result)
                    setLoading(false)
                } else {
                    setError(data.error)
                    setLoading(false)
                }
            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        if (actividad) {
            fetchResources()
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [call])

    return { data2, loading2, error2 }
}