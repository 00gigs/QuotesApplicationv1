import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios'
import {jwt_decode, jwtDecode} from "jwt-decode";


const Profile = () => {
  const nav = useNavigate();

  const [savedQuotes,setSavedQuotes] = useState([])
const userTkn = localStorage.getItem('token')

const fetchSaved = async () => {
try {
  const res =  await axios.get(`http://localhost:3001/userfav/${userTkn}`)
  const quotes = res.data.quotes
  if(Array.isArray(quotes)){
    setSavedQuotes(res.data.quotes)
 
  }else{
    
    console.log('error')
  }
} catch (error) {
  console.error('failed to get favorite',error)
}


}

useEffect(() => {
const intervalid = setInterval(fetchSaved,500)
return () => clearInterval(intervalid)
},[])

  const LogOut = () => {
    console.log("logOut");
    localStorage.removeItem("token");
    nav("/Login");
  };

const decoded = jwtDecode(userTkn)



  return (
    <div className=" min-h-screen ">
      <div className="flex text-center mt-3 justify-center">Hey ,👋 {decoded.currentUser}</div>
      <div className="flex text-center mt-3 justify-center font-bold font-mono underline">
        {savedQuotes ? 'My saved Quotes':'Saved Quotes Appear Here '}
      </div>
        <div className=" flex flex-col items-center text-center">
  {savedQuotes.map((quote,index)=>(
    <ul>
    <li className="m-4"  key={index}>
      ♥️- {quote.quote}
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
