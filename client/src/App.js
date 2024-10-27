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

  const handleShowRecommendationsByInput = () => {
    setShowRecommendations(true);
  }

  const handleShowRecommendationsBySelectedItems = async (selectedItems) => {
    setShowRecommendations(true);
    setLoading(true);
    const selectedItemIds = selectedItems.map((item, idx) => item.ID)
    
    try {
        const response = await axios.get(`${API_BASE_URL}/recommendations/by-ids`, {
            params: {
              ids: selectedItemIds.join(",")
          }
        });
        setRecommendations(response.data);
    } catch (err) {
        setError(err.message);
        console.log(err);
    } finally {
        setLoading(false);
    }
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
          <Home onShowRecommendationsBySelectedItems={handleShowRecommendationsBySelectedItems}/>
        </div>
      }
    </div>
  )
};

export default App;
