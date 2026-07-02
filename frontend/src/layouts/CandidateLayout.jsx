import Sidebar from "../componenets/Sidebar";
import Navbar from "../componenets/Navbar";
import { Outlet } from "react-router-dom";

function CandidateLayout() {

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <div className="p-8 bg-slate-100 min-h-screen">

                    <Outlet />

                </div>

            </div>

        </div>

    );

}

export default CandidateLayout;