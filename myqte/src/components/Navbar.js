import React from 'react'
import { navLinks } from '../constants/Navlinks'
const Navbar = () => {
  return (
    <div className='mb-7 shadow-2xl flex sticky justify-center text-center bg-[#54D449] h-9 items-center border-b-4 border-black sm:h-12'>
      <ul className='flex  justify-center '>
      {navLinks.map((link)=>(
        <a className='pt-3 px-0 mb-3 sm:px-[7px]' href={link.route}>
          <li className='text-[10.5px] shadow-2xl border-l-2  border-r-2  font-serif text-center py-5 bg-blue-200 h-2 rounded-xl px-2  border-black hover:bg-blue-400 hover:scale-y-110 sm:text-[16px]'>{link.label}</li>
        </a>
      ))}
      </ul>
    </div>
  )
}

export default Navbar
