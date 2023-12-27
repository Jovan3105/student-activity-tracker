import { Alert, Button, Col, Row, Stack, Form } from "react-bootstrap";

const Login = () => {
    return (
        <>
            <Form>
                <Row style={{ justifyContent: "center", paddingTop: "10%" }}>
                    <Col xs={6}>
                        <Stack gap={3}>
                            <h2>
                                Login
                            </h2>
                            <Form.Control type="email" placeholder="Email"></Form.Control>
                            <Form.Control type="password" placeholder="Password"></Form.Control>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                            <Alert variant="danger" className="text-center">
                                <p>
                                    An error occurred.
                                </p>
                            </Alert>
                        </Stack>
                    </Col>
                </Row>
            </Form>
        </>
    );
}

export default Login;