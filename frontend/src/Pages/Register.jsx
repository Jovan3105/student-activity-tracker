import { useContext, useState } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
    const [isRegister, setIsRegister] = useState(true);
    const [isConfirm, setIsConfirm] = useState(false);

    const handleClick = (e) => {
        registerUser(e);
        setIsRegister(prev => !prev);
        setIsConfirm(prev => !prev);
    }
    const handleSubmit = () => {
        console.log("works")
    }


    const { registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading } = useContext(AuthContext);
    return (
        <>
            {
                isRegister &&
                <Form onSubmit={(e) => handleClick(e)}>
                    <Row style={{ justifyContent: "center", paddingTop: "10%" }}>
                        <Col xs={6}>
                            <Stack gap={3}>
                                <h2>
                                    Register
                                </h2>
                                <Form.Control type="text" placeholder="IMI Username"
                                    onChange={
                                        (e) => updateRegisterInfo({ ...registerInfo, name: e.target.value })
                                    }>
                                </Form.Control>
                                <Form.Control type="email" placeholder="IMI Email"
                                    onChange={
                                        (e) => updateRegisterInfo({ ...registerInfo, email: e.target.value })
                                    }>
                                </Form.Control>
                                <Form.Control type="password" placeholder="Password"
                                    onChange={
                                        (e) => updateRegisterInfo({ ...registerInfo, password: e.target.value })
                                    }>
                                </Form.Control>
                                <Link onClick={() => { setIsRegister(false); setIsConfirm(prev => !prev); }}
                                    style={{ maxWidth: "max-content", fontSize: "80%", alignSelf: "end" }}>
                                    Forgot to confirm?
                                </Link>
                                <Button variant="primary" type="submit">
                                    {isRegisterLoading ? "Creating your account" : "Register"}
                                </Button>
                                {
                                    registerError?.error && <Alert variant="danger" className="text-center">
                                        <p>
                                            {
                                                registerError?.message
                                            }
                                        </p>
                                    </Alert>
                                }

                            </Stack>
                        </Col>
                    </Row>
                </Form>
            }
            {
                isConfirm &&
                <Form onSubmit={() => { console.log("submit") }}>
                    <Row style={{ justifyContent: "center", paddingTop: "10%" }}>
                        <Col xs={6}>
                            <Stack gap={3}>
                                <h2>
                                    Register
                                </h2>
                                <Form.Control type="number" placeholder="6 Digit Code">
                                </Form.Control>
                                <Button variant="primary" type="submit">
                                    Confirm
                                </Button>
                            </Stack>
                        </Col>
                    </Row>
                </Form>
            }
        </>
    );
}

export default Register;