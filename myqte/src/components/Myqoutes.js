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
  
const dateNormal = (dateConvert) =>{
  const norm = new Date(dateConvert)
  const  logic = (num)=> (num < 10 ? '0' : '') + num 
  const month =logic(norm.getMonth() + 1)
  const days  = logic(norm.getDate())
  const years = logic(norm.getFullYear().toString().slice(-2))
  let hours = logic(norm.getHours())
  hours = hours % 12
  hours = hours ? hours : '12'
  const twelveHour = logic(hours)
  const minutes = logic(norm.getMinutes())
  const ampm = hours >= 12 ? 'PM': 'AM'

  return `${month}/${days}/${years} - ${twelveHour}:${minutes} ${ampm}`
}

  useEffect(()=>{
    fetch_user()
    const intervals = setInterval(fetch_user,10000)
    return () => clearInterval(intervals)
  },[])



  return (
    <div className="h-screen  flex-col text-center items-center justify-center">
      <h1 className="mt-[10px]">
     Looks Like You Have Been Doing Some Thinking . . .  
      </h1>
      <div className=" my-2">
        <br></br>
        {user_quotes.map((list,index) => (
          <ul className="flex">
            <li className=" border-blue-500 border-2 m-4 rounded-md bg-blue-200 p-2 h-10 shadow-2xl" key={index}>
              <div>
              {list.user_quote}
              </div>
              <div className="my-1 text-[20px] shadow-inner">
                {dateNormal(list.created_at)}
              </div>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default Myqoutes;
