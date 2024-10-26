import React, { useState, useEffect } from 'react';
import SearchBox from '../SearchBox/SearchBox';
import { API_BASE_URL } from '../../constants';
import axios from 'axios';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import './SearchSection.css'
import ItemCard, {itemType} from '../ItemCard/ItemCard';

const SearchSection = ({selectedItems, onSelectItem}) => {
    const [hasSearched, setHasSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const updateSearchResults = (results) => {
        const updatedResults = results.map(item => ({
            ...item,
            isSelected: selectedItems.some(selectedItem => selectedItem.ID === item.ID)
        }));
        setSearchResults(updatedResults);
    }

    useEffect(() => {
        updateSearchResults(searchResults);
    }, [selectedItems]);

    const handleSearch = async (params) => {
        setSearchResults([]);
        setHasSearched(true);
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/search`, {
                params: params,
            });
            updateSearchResults(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleSelectItem = (item) => {
        const alreadyPicked = selectedItems.some(selectedItem => selectedItem.ID === item.ID);

        if (!alreadyPicked) {
            onSelectItem(item);
        }
    }

    return (
        <div className='search-section-main-container'>
            <SearchBox handleSearch={handleSearch}/>
            <br/>
            Search for books or movies and select up to twenty of them, and I'll recommend your next pick.
            <div className='search-results-container'>
            {loading ? 
                <LoadingSpinner/>
                :
                !searchResults.length && hasSearched ?
                <><br/><br/><br/>Sorry, no matches found. Please try a different search.</>
                :
                <div className='search-resulsts'>
                    {searchResults.map((item, idx) => (
                        <ItemCard 
                            params={item} 
                            key={idx}
                             onClick={handleSelectItem} 
                             type={item.isSelected ? itemType.SEARCH_RESULT_ALREADY_SELECTED : itemType.SEARCH_RESULT_NOT_SELECTED}
                        />
                    ))}
                </div>
            }
            </div>
        </div>
    )
}

export default SearchSection