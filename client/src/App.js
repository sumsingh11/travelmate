import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
// import Home from "./pages/Home";
import AdminPanel from "./components/AdminPanel"
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"
import Register from "./components/Register"
import Activities from "./pages/Activities"
import Planner from "./pages/Planner"
import TripOverview from "./pages/TripOverview"

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                } />
                <Route path="/trip" element={
                    <PrivateRoute>
                        <TripOverview />
                    </PrivateRoute>
                } />
                <Route path="/activities" element={
                    <PrivateRoute>
                        <Activities />
                    </PrivateRoute>
                } />
                <Route path="/planner" element={
                    <PrivateRoute>
                        <Planner />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute role="Admin">
                        <AdminPanel />
                    </PrivateRoute>
                } />
                {/* <Route path="/trip" element={<TripOverview />} /> */}
                {/* <Route path="/activities" element={<Activities />} /> */}
                {/* <Route path="/planner" element={<Planner />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
