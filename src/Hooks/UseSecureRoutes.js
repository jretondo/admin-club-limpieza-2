import { useState, useEffect } from 'react'

export const UseSecureRoutes = (url, call) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchResources = async () => {
            try {
                let res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                    },
                })
                let data = await res.json()
                const status = parseInt(data.status)
                if (status === 200) {
                    setLoading(false)
                } else {
                    setError("No permitido")
                    setLoading(false)
                }
            } catch (error) {
                setError("No permitido")
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
    return { loading, error }
}