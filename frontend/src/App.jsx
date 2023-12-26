import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Main from "./Pages/Main"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Main></Main>}></Route>
        <Route path="/register" element={<Register></Register>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="*" element={<Navigate to="/"></Navigate>}></Route>
      </Routes>
    </>
  )
}

export default App
