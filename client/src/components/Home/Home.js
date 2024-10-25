import React, {useEffect, useState} from 'react';
import SearchSection from '../SearchSection/SearchSection';
import './Home.css'

const Home = () => {

    return (
        <div className='home-main-container'>
            <div className='current-picks-section'>

            </div>
            <div className='search-section'>
                <SearchSection/>
            </div>
            <div className='custom-input-section'>

            </div>
        </div>
    )
}

export default Home