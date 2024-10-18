import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from './PostForm'; // Import the post form component
import './UpcomingMatches.css'; // Custom CSS

const UpcomingMatches = () => {
  const [matches, setMatches] = useState([]);
  console.log(matches,"gdasjhgdhsaghd")
  const [selectedMatch, setSelectedMatch] = useState(null); // Store selected match

  // Fetch matches from the API
  useEffect(() => {
    axios.get('https://rest.entitysport.com/v2/matches/?status=1&token=73d62591af4b3ccb51986ff5f8af5676')
      .then(response => {
        setMatches(response.data.response.items); // Store matches in state
      })
      .catch(error => console.error('Error fetching matches:', error));
  }, []);

  // Handle match selection
  const handleMatchClick = (match) => {
    setSelectedMatch(match); // Set the selected match when a match is clicked
  };

  // Handle back button click
  const handleBackClick = () => {
    setSelectedMatch(null); // Go back to match selection
  };

  return (
    <div>
      <h2>Upcoming Matches</h2>
      {/* Display list of matches or the post form */}
      {!selectedMatch ? (
        <div className="match-list">
          {matches.map((match) => (
            <div key={match.match_id} className="match-item" onClick={() => handleMatchClick(match)}>
              <h3>{match.title}</h3>
              <p>{match.subtitle}</p>
              <p>{new Date(match.date_start).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={handleBackClick} className="back-button">Back to Matches</button>
          <PostForm
            matchId={selectedMatch.match_id}
            teamA={selectedMatch.teama.name}
            teamB={selectedMatch.teamb.name}
          />
        </div>
      )}
    </div>
  );
};

export default UpcomingMatches;
