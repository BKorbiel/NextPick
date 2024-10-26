import React, {useState} from 'react';
import './SearchBox.css'

function SearchBox({handleSearch}) {
    const [searchParams, setSearchParams] = useState({
        query: "",
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

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSearch(searchParams);
    }

    return (
        <form className="searchbox-container" onSubmit={(e) => handleSubmit(e)}> 
            <input 
                className='search-box' 
                placeholder="Enter book or movie title..."
                id='query'
                value={searchParams.query}
                onChange={handleChange}
            />
            <div className='search-options'>
                Search for:
                <label className="checkbox-label">
                    <input type="checkbox" id="movies" value="Movies" checked={searchParams.movies} onChange={handleChange}/> Movies
                </label>
                <label className="checkbox-label">
                    <input type="checkbox" id="books" value="Books" checked={searchParams.books} onChange={handleChange}/> Books
                </label>
                <button className='search-button' onClick={(e) => handleSubmit(e)}>Search</button>
            </div>
        </form>
    );
}

export default SearchBox;