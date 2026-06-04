import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'  
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const CLIENT_ID = "927518574788-ilrhe0nsd5o0rop5g3vtn21asicd5b7p.apps.googleusercontent.com"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={CLIENT_ID}> 
      <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)