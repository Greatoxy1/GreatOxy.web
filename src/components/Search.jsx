import { FaSearch } from "react-icons/fa";


const Search = ({searchTerm,setSearchTerm,onSearch})=>{


    return(
        <div className="search"><FaSearch />
        

       <input
       type="text"
       placeholder="Search for a movie"
         value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
       />
       <button onClick={onSearch}>Search</button>
         <button onClick={()=>setSearchTerm('')}>Clear</button>
        </div>
    )
}
export default Search;