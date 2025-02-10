import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Menu from './Pages/Menu/Menu';
import Cart from './Pages/Cart/Cart';
import AdminHome from './Pages/Admin/AdminHome';
import UserOrders from './Pages/Orders/UserOrders';
import Login from './Pages/Login/Login';
import Restaurants from './Pages/Restaurants/Restaurants';
import { RegNoProvider } from './Components/RegNoContext'; 

function App() {
    return (
        <RegNoProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login/>} />
                    <Route path="/Menu" element={<Menu/>} />
                    <Route path="/cart" element={<Cart/>} />
                    <Route path="/AdminHome" element={<AdminHome />} />
                    <Route path="/userOrders" element={<UserOrders/>} />
                    <Route path="/Restaurants" element={<Restaurants/>} />
                </Routes>
            </Router>
        </RegNoProvider>
    );
}

export default App;
