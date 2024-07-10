import React from "react";
import axios from 'axios'
import { useState } from "react";

const Create = () => {

const getLogged = localStorage.getItem('token')

const [userQuote,setUserQuote] = useState('')

  const Upload = (e) =>{
    e.preventDefault()
   axios.post(`http://localhost:3001/uploadQuote/${getLogged}/${encodeURIComponent(userQuote)}`).then((res)=>{
    console.log(res.data)
    alert('uploaded')
    setUserQuote('')
   }).catch((error)=>{
    console.error("Error uploading quote:", error)
   })
   console.log(userQuote)
  }




  return (
    <div className="h-screen flex text-center items-center justify-center">
      <form onSubmit={Upload}>
        <label>
          <h1 className="mb-3 italic">Create a Quote, change a mind</h1>
          <textarea
            value={userQuote}
            rows="4"
            cols="30"
            placeholder="Remember to make an intellectual impact"
            className="bg-transparent border-4 text-center border-black rounded-md"
            onChange={e => setUserQuote(e.target.value)}
          />
          <br />
          <button type="submit" className="bg-slate-200 px-4 py-1 mt-4 rounded-lg buttonFx uppercase" >Upload</button>
        </label>
      </form>
    </div>
  );
};

export default Create;
