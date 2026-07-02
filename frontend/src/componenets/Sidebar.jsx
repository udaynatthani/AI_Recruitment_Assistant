import {
    FaHome,
    FaBriefcase,
    FaBookmark,
    FaFileAlt,
    FaClipboardList,
    FaRobot,
    FaChartBar,
    FaRoute,
    FaUser,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {

    const { logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    const menu = [

        {
            name: "Dashboard",
            icon: <FaHome />,
            path: "/candidate/dashboard"
        },

        {
            name: "Jobs",
            icon: <FaBriefcase />,
            path: "/candidate/jobs"
        },

        {
            name: "Saved Jobs",
            icon: <FaBookmark />,
            path: "/candidate/saved-jobs"
        },

        {
            name: "Resume",
            icon: <FaFileAlt />,
            path: "/candidate/resume"
        },

        {
            name: "Applications",
            icon: <FaClipboardList />,
            path: "/candidate/applications"
        },

        {
            name: "Mock Interview",
            icon: <FaRobot />,
            path: "/candidate/mock-interview"
        },

        {
            name: "Interview Reports",
            icon: <FaChartBar />,
            path: "/candidate/reports"
        },

        {
            name: "Learning Roadmap",
            icon: <FaRoute />,
            path: "/candidate/roadmap"
        },

        {
            name: "Profile",
            icon: <FaUser />,
            path: "/candidate/profile"
        }

    ];

    return (

        <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">

            <div className="text-2xl font-bold p-6 border-b border-slate-700">

                AI Recruit

            </div>

            <div className="flex-1">

                {

                    menu.map((item) => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>
                                `flex items-center gap-3 px-6 py-4 hover:bg-slate-800 ${
                                    isActive ? "bg-blue-600" : ""
                                }`
                            }

                        >

                            {item.icon}

                            {item.name}

                        </NavLink>

                    ))

                }

            </div>

            <button

                onClick={handleLogout}

                className="flex items-center gap-3 p-5 bg-red-600 hover:bg-red-700"

            >

                <FaSignOutAlt />

                Logout

            </button>

        </div>

    );

}

export default Sidebar;