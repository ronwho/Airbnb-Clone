import React from 'react';
import { Route, Routes } from "react-router-dom";
import Index from "./pages/Index.js";
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx';
import CreateProperty from "./pages/create_property/index.js";
import EditProperty from "./pages/edit_property/index.js";
import ViewProperty from "./pages/view_property/index.js";
import Signup from './pages/signup/index.js';
import Login from './pages/login/index.js'
import EditProfile from './pages/edit_profile/index.js';
import Notification from './pages/notification/index.js';
import Error from './pages/Error.js';
import './components/common.css'
import Reservations from './pages/reservations/index.js';
import Units from './pages/units/index.js';
import Logout from './pages/logout/index.js';
import UserProfile from './pages/user_profile/index.js';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" index element={<Index />} />
          <Route path="/create_property" element={<CreateProperty />} />
          <Route path="/edit_property/:property_id" element={<EditProperty />} />
          <Route path="/view_property/:property_id" element={<ViewProperty />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/edit_profile" element={<EditProfile />}/>
          <Route path='/notification' element={<Notification />} />
          <Route path='/logout' element={<Logout />} />
          <Route path='*' element={<Error />} />
          <Route path='/reservations' element={<Reservations/>} />
          <Route path='/units' element={<Units/>} />
          <Route path="/profile/:user_id" element={<UserProfile />}/>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
