import React, {useEffect, useState} from 'react';
import SearchSection from '../SearchSection/SearchSection';
import './Home.css'
import CurrentSelections from '../CurrentSelections/CurrentSelections';
import CustomInputSection from '../CustomInputSection/CustomInputSection';

const Home = ({onShowRecommendationsBySelectedItems, onShowRecommendationsByCustomInput}) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [limitReached, setLimitReached] = useState(false);

    const handleSelectItem = (item) => {
        if (selectedItems.length >= 20) {
            setLimitReached(true);
        } else {
            setLimitReached(false);
            setSelectedItems(prevItems => [...prevItems, item]);
        }
    }

    const handleRemoveItem = (item) => {
        setSelectedItems(prevItems => {
            const updatedItems = prevItems.filter(i => i.ID !== item.ID);
            
            if (updatedItems.length < 20) {
                setLimitReached(false);
            }
            
            return updatedItems;
        });
    }

    return (
        <div className='home-main-container'>
            <div className='current-picks-section'>
                <CurrentSelections 
                    selectedItems={selectedItems} 
                    onRemoveItem={handleRemoveItem}
                    onShowRecommendations={() => onShowRecommendationsBySelectedItems(selectedItems)} 
                />
            </div>
            <div className='search-section'>
                {limitReached && "You can’t add more items – limit reached."}
                <SearchSection onSelectItem={handleSelectItem} selectedItems={selectedItems}/>
            </div>
            <div className='custom-input-section'>
                <CustomInputSection onSubmit={onShowRecommendationsByCustomInput}/>
            </div>
        </div>
    )
}

export default Home