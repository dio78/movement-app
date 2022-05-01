import { Outlet, Link } from "react-router-dom";
import { Navbar, Container, Nav  } from "react-bootstrap";

export default function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
        <Navbar.Brand href="#home">MOVEMENT</Navbar.Brand>
        <Nav className="me-auto">
          <Link className="nav-link" to="/library">Library</Link> |{" "}
          <Link className="nav-link"to="/create">Create</Link> |{" "}
          <Link className="nav-link" to="/skeleton">Skeleton</Link> |{" "}
          <Link className="nav-link" to="/upload">Upload</Link> |{" "}
        </Nav>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}