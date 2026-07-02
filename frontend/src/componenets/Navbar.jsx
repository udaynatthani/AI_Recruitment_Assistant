import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user } = useAuth();

    return (

        <div className="h-16 bg-white shadow flex items-center justify-between px-8">

            <h2 className="font-semibold text-xl">

                Candidate Dashboard

            </h2>

            <div>

                Welcome,

                <span className="font-bold ml-2">

                    {user?.name}

                </span>

            </div>

        </div>

    );

}

export default Navbar;