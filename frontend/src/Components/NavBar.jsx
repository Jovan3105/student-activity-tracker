import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <Navbar bg="light" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h2>
                    <Link to="/" className="link-dark text-decoration-none">
                        Activity Tracker
                    </Link>
                </h2>
                <span className="text-warning">
                    Logged in as Jovan
                </span>
                <Nav>
                    <Stack direction="horizontal" gap={3}>
                        <Link to="/login" className="link-dark text-decoration-none">
                            Login
                        </Link>
                        <Link to="/register" className="link-dark text-decoration-none">
                            Register
                        </Link>
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;