// import {Navigate, useFrom} from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";


function login(){
    const {
        register,
        handleSubmit,
        formState:{errors,isSubmitting}
    }=useForm();

    const {login}=useAuth();
    const navigate = useNavigate();
    const onSubmit = async(data )=>{
        try{
            const response = await loginUser (data);
            if(!response.success){
                toast.error(response.message);
                return;
            }
            login(response.token,response.user);
            toast.success("Login successful");
            
            if (response.user.role === "candidate") {

                navigate("/candidate/dashboard");

            }
            else{
                navigate("/recruiter/dashboard");
            }

        }
        catch(error){
            toast.error(error.response?.data?.message || "Login Failed");

        }
    };
    return (

        <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <div className="bg-white shadow-lg rounded-xl w-[420px] p-8">

            <h1 className="text-3xl font-bold text-center mb-6">

                Login

            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >

                <div>

                    <label>Email</label>

                    <input
                        type="email"
                        className="w-full border rounded-lg p-3 mt-2"
                        {...register("email", {
                            required: "Email is required"
                        })}
                    />

                    <p className="text-red-500 text-sm">

                        {errors.email?.message}

                    </p>

                </div>

                <div>

                    <label>Password</label>

                    <input
                        type="password"
                        className="w-full border rounded-lg p-3 mt-2"
                        {...register("password", {
                            required: "Password is required"
                        })}
                    />

                    <p className="text-red-500 text-sm">

                        {errors.password?.message}

                    </p>

                </div>

                <button
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >

                    {

                        isSubmitting

                            ? "Logging In..."

                            : "Login"

                    }

                </button>

            </form>

        </div>

    </div>

);
}
export default login;
