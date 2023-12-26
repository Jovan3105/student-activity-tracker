import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Main from "./Pages/Main"
import { Container, Navbar } from "react-bootstrap";
import NavBar from "./Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  return (
    <>
    <NavBar></NavBar>
      <Container>
        <Routes>
          <Route path="/" element={<Main></Main>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
        </Routes>
      </Container>
    </>
  )
}

export default App
