import './index.css';
import Home from './components/Home/Home'
import { useState } from 'react';
import axios from 'axios';
import Recommendations from './components/Recommendations/Recommendations';
import { API_BASE_URL } from './constants';

const App =() => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRecommendations = async(url, params) => {
    setShowRecommendations(true);
    setLoading(true);
    
    try {
        const response = await axios.get(url, {
            params: params
        });
        setRecommendations(response.data);
    } catch (err) {
        setError(err.message);
        console.log(err);
    } finally {
        setLoading(false);
    }
  }
  
  const handleShowRecommendationsByInput = (text) => {
    const url = `${API_BASE_URL}/recommendations/by-input`;
    const params = {input: text};
    getRecommendations(url, params);
  }

  const handleShowRecommendationsBySelectedItems = async (selectedItems) => {
    const url = `${API_BASE_URL}/recommendations/by-ids`;
    const selectedItemIds = selectedItems.map((item, idx) => item.ID)
    const params = {ids: selectedItemIds.join(",")};
    getRecommendations(url, params);
  }
	
  const handleReturnToHomePage = () => {
    setShowRecommendations(false);
    setError(null);
    setLoading(false);
    setRecommendations([]);
  }

  return (
    <div> 
      <h1 className="title">NextPick</h1>
      {showRecommendations ?
        <div className='recommendations'>
          <Recommendations 
            error={error} 
            loading={loading} 
            items={recommendations}
            onReturnToHomePage={handleReturnToHomePage}
          />
        </div>
        :
        <div className='home'>
          <Home 
            onShowRecommendationsBySelectedItems={handleShowRecommendationsBySelectedItems}
            onShowRecommendationsByCustomInput={handleShowRecommendationsByInput}
          />
        </div>
      }
    </div>
  )
};

export default App;
