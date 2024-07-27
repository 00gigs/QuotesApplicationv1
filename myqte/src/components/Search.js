import React from "react";
import { FaSearchengin } from "react-icons/fa6";
import { useState } from "react";
import axios from "axios";

const Search = () => {
  const [queryy, setQueryy] = useState("");

  const sendInput = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:3001/searchQuery?queryI=${encodeURIComponent(queryy)}`)
      .then((response) => {
        console.log("sent", response.data);
        setQueryy('')
      })
      .catch((error) => {
        console.error("error retrieving inout-->", error);
      });
  };

  return (
    <div className="w-screen flex justify-center items-center space-x-1">
      {/**search  */}
      <form onSubmit={sendInput} className="text-center items-center">
        <button type='submit'>
          <FaSearchengin className=" w-7 h-7 mx-1 hover:scale-110" />
        </button>
        <input
          type="text"
          name="searchResult"
          onChange={(e) => setQueryy(e.target.value)}
          value={queryy}
          className="bg-white border-4 h-11 rounded-xl "
          />
          <h1 className="mt-1 text-[20px] tracking-widest font-thin font-serif text-gray-500">Type to search mood , genre, author or find quote recommendations</h1>
      </form>
    </div>
  );
};

export default Search;
