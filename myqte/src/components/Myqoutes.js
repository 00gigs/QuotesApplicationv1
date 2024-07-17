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
    fetch_user()
    const intervals = setInterval(fetch_user,10000)
    return () => clearInterval(intervals)
  },[])



  return (
    <div className="h-screen  flex-col text-center items-center justify-center">
      My quotes page
      <div className=" my-4">
        <br></br>
        {user_quotes.map((list,index) => (
          <ul className="flex">
            <li className=" border-blue-500 border-2 m-2 rounded-md bg-blue-200 p-2 h-10 shadow-2xl" key={index}>
              {list.user_quote}
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Myqoutes;
