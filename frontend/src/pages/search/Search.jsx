import SearchBar from "../../components/search/SearchBar.jsx"
import SearchItem from "../../components/search/SearchItem.jsx"
import SearchResult from "../../components/search/SearchResult.jsx"

function Search() {
  return (
    <div>
      <form action="">
        <SearchBar />
      </form>
      <SearchItem showBadge={true} />
      <SearchItem showBadge={false} />
      <SearchResult />
      
    </div>
  )
}

export default Search
