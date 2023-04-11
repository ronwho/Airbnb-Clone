import { React, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";

const Header = () => {
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setAuth(accessToken);
    }
  }, []);
  const links = [
    { title: "Home", to: "/" },
    { title: "My Units", to: "/units" },
    { title: "My Reservations", to: "/reservations" },
    { title: "Notifications", to: "/notification" },
    {
      title: "Profile",
      links: [
        { subTitle: "My Profile", to: "/" },
        { subTitle: "Edit Profile", to: "/edit_profile" },
      ],
    },
    { title: "Sign Out", to: "/logout" },
  ];
  const navLinks = auth ? links : [{ title: "Login", to: "/login" }];
  return (
    <Navbar style={{ backgroundColor: "#3b3535" }} expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Navbar
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-toggle" />
        <Navbar.Collapse id="navbar-toggle">
          <Nav className="ms-auto">
            {navLinks.map(({ title, to, links }, index) =>
              !links ? (
                <Link key={index} to={to} className="nav-link">
                  {title}
                </Link>
              ) : (
                <NavDropdown
                  id="nav-dropdown"
                  title={title}
                  menuVariant="dark"
                  key={index}
                >
                  {links.map(({ subTitle, to }, subIndex) => (
                    <NavDropdown.Item key={subIndex} as={Link} to={to}>
                      {subTitle}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
