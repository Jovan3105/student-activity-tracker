import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Main from "./Pages/Main"
import { Container, Navbar } from "react-bootstrap";
import NavBar from "./Components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import Quizes from "./Pages/Quizes/Quizes";
import CreateQuiz from "./Pages/CreateQuiz/CreateQuiz";
import Host from "./Pages/Game/Host";
import Join from "./Pages/Game/Join";

function App() {

  const { user } = useContext(AuthContext);

  return (
    <>
      <NavBar></NavBar>
      <Container>
        <Routes>
          <Route path="/" element={user ? (user?.role === 0 ? <Quizes></Quizes> : <Join></Join>) : <Login></Login>}></Route>
          <Route path="/register" element={user ? (user?.role === 0 ? <Quizes></Quizes> : <Join></Join>) : <Register></Register>}></Route>
          <Route path="/login" element={user ? (user?.role === 0 ? <Quizes></Quizes> : <Join></Join>) : <Login></Login>}></Route>
          <Route path="/quizes" element={user ? (user?.role === 0 ? <Quizes></Quizes> : <Join></Join>) : <Login></Login>}></Route>
          <Route path="/quizes/:id" element={user?.role === 0 ? <CreateQuiz></CreateQuiz> : <Join></Join>}></Route>
          <Route path="/games/host/:id" element={user?.role === 0 ? <Host></Host> : <Join></Join>}></Route>
          <Route path="/games/join" element={user?.role === 1 ? <Join></Join> : <Navigate to="/"></Navigate>}></Route>
          <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
        </Routes>
      </Container>
    </>
  )
}

export default App
