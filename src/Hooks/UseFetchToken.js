import { useState, useEffect } from 'react'

export const useToken = (url, call, token, datos) => {
    const [dataT, setData] = useState([])
    const [loadingT, setLoading] = useState(true)
    const [errorT, setError] = useState(null)

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true)
            setData([])
            setError(null)
            try {
                let res
                if (datos) {
                    res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        },
                        body: JSON.stringify(datos),
                    })
                } else {
                    res = await fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-access-token': token
                        }
                    })
                }

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
        if (url) {
            fetchResources()
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [call])

    return { dataT, loadingT, errorT }
}