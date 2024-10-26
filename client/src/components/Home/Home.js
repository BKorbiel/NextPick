import React, {useEffect, useState} from 'react';
import SearchSection from '../SearchSection/SearchSection';
import './Home.css'

const Home = () => {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSelectItem = (item) => {
        setSelectedItems(prevItems => [...prevItems, item]);
    }

    return (
        <div className='home-main-container'>
            <div className='current-picks-section'>

            </div>
            <div className='search-section'>
                <SearchSection onSelectItem={handleSelectItem} selectedItems={selectedItems}/>
            </div>
            <div className='custom-input-section'>

            </div>
        </div>
    )
}

export default Home