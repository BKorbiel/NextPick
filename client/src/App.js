import './index.css';
import Home from './components/Home/Home'
import { useState } from 'react';

const App =() => {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleShowRecommendationsByInput = () => {
    setShowRecommendations(true);
  }

  const handleShowRecommendationsByPositions = () => {
    setShowRecommendations(true);
  }
	
  return (
    <div> 
      <h1 className="title">NextPick</h1>
      {showRecommendations ?
        null
        :
        <div className='home'>
            <Home/>
        </div>
      }
    </div>
  )
};

export default App;
