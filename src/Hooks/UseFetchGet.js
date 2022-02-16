import { useState, useEffect } from 'react'

export const useFetch = (url, call) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true)
            setData([])
            setError(null)
            try {
                let res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
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
        if (url) {
            fetchResources()
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [call])

    return { data, loading, error }
}