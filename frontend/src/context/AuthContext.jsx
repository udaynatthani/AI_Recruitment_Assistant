import { createContext, useContext,useState, useEffect } from "react";

const AuthContext = createContext();

export  const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");
        if(token && userData){
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    },[]);

    const login = (token,user)=>{
        localStorage.setItem("token",token);
        localStorage.setItem("user",JSON.stringify(user));
        setUser(user);
    };

    const logout =()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user,loading,login,logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);