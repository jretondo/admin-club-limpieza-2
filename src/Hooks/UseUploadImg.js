import { useState, useEffect } from 'react'

export const useFetchImgUp = (link, imagen, name, call) => {
    const [dataImg, setDataImg] = useState([])
    const [loadingImg, setLoadingImg] = useState(true)
    const [errorImg, setErrorImg] = useState(null)

    useEffect(() => {
        const fetchResources = async () => {
            setLoadingImg(true)
            setDataImg([])
            setErrorImg(null)
            try {
                fetch(imagen)
                    .then(res => res.blob())
                    .then(blob => {
                        const filemini = new File([blob], name, {
                            type: 'image/jpeg'
                        });
                        //  console.log('head', formData.getHeaders())
                        var formData = new FormData();
                        formData.append("file", filemini);
                        console.log('fd', formData)

                        // Example POST method implementation:
                        async function postData(url = '', data = {}) {
                            // Default options are marked with *
                            const response = await fetch(url, {
                                method: 'POST',
                                body: data
                            });
                            return response;
                        }
                        postData(link, formData)
                            .then(data => {
                                console.log('data', data)
                            });

                    });

            } catch (error) {
                setError(error)
                setLoading(false)
            }
        }
        if (link) {
            fetchResources()
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line
    }, [call])

    return { dataImg, loadingImg, errorImg }
}