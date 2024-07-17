import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'
import { jwtDecode} from "jwt-decode";
import { MdDelete } from "react-icons/md";
import { FaShareNodes } from "react-icons/fa6";



const Profile = () => {
  const nav = useNavigate();

  const [savedQuotes,setSavedQuotes] = useState([])
  const  [id,setId] = useState([])
const userTkn = localStorage.getItem('token')
const decoded = jwtDecode(userTkn) 


const fetchSaved = async () => {
try {
  const res =  await axios.get(`http://localhost:3001/userfav/${userTkn}`)
  const {fetched,quotes} = res.data
  if(Array.isArray(quotes)){
    setSavedQuotes(res.data.quotes)
    setId(fetched.map(item => item.quote_));
 setId(fetched)
  }else{
    
    console.log('error')
  }
} catch (error) {
  console.error('failed to get favorite',error)
}
}



const httpDelete = async (quoteId) =>{
 try {
   const session = jwtDecode(userTkn).currentUser
   const res = await axios.delete(`http://localhost:3001/removeFav/${quoteId}/${session}`)
   if(res.status === 200 ){
    setSavedQuotes(savedQuotes.filter((quote, index) => id[index] !== quoteId));
    setId(id.filter(id => id !== quoteId));
    fetchSaved()
 console.log('deleted')
   }else{
    console.log('delete failed',res.data)
   }
 } catch (error) {
  console.error('Error:',error)
 }

}

useEffect(() => {
const intervalid = setInterval(fetchSaved,2000)
return () => clearInterval(intervalid)
},[])

//Logout
  const LogOut = () => {
    console.log("logOut");
    localStorage.removeItem("token");
    nav("/Login");
  };





  return (
    <div className=" min-h-screen ">
      <div className="flex text-center mt-3 justify-center">Hey ,👋 {decoded.currentUser}</div>
      <div className="flex text-center mt-3 justify-center font-bold font-mono underline">
        {savedQuotes ? 'My saved Quotes':'Saved Quotes Appear Here '}
      </div>
        <div className=" flex flex-col items-center text-center">
  {savedQuotes.map((quote,index)=>(
    <ul className="bg-orange-300 border-b-4 border-black my-4 flex items-center text-center"  key={index}>
    <li className="m-4 items-center text-center flex" >
      <MdDelete 
      onClick={()=>httpDelete(id[index])}
      className=" hover:cursor-pointer hover:scale-110 size-3 bg-red-500 rounded-lg mx-2"
      />
    <FaShareNodes
    className=" bg-green-500 size-3 rounded-lg mx-1"
    />- {quote.quote}
    </li>
    </ul>
  ))}
         
        </div>
      <div className="flex text-center mt-3 justify-center">
        <button className=" text-xs rounded-lg font-mono bg-red-200 p-1 flex hover:scale-110 hover:bg-red-400" onClick={LogOut}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default Profile;
