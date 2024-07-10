import React from "react";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

const Myqoutes = () => {


  const [user_quotes, setUser_quotes] = useState([]);
  const Session = localStorage.getItem("token");


  const fetch_user = async() =>{
    const res = await axios .get(`http://localhost:3001/userQuotesFetch/${Session}`)
    const quotes = res.data.UserQuotes
setUser_quotes(quotes)
  }
  
  useEffect(()=>{
    const intervals = setInterval(fetch_user,500)
    return () => clearInterval(intervals)
  },[])



  return (
    <div className="h-screen  flex-col text-center items-center justify-center">
      My quotes page
      <div className=" my-4">
        <br></br>
        {user_quotes.map((list,index) => (
          <ul className="bg-slate-400 h-1 flex items-center border-blue-300">
            <li className=" bg-slate-200 border-4   border-blue-300 p-4 w-fit mx-auto rounded-lg" key={index}>
              {list.user_quote}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Myqoutes;
