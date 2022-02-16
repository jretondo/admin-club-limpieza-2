import React from 'react'
import {
    Spinner,
    Progress
} from "reactstrap"

const ProgressBarForm1 = ({ progressImg, titulo }) => {

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <Spinner type="grow" color="primary" style={{ width: "100px", height: "100px" }} />
            <div className="progress-wrapper" style={{ marginTop: "30px" }}>
                <div className="progress-info">
                    <div className="progress-label">
                        <span>{titulo}</span>
                    </div>
                    <div className="progress-percentage">
                        <span>{progressImg}%</span>
                    </div>
                </div>
                <Progress max="100" value={progressImg} />
            </div>
        </div>
    )

}

export default ProgressBarForm1