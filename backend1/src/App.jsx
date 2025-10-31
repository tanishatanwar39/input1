import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Header from './compnent/Header'
import Form from './compnent/Form'
import Login from './compnent/Login'
import Account from './compnent/Account'

function App() {
  return (
    <BrowserRouter>
  <Header />
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/form" element={<Form />} />
    {/* <Route path="/account" element={<Account />} /> */}
  </Routes>
</BrowserRouter>

  )
}

export default App
