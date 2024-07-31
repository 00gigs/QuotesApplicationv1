import React from 'react'
import { navLinks } from '../constants/Navlinks'
const Navbar = () => {
  return (
    <div className='mb-7 flex sticky justify-center text-center bg-[#54D449] h-9 items-center border-b-4 border-black sm:h-12'>
      <ul className='flex gap-2 justify-center mb-1 '>
      {navLinks.map((link)=>(
        <a href={link.route}>
          <li className='text-[11.5px]   sm:text-[16px]  '>{link.label}</li>
        </a>
      ))}
      </ul>
    </div>
  )
}

export default Navbar
