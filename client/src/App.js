import './index.css';
import Home from './components/Home/Home'
import { useState } from 'react';

const App =() => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedItemIDs, setSelectedItemIDs] = useState([]);

  const handleShowRecommendationsByInput = () => {
    setShowRecommendations(true);
  }

  const handleShowRecommendationsBySelectedItems = (selectedItems) => {
    const selectedItemIds = [selectedItems.map((item, idx) => item.ID)]
    setSelectedItemIDs(selectedItemIds);
    setShowRecommendations(true);
  }
	
  return (
    <div> 
      <h1 className="title">NextPick</h1>
      {showRecommendations ?
        null
        :
        <div className='home'>
            <Home onShowRecommendationsBySelectedItems={handleShowRecommendationsBySelectedItems}/>
        </div>
      }
    </div>
  )
};

export default App;
