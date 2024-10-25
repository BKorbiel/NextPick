import React, {useState} from 'react';
import './SearchBox.css'

function SearchBox() {
    const [searchParams, setSearchParams] = useState({
        searchInput: "",
        movies: true,
        books: true,
    });

    const handleChange = (event) => {
        const { id, type, checked, value } = event.target;
        setSearchParams((prevState) => ({
            ...prevState,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <form class="searchbox-container"> 
            <input 
                className='search-box' 
                placeholder="Enter book or movie title..."
                id='searchInput'
                value={searchParams.searchInput}
                onChange={handleChange}
            />
            <div className='search-options'>
                Search for:
                <label class="checkbox-label">
                    <input type="checkbox" id="movies" value="Movies" checked={searchParams.movies} onChange={handleChange}/> Movies
                </label>
                <label class="checkbox-label">
                    <input type="checkbox" id="books" value="Books" checked={searchParams.books} onChange={handleChange}/> Books
                </label>
            </div>
        </form>
    );
}

export default SearchBox;