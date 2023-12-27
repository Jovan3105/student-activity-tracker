import { Alert, Button, Col, Row, Stack, Form } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

const Login = () => {

    const { loginUser, loginError, loginInfo, updateLoginInfo, isLoginLoading } = useContext(AuthContext);
    return (
        <>
            <Form onSubmit={loginUser}>
                <Row style={{ justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>
                                Login
                            </h2>
                            <Form.Control type="email" placeholder="Email" onChange={(e) => updateLoginInfo({ ...loginInfo, email: e.target.value })} />
                            <Form.Control type="password" placeholder="Password" onChange={(e) => updateLoginInfo({ ...loginInfo, password: e.target.value })} />
                            <Button variant="primary" type="submit">
                                {isLoginLoading ? "Logging you in..." : "Login"}
                            </Button>
                            {
                                loginError?.error && <Alert variant="danger" className="text-center">
                                    <p>
                                        {loginError.message}
                                    </p>
                                </Alert>
                            }
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Login;