import React from 'react';
import { Card, CardBody } from 'reactstrap';
import HeaderUltMovStock from './components/header';

const UlMovMod = () => {
    return (
        <Card style={{ marginTop: "30px" }}>
            <CardBody>
                <HeaderUltMovStock />
            </CardBody>
        </Card>
    )
}

export default UlMovMod