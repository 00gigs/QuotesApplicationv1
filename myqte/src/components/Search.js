import React from "react";
import { FaSearchengin } from "react-icons/fa6";

const Search = () => {



  
  return (
    <div className="w-screen flex justify-center items-center mb-3 space-x-1">
      {" "}
      {/**search  */}
      <button>
        <FaSearchengin className=" w-7 h-7 hover:w-9 h-9" />
      </button>
      <input className="bg-white border-4 h-11 rounded-xl" />
    </div>
  );
};

export default Search;
