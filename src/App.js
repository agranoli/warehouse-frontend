import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LandingPage from "./Components/Home/LandingPage";
import Login from "./Components/SignUp/Login";
import Register from "./Components/SignUp/Register";
import Available from "./Components/Home/Available";
import Rent from './Components/Home/Rent';
import Categories from "./Components/Home/Categories";
import AddItem from "./Components/Home/AddItem";
import AddEvent from "./Components/Home/AddEvent";
import PlannedEvents from "./Components/Event/PlannedEvents";
import Calendar from "./Components/Event/Calendar";
import ProductDetail from "./Components/Product/ProductDetail";
import EventDetails from "./Components/Event/EventDetails";
import ProtectedRoute from './Components/SignUp/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute element={<LandingPage />} />} />
                <Route path="/Available" element={<ProtectedRoute element={<Available />} />} />
                <Route path="/Rent" element={<ProtectedRoute element={<Rent />} />} />
                <Route path="/Categories" element={<ProtectedRoute element={<Categories />} />} />
                <Route path="/AddItem" element={<ProtectedRoute element={<AddItem />} />} />
                <Route path="/AddEvent" element={<ProtectedRoute element={<AddEvent />} />} />
                <Route path="/PlannedEvent" element={<ProtectedRoute element={<PlannedEvents />} />} />
                <Route path="/Calendar" element={<ProtectedRoute element={<Calendar />} />} />
                <Route path="/product/:id" element={<ProtectedRoute element={<ProductDetail />} />} />
                <Route path="/event/:id" element={<ProtectedRoute element={<EventDetails />} />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </Router>
    );
}

export default App;
