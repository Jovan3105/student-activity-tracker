import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from './Context/AuthContext.jsx';
import { SocketProvider } from './Context/SocketContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SocketProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
