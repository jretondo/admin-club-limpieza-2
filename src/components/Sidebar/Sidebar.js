import React from "react";
import { NavLink as NavLinkRRD, Link } from "react-router-dom";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
import { Redirect } from "react-router-dom";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col
} from "reactstrap";
import Img1 from 'assets/img/theme/default-avatar.png';
import Brand2 from 'assets/img/brand/logo.png';
import axios from "axios";
import UrlNodeServer from "../../api/NodeServer";

class Sidebar extends React.Component {
  state = {
    collapseOpen: false,
    salir: false
  };
  constructor(props) {
    super(props);
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  // toggles collapse between opened and closed (true/false)
  toggleCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };
  // closes the collapse
  closeCollapse = () => {
    this.setState({
      collapseOpen: false
    });
  };
  // creates the links that appear in the left menu / Sidebar
  createLinks = async (routes) => {
    await axios.get(UrlNodeServer.permissionsDir.permissions, {
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('user-token') }
    })
      .then(res => {
        this.setState({
          data: (
            routes.map((prop, key) => {
              const id = prop.id

              function check(item) {
                return item.id_permission === id;
              }

              const esta = res.data.body.find(check)
              if (prop.id === 0) {
                return (
                  <NavItem key={key}>
                    <NavLink
                      to={prop.layout + prop.path}
                      tag={NavLinkRRD}
                      onClick={this.closeCollapse}
                      activeClassName="active"
                      style={{ color: "#0081c9", fontWeight: "bold" }}
                    >
                      <i className={prop.icon} />
                      {prop.name}
                    </NavLink>
                  </NavItem>
                );
              } else {
                if (esta) {
                  return (
                    <NavItem key={key}>
                      <NavLink
                        to={prop.layout + prop.path}
                        tag={NavLinkRRD}
                        onClick={this.closeCollapse}
                        activeClassName="active"
                        style={{ color: "#0081c9", fontWeight: "bold" }}
                      >
                        <i className={prop.icon} />
                        {prop.name}
                      </NavLink>
                    </NavItem>
                  );
                } else {
                  return null
                }
              }
            }))
        })
      })
      .catch(() => {
        this.setState({
          salir: true
        })
      })
  };

  componentDidMount() {
    this.createLinks(this.props.routes)
  }

  componentWillUnmount() {
    this.createLinks(this.props.routes)
  }

  render() {
    const { logo } = this.props;
    let navbarBrandProps;
    if (logo && logo.innerLink) {
      navbarBrandProps = {
        to: logo.innerLink,
        tag: Link
      };
    } else if (logo && logo.outterLink) {
      navbarBrandProps = {
        href: logo.outterLink,
        target: "_blank"
      };
    }

    const SalirBtn = (e) => {
      e.preventDefault()
      this.setState({
        salir: true
      })
    }

    if (this.state.salir) {
      return (
        <Redirect
          className="text-light"
          to="/cbabaitcast/"
        />
      )
    } else {
      return (
        <Navbar
          className="navbar-vertical fixed-left navbar-dark bg-ligth"
          expand="md"
          id="sidenav-main"
        >
          <Container fluid>
            {/* Toggler */}
            <button
              className="navbar-toggler"
              type="button"
              style={{ background: "#0081c9" }}
              onClick={this.toggleCollapse}
            >
              <span className="navbar-toggler-icon" />
            </button>
            {/* Brand */}
            {logo ? (
              <NavbarBrand className="pt-0" {...navbarBrandProps}>
                <img alt="..." src={Brand2} style={{ width: "100px", height: "70px" }} />
              </NavbarBrand>
            ) : null}
            {/* User */}
            <Nav className="align-items-center d-md-none">
              <UncontrolledDropdown nav>
                <DropdownToggle nav>
                  <Media className="align-items-center">
                    <span className="avatar avatar-sm rounded-circle">
                      <img
                        alt="..."
                        src={Img1}
                      />
                    </span>
                  </Media>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow" right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Bienvenido!</h6>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-single-02" />
                    <span>Mi perfil</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-calendar-grid-58" />
                    <span>Actividad</span>
                  </DropdownItem>
                  <DropdownItem to="/admin/user-profile" tag={Link}>
                    <i className="ni ni-support-16" />
                    <span>Soporte</span>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="#pablo" onClick={e => SalirBtn(e)}>
                    <i className="ni ni-user-run" />
                    <span>Salir</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
            {/* Collapse */}
            <Collapse navbar isOpen={this.state.collapseOpen}>
              {/* Collapse header */}
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  {logo ? (
                    <Col className="collapse-brand" xs="6">
                      {logo.innerLink ? (
                        <Link to={logo.innerLink}>
                          <img alt={logo.imgAlt} src={Brand2} />
                        </Link>
                      ) : (
                        <a href={logo.outterLink}>
                          <img alt={logo.imgAlt} src={Brand2} />
                        </a>
                      )}
                    </Col>
                  ) : null}
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      type="button"
                      style={{ color: "black" }}
                      onClick={this.toggleCollapse}
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              {/* Navigation */}
              <Nav navbar>{this.state.data}</Nav>
              {/* Divider */}
              <hr className="my-3" />
            </Collapse>
          </Container>
        </Navbar>
      );
    }

  }
}

Sidebar.defaultProps = {
  routes: [{}]
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired
  })
};

export default Sidebar;
