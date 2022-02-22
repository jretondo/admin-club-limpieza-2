/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import moment from "moment";
import React from "react";

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

class Footer extends React.Component {
  render() {
    return (
      <footer className="footer" style={{ backgroundColor: "#f8f9fe" }}>
        <Row className="align-items-center justify-content-xl-between">
          <Col xl="6">
            <div className="copyright text-center text-xl-left text-muted">
              © {moment(new Date()).format("YYYY")}{" "}
              <a
                className="font-weight-bold ml-1"
                href="https://www.nekonet.com.ar"
                rel="noopener noreferrer"
                target="_blank"
              >
                NekoNET
              </a>
            </div>
          </Col>

        </Row>
      </footer>
    );
  }
}

export default Footer;
