import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
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
                    <Stack direction="horizontal" gap={3}>
                        {
                            user ? (
                                <Stack direction="horizontal" gap={4}>
                                    {user?.role === 0 ? <Link to="/quizes" className="link-dark text-decoration-none">
                                        Quizes
                                    </Link> : ""}
                                    {user?.role === 1 ?
                                        <>
                                            <Link to="/games/join" className="link-dark text-decoration-none">
                                                Play
                                            </Link>
                                            <Link to="/subscribe" className="link-dark text-decoration-none">
                                                Subscribe to a subject
                                            </Link>
                                        </> : ""}
                                    <Link to="/login" onClick={logoutUser} className="link-dark text-decoration-none">
                                        Logout
                                    </Link>
                                </Stack>) :
                                <>
                                    <Link to="/login" className="link-dark text-decoration-none">
                                        Login
                                    </Link>
                                    <Link to="/register" className="link-dark text-decoration-none">
                                        Register
                                    </Link>
                                </>
                        }
                    </Stack>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;