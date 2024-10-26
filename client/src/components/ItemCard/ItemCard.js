import React, {useEffect, useState} from 'react';
import './ItemCard.css'

export const itemType = {
    SEARCH_RESULT_ALREADY_SELECTED: 'SEARCH_RESULT_ALREADY_SELECTED',
    SEARCH_RESULT_NOT_SELECTED: 'SEARCH_RESULT_NOT_SELECTED',
    CURRENT_PICK: 'CURRENT_PICK',
    RECOMMENDATION: 'RECOMMENDATION',
};

const ItemCard = ({params, onClick, type}) => {
    return (
        <div className='item-card-main-container' onClick={() => onClick(params)}>
            <img src={params.thumbnail ? params.thumbnail : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"} alt="Thumbnail" className="thumbnail" />
            <div className='item-card-content-container'>
                <div className='item-card-title'>
                    {params.Title}
                </div>
                <div className='item-info'>
                    {params.Type}
                </div>
                <div className='item-info'>
                    {params.Type === "Book" ?
                        `${params.additional_info}`
                        :
                        `Release date: ${params.additional_info}`
                    }
                </div>
                <div className='item-info'>
                    Average rating: {params.Rating}
                </div>
            </div>
            {type === itemType.SEARCH_RESULT_NOT_SELECTED && <div className={"overlay-add"}>Click to add</div>}
            {type === itemType.SEARCH_RESULT_ALREADY_SELECTED && <div className={"overlay-already-added"}>Item already selected</div>}
        </div>
    )
}

export default ItemCard