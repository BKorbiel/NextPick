import React, { useState, useEffect } from 'react';
import ItemCard, {itemType} from '../ItemCard/ItemCard';
import './CurrentSelections.css'

const CurrentSelections = ({selectedItems, onRemoveItem, onShowRecommendations}) => {
    const [wrongClick, setWrongClick] = useState(false);

    const handleClick = () => {
        if (selectedItems.length == 0) {
            setWrongClick(true);
        } else {
            onShowRecommendations();
        }
    }

    return (
        <div className='current-picks-main-container'>
            Current picks:
            <div className='current-picks-container'>
                {selectedItems.length ?
                selectedItems.map((item, idx) => (
                    <ItemCard 
                        params={item} 
                        key={idx}
                        onClick={onRemoveItem} 
                        type={itemType.CURRENT_PICK}
                    />
                ))
                :
                "You didn't add any item yet."
            }
            </div>
            <div className='show-recommendations-button' onClick={handleClick}>
                Show Recommendations
            </div>
            {wrongClick && 
                <div className='wrong-click-notification'>
                    Please add at least one item or use the custom input section to see recommendations.
                </div>
            }
        </div>
    )
}

export default CurrentSelections