import React, {useState} from 'react';
import './Recommendations.css'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ItemCard, {itemType} from '../ItemCard/ItemCard';

function Recommendations({items, loading, error, onReturnToHomePage}) {

    const searchItemInGoogle = (item) => {
        const searchQuery = item.Title + " " + item.additional_info + " " + item.Type;
        window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
    }

    return (
        <div className='recommendations'>
            Recommendations
            {loading ? <div className='loading-spinner-container'><LoadingSpinner /></div>
            :
            error ? 
            <div className='error'>
                Sorry, something went wrong.<br/>
                {error} <br/>
                <div className='home-page-button' onClick={onReturnToHomePage}>
                    Home Page
                </div>
            </div>
            :
            <>
                <div className='recommendations-container'>
                    <div className='recommendations-list'>
                        Books:
                        <div className='recommendations-scroll'>
                            {
                                items.map((item, idx) => (
                                    item.Type === "Book" &&
                                    <ItemCard 
                                        params={item} 
                                        key={idx}
                                        onClick={() => searchItemInGoogle(item)} 
                                        type={itemType.RECOMMENDATION}
                                    />
                                ))
                            }
                        </div>
                    </div>
                    <div className='recommendations-list'>
                        Movies:
                        <div className='recommendations-scroll'>
                            {
                                items.map((item, idx) => (
                                    item.Type === "Movie" &&
                                    <ItemCard 
                                        params={item} 
                                        key={idx}
                                        onClick={() => searchItemInGoogle(item)} 
                                        type={itemType.RECOMMENDATION}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className='home-page-button' onClick={onReturnToHomePage}>
                    Home Page
                </div>
            </>
            }
        </div>
    );
}

export default Recommendations;