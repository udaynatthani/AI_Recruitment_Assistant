import { Routes, Route } from "react-router-dom";
import  Login  from "../pages/Login";
import Register  from "../pages/Register";
import ProtectedRoute from "../componenets/Protectedroutes";
import CDashboard from "../pages/candidate/Dashboard";
import Dashboard from "../pages/Recruiter/Dashboard";
import CandidateLayout from "../layouts/CandidateLayout";

function Home(){

    return <h1>Home</h1>;

}

export default function AppRoutes(){

    return(

        <Routes>

            <Route
            path="/"
            element={<Home/>}
            />

            <Route
            path="/login"
            element={<Login/>}
            />

            <Route
            path="/register"
            element={<Register/>}
            />
            <Route
    path="/candidate"
    element={
        <ProtectedRoute allowedRole="candidate">
            <CandidateLayout />
        </ProtectedRoute>
    }
>
    <Route path="dashboard" element={<CDashboard />} />
</Route>
             <Route
            path="/recruiter/dashboard"
            element={ <ProtectedRoute allowedRole="recruiter">
            <Dashboard/>
            </ProtectedRoute>}
            />

        </Routes>

    );

}