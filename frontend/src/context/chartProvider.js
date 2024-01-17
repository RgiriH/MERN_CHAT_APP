import {
  createContext,
  useEffect,
  useState,
  
} from "react";

import { useNavigate } from "react-router-dom";
export const chartContext = createContext();

const ChartProvider = ({ children }) => {
    
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState(null);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user"))
        
       
        if (!userData) {
            navigate("/")
        }
        setUser(userData);
        
    },[navigate])
    
    return(
        <chartContext.Provider value = {{user , setSelectedChat ,selectedChat , chats , setChats}} >
            {children}
        </chartContext.Provider>
   )
}



export default ChartProvider;