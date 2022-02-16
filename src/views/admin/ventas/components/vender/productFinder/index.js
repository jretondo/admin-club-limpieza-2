import React, { useEffect, useState, useContext } from 'react';
import {
    Button,
    Col,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Row
} from 'reactstrap';
import useSound from 'use-sound';
import beepSfx from '../../../../../../assets/sounds/beep.mp3';
import Scanner from "components/scanner";
import productsSellContext from '../../../../../../context/productsSell';
import Form from 'reactstrap/lib/Form';
import isMobile from 'is-mobile';
import ModalSearch from './modalSearch';

const ProductFinder = () => {
    const [result, setResult] = useState(null);
    const [prodText, setProdText] = useState("")
    const [cantProd, setCantProd] = useState(1)
    const [camera, setCamera] = useState(false);
    const [prodSearchModal, setProdSearchModal] = useState(false)

    const { NewProdSell, productsSellList, error } = useContext(productsSellContext)

    const [play] = useSound(beepSfx);

    const findProd = (textFind) => {
        play()
        NewProdSell(textFind, cantProd)
    }

    const onDetected = results => {
        setResult(results);
    };

    const prodSearchToggle = () => {
        setProdSearchModal(!prodSearchModal)
    }

    useEffect(() => {
        play()
        if (result !== null) {
            NewProdSell(prodText, cantProd)
        }
        setCamera(false)
        // eslint-disable-next-line 
    }, [result])

    useEffect(() => {
        if (!prodSearchModal) {
            setTimeout(() => {
                document.getElementById("prodTxtFinder").select()
            }, 600);
        }
    }, [prodSearchModal])

    useEffect(() => {
        document.getElementById("prodTxtFinder").select()
    }, [productsSellList])

    useEffect(() => {
        if (error) {
            document.getElementById("prodTxtFinder").select()
        }
    }, [error])
    return (
        <>
            <Form onSubmit={e => {
                e.preventDefault()
                findProd(prodText)
            }}>
                <Row>
                    <Col md="3">
                        <Label for="cantTxt">Cant.</Label>
                        <FormGroup>
                            <Input type="number" id="cantTxt" value={cantProd} onChange={e => setCantProd(e.target.value)} required />
                        </FormGroup>
                    </Col>
                    <Col md="9" >
                        <Label for="prodTxtFinder">Producto</Label>
                        <InputGroup>
                            <Input
                                type="text"
                                id="prodTxtFinder"
                                value={prodText}
                                onChange={e => setProdText(e.target.value)}
                                required
                            />
                            < InputGroupAddon addonType="append">
                                {
                                    isMobile() ?
                                        <Button color="warning" onClick={(e) => {
                                            e.preventDefault();
                                            setCamera(true);
                                        }}><i className="fas fa-camera"></i></Button> : null
                                }

                                <Button className="btn btn-info" onClick={prodSearchToggle} >
                                    <i className="fas fa-search" ></i>
                                </Button>
                                <Button className="btn btn-success" type="submit" >
                                    <i className="fas fa-check" ></i>
                                </Button>
                            </InputGroupAddon>
                        </ InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col style={camera ? { border: "2px solid red" } : { display: "none" }} >
                        <button className="btn btn-danger" style={{ position: "absolute", top: 0, right: 0, zIndex: 100 }} onClick={(e) => {
                            e.preventDefault();
                            setCamera(false);
                        }} >X</button>
                        {camera && <Scanner onDetected={onDetected} />}
                    </Col>
                </Row>
            </Form>
            <ModalSearch
                prodSearchModal={prodSearchModal}
                prodSearchToggle={prodSearchToggle}
                setProdText={setProdText}
                findProd={findProd}
            />
        </>
    )
}

export default ProductFinder