import { useContext } from "react";
import { Container, Nav, NavDropdown, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const NavBar = () => {

    const { user, logoutUser } = useContext(AuthContext);
    return (
        <Navbar bg="light" className="mb-4" style={{ height: "3.75rem" }}>
            <Container>
                <h5>
                    <Link to="/" className="link-dark text-decoration-none">
                        Activity Tracker
                    </Link>
                </h5>
                {
                    user &&
                    <span className="text-warning">
                        Logged in as {user?.name}
                    </span>
                }
                <Nav>
                    <NavDropdown title="Menu" id="basic-nav-dropdown" drop="start">
                        <Stack direction="vertical" gap={3}>
                            {
                                user ? (
                                    <Stack direction="vertical" gap={4}>
                                        {user?.role === 0 ? <NavDropdown.Item href="/quizes">
                                            Quizes
                                        </NavDropdown.Item> : ""}
                                        {user?.role === 1 ?
                                            <>
                                                <NavDropdown.Item href="/games/join">
                                                    Play
                                                </NavDropdown.Item>
                                                <NavDropdown.Item href="/subscribe">
                                                    Subscribe to a subject
                                                </NavDropdown.Item>
                                            </> : ""}
                                        <NavDropdown.Item href="/login" onClick={logoutUser}>
                                            Logout
                                        </NavDropdown.Item>
                                    </Stack>) :
                                    <>
                                        <NavDropdown.Item href="/login">
                                            Login
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="/register">
                                            Register
                                        </NavDropdown.Item>
                                    </>
                            }
                        </Stack>
                    </NavDropdown>

                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;