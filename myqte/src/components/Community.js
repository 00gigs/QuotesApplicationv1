import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
const Community = () => {

  const [communityQuotes,setCommunityQuotes]= useState([])



  const retrieveAll = async ()=>{
    try {
      axios.get('http://localhost:3001/community').then((res)=>{
      setCommunityQuotes(res.data.all)
      }).catch((err)=>{
        console.error(err)
      })
    } catch (error) {
      console.error('err',error)
    }
  }

  useEffect(() => {
    retrieveAll()
  const intervals = setInterval(retrieveAll,10000)
  console.log(communityQuotes)
  return() => clearInterval(intervals)
  }, [])

  return (
    <div className='h-screen flex text-center items-center justify-center'>
  {communityQuotes.map((value,index)=>(
    <ul key={index} className='px-5 rounded-ee-md h-16  flex'>
      <li className='  border-blue-500 border-2 m-2 rounded-md bg-blue-200 p-2 h-10 shadow-2xl'>
          {value.user_quote}
      </li>
    </ul>
  ))}
    </div>
  )
}

export default Community
