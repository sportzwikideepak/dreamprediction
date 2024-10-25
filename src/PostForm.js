import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select"; // Importing react-select
import "./PostForm.css";

const PostForm = ({ matchId, teamA, teamB }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [preview, setPreview] = useState("");
  const [playing11A, setPlaying11A] = useState([]);
  const [playing11B, setPlaying11B] = useState([]);
  const [captainChoice, setCaptainChoice] = useState(null); // New state for Captain
  const [viceCaptainChoice, setViceCaptainChoice] = useState(null); // New state

  const [pitch, setPitch] = useState("");
  const [records, setRecords] = useState("");
  const [winningPercentage, setWinningPercentage] = useState("");
  const [pitchBehaviour, setPitchBehaviour] = useState("");
  const [avgInningScore, setAvgInningScore] = useState("");
  const [bestSuitedTo, setBestSuitedTo] = useState("");
  const [squadA, setSquadA] = useState([]);
  const [squadB, setSquadB] = useState([]);
  const [keepersA, setKeepersA] = useState([]);
  const [batsmenA, setBatsmenA] = useState([]);
  const [allroundersA, setAllroundersA] = useState([]);
  const [bowlersA, setBowlersA] = useState([]);
  const [keepersB, setKeepersB] = useState([]);
  const [batsmenB, setBatsmenB] = useState([]);
  const [allroundersB, setAllroundersB] = useState([]);
  const [bowlersB, setBowlersB] = useState([]);
  const [captaincyPicks, setCaptaincyPicks] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [budgetPicks, setBudgetPicks] = useState([]);
  const [captainViceCaptainPicks, setCaptainViceCaptainPicks] = useState([]);
  const [slCaptaincyChoice, setSlCaptaincyChoice] = useState([]);
  const [glCaptaincyChoice, setGlCaptaincyChoice] = useState([]);
  const [puntPicks, setPuntPicks] = useState([]);
  const [dream11Combination, setDream11Combination] = useState("");

  const [teams, setTeams] = useState([]); // Store multiple teams
  const [showTeamForm, setShowTeamForm] = useState(false); // Toggle team form
  const [currentTeam, setCurrentTeam] = useState({
    teamName: "",
    keepers: [],
    batsmen: [],
    allrounders: [],
    bowlers: [],
  });

  // Fetch squads for both teams when matchId is provided
  useEffect(() => {
    if (matchId) {
      axios
        .get(
          `https://rest.entitysport.com/v2/matches/${matchId}/squads?token=73d62591af4b3ccb51986ff5f8af5676`
        )
        .then((response) => {
          console.log("API Response:", response.data);
  
          // Extract squads and players data from the response
          const playersData = response.data.response.players;
          const squadAData = response.data.response.teama.squads;
          const squadBData = response.data.response.teamb.squads;
  
          console.log("Players Data:", playersData);
          console.log("Squad A Data:", squadAData);
          console.log("Squad B Data:", squadBData);
  
          // Function to map squad players with their ratings
          const mapPlayerData = (squad, players) => {
            return squad.map((squadPlayer) => {
              // Convert player_id to a number for matching
              const playerId = Number(squadPlayer.player_id);
  
              // Find the player details by matching player_id with pid
              const playerDetails = players.find(
                (player) => player.pid === playerId
              );
  
              console.log("Squad Player ID:", squadPlayer.player_id);
              console.log("Matched Player Details:", playerDetails);
  
              // If player details are found, include fantasy_player_rating and role
              return {
                value: squadPlayer.player_id,
                label: `${squadPlayer.name} - ${playerDetails?.fantasy_player_rating || 'N/A'} (${squadPlayer.role})`,
                rating: playerDetails?.fantasy_player_rating || 'N/A',
                role: squadPlayer.role,
              };
            });
          };
  
          // Map data for team A and team B
          const teamAPlayers = mapPlayerData(squadAData, playersData);
          const teamBPlayers = mapPlayerData(squadBData, playersData);
  
          console.log("Mapped Team A Players:", teamAPlayers);
          console.log("Mapped Team B Players:", teamBPlayers);
  
          // Set the squads for both teams
          setSquadA(teamAPlayers);
          setSquadB(teamBPlayers);
        })
        .catch((error) => console.error("Error fetching squads:", error));
    }
  }, [matchId]);
  
  

  // Pre-fill title when team names are available
  useEffect(() => {
    if (teamA && teamB) {
      setTitle(`${teamA} vs ${teamB} Prediction`);
    }
  }, [teamA, teamB]);

  // Handle player selection for specific roles
  const handleRoleSelect = (team, role, selectedPlayers) => {
    if (team === "A") {
      switch (role) {
        case "keepers":
          setKeepersA(selectedPlayers);
          break;
        case "batsmen":
          setBatsmenA(selectedPlayers);
          break;
        case "allrounders":
          setAllroundersA(selectedPlayers);
          break;
        case "bowlers":
          setBowlersA(selectedPlayers);
          break;
        default:
          break;
      }
    } else if (team === "B") {
      switch (role) {
        case "keepers":
          setKeepersB(selectedPlayers);
          break;
        case "batsmen":
          setBatsmenB(selectedPlayers);
          break;
        case "allrounders":
          setAllroundersB(selectedPlayers);
          break;
        case "bowlers":
          setBowlersB(selectedPlayers);
          break;
        default:
          break;
      }
    }
  };

  // const addTeam = () => {
  //   setTeams([...teams, currentTeam]); // Add current team to teams list
  //   setCurrentTeam({
  //     teamName: "",
  //     keepers: [],
  //     batsmen: [],
  //     allrounders: [],
  //     bowlers: [],
  //   }); // Reset current team form
  //   setShowTeamForm(false); // Close the form
  // };


  const addTeam = () => {
    const selectedPlayers = [
      ...currentTeam.keepers,
      ...currentTeam.batsmen,
      ...currentTeam.allrounders,
      ...currentTeam.bowlers
    ];
  
    // Check if the total selected players are 11
    if (selectedPlayers.length !== 11) {
      alert("Please select exactly 11 players to create a team.");
      return;
    }
  
    // Calculate the total fantasy player rating
    const totalRating = selectedPlayers.reduce((acc, player) => {
      return acc + player.rating;
    }, 0);
  
    // Check if the total rating exceeds 100
    if (totalRating > 100) {
      alert("Fantasy player rating exceeds 100. You cannot create this team.");
      return;
    }
  
    // Proceed with adding the team if conditions are met
    setTeams([...teams, currentTeam]);
  
    // Reset the current team form after adding
    setCurrentTeam({
      teamName: "",
      keepers: [],
      batsmen: [],
      allrounders: [],
      bowlers: []
    });
  
    setShowTeamForm(false); // Close the form
  };
  // Handle player selection for Hot Picks categories
  const handleHotPickSelect = (category, selectedPlayers) => {
    switch (category) {
      case "captaincyPicks":
        setCaptaincyPicks(selectedPlayers);
        break;
      case "topPicks":
        setTopPicks(selectedPlayers);
        break;
      case "budgetPicks":
        setBudgetPicks(selectedPlayers);
        break;
      case "captainViceCaptainPicks":
        setCaptainViceCaptainPicks(selectedPlayers);
        break;
      default:
        break;
    }
  };

  // Handle expert advice selection
  const handleExpertSelect = (category, selectedPlayers) => {
    switch (category) {
      case "slCaptaincyChoice":
        setSlCaptaincyChoice(selectedPlayers);
        break;
      case "glCaptaincyChoice":
        setGlCaptaincyChoice(selectedPlayers);
        break;
      case "puntPicks":
        setPuntPicks(selectedPlayers);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = {
      matchId,
      title,
      summary,
      tableOfContent: {
        preview,
        pitchReport: {
          pitch,
          records,
          winningPercentage,
          pitchBehaviour,
          avgInningScore,
          bestSuitedTo,
        },
      },
      teams, // The created teams with selected players

      playing11TeamA: {
        keepers: keepersA.map((player) => player.label),
        batsmen: batsmenA.map((player) => player.label),
        allrounders: allroundersA.map((player) => player.label),
        bowlers: bowlersA.map((player) => player.label),
      },
      playing11TeamB: {
        keepers: keepersB.map((player) => player.label),
        batsmen: batsmenB.map((player) => player.label),
        allrounders: allroundersB.map((player) => player.label),
        bowlers: bowlersB.map((player) => player.label),
      },
      hotPicks: {
        captaincyPicks: captaincyPicks.map((player) => player.label),
        topPicks: topPicks.map((player) => player.label),
        budgetPicks: budgetPicks.map((player) => player.label),
        // captainViceCaptainPicks: captainViceCaptainPicks.map(
        //   (player) => player.label
        // ),
      },
      captainChoice: captainChoice?.label || null, // Send Captain Choice
      viceCaptainChoice: viceCaptainChoice?.label || null, // Send Vice-Ca
      expertAdvice: {
        slCaptaincyChoice: slCaptaincyChoice.map((player) => player.label),
        glCaptaincyChoice: glCaptaincyChoice.map((player) => player.label),
        puntPicks: puntPicks.map((player) => player.label),
        dream11Combination,
      },
    };
    console.log(postData); // Here you would send the data to your backend
  };
  const handlePlaying11Select = (team, selectedPlayers) => {
    if (team === "A") {
      setPlaying11A(selectedPlayers);
    } else if (team === "B") {
      setPlaying11B(selectedPlayers);
    }
  };

  // Handle form changes for each team
  const handleTeamFormChange = (field, value) => {
    setCurrentTeam({
      ...currentTeam,
      [field]: value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2>
        Match Prediction for {teamA} vs {teamB}
      </h2>

      <div className="form-group">
        <label>Title:</label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Summary:</label>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Enter summary"
          rows="4"
        />
      </div>

      <div className="form-group">
        <label>Match Preview:</label>
        <textarea
          value={preview}
          onChange={(e) => setPreview(e.target.value)}
          placeholder="Enter Preview"
          rows="4"
        />
      </div>
      {/* <div className="form-group"> */}
      <hr style={{ margin: "50px 0px" }}></hr>
      {/* </div> */}
      <h3>Pitch Report</h3>

      <div className="form-group">
        <label>Pitch:</label>
        <textarea
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="Describe the pitch conditions"
          rows="2"
        />
      </div>

      <div className="form-group1">
        <label>Records:</label>
        <textarea
          cla
          value={records}
          onChange={(e) => setRecords(e.target.value)}
          placeholder="Enter match records"
          rows="2"
        />
      </div>

      <div className="form-group1">
        <label>Winning Percentage:</label>
        <textarea
          value={winningPercentage}
          onChange={(e) => setWinningPercentage(e.target.value)}
          placeholder="Enter winning percentage"
          rows="2"
        />
      </div>

      <div className="form-group1">
        <label>Pitch Behaviour:</label>
        <textarea
          value={pitchBehaviour}
          onChange={(e) => setPitchBehaviour(e.target.value)}
          placeholder="Describe pitch behaviour"
          rows="2"
        />
      </div>

      <div className="form-group1">
        <label>Average Inning Score:</label>
        <textarea
          value={avgInningScore}
          onChange={(e) => setAvgInningScore(e.target.value)}
          placeholder="Enter average inning score"
          rows="2"
        />
      </div>

      <div className="form-group1">
        <label>Best Suited To:</label>
        <textarea
          value={bestSuitedTo}
          onChange={(e) => setBestSuitedTo(e.target.value)}
          placeholder="Which team is the pitch best suited to?"
          rows="2"
        />
      </div>

      <hr style={{ margin: "50px 0px" }}></hr>

      <h3>Hot Picks</h3>

      <div className="form-group">
        <label>Captaincy Picks:</label>
        <Select
          isMulti
          options={[...squadA, ...squadB]}
          value={captaincyPicks}
          onChange={(selected) =>
            handleHotPickSelect("captaincyPicks", selected)
          }
          placeholder="Select Captaincy Picks"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Top Picks:</label>
        <Select
          isMulti
          options={[...squadA, ...squadB]}
          value={topPicks}
          onChange={(selected) => handleHotPickSelect("topPicks", selected)}
          placeholder="Select Top Picks"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Budget Picks:</label>
        <Select
          isMulti
          options={[...squadA, ...squadB]}
          value={budgetPicks}
          onChange={(selected) => handleHotPickSelect("budgetPicks", selected)}
          placeholder="Select Budget Picks"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Captain Choice:</label>
        <Select
          options={[...squadA, ...squadB]}
          value={captainChoice}
          onChange={(selected) => setCaptainChoice(selected)}
          placeholder="Select Captain"
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      {/* Vice-Captain Choice */}
      <div className="form-group">
        <label>Vice-Captain Choice:</label>
        <Select
          options={[...squadA, ...squadB]}
          value={viceCaptainChoice}
          onChange={(selected) => setViceCaptainChoice(selected)}
          placeholder="Select Vice-Captain"
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <hr style={{ margin: "50px 0px" }}></hr>

      <h3>Expert Advice</h3>

      <div className="form-group">
        <label>SL Captaincy Choice:</label>
        <Select
          isMulti
          options={[...squadA, ...squadB]}
          value={slCaptaincyChoice}
          onChange={(selected) =>
            handleExpertSelect("slCaptaincyChoice", selected)
          }
          placeholder="Select SL Captaincy Choice"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <div className="form-group">
        <label>GL Captaincy Choice:</label>
        <Select
          isMulti
          options={[...squadA, ...squadB]}
          value={glCaptaincyChoice}
          onChange={(selected) =>
            handleExpertSelect("glCaptaincyChoice", selected)
          }
          placeholder="Select GL Captaincy Choice"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Punt Picks:</label>
        <Select
          isMulti
          options={[...squadA, ...squadB]}
          value={puntPicks}
          onChange={(selected) => handleExpertSelect("puntPicks", selected)}
          placeholder="Select Punt Picks"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Dream 11 Combination:</label>
        <textarea
          value={dream11Combination}
          onChange={(e) => setDream11Combination(e.target.value)}
          placeholder="Enter Dream 11 Combination"
          rows="4"
        />
      </div>

      <hr style={{ margin: "50px 0px" }}></hr>

      <h3>Teams Created</h3>
      {/* Display the list of created teams */}
      {teams.length > 0 &&
        teams.map((team, index) => (
          <div key={index} className="team-details">
            <h4>{team.teamName}</h4>
            <p>Keepers: {team.keepers.map((p) => p.label).join(", ")}</p>
            <p>Batsmen: {team.batsmen.map((p) => p.label).join(", ")}</p>
            <p>
              All-rounders: {team.allrounders.map((p) => p.label).join(", ")}
            </p>
            <p>Bowlers: {team.bowlers.map((p) => p.label).join(", ")}</p>
          </div>
        ))}

      {/* Add New Team Button */}
      {!showTeamForm && (
        <button onClick={() => setShowTeamForm(true)} className="add-team-btn">
          Add New Team +
        </button>
      )}

      {/* Team Creation Form */}
      {showTeamForm && (
        <div className="team-form">
          <h3>Create New Team</h3>

          <div className="form-group">
            <label>Team Name:</label>
            <input
              type="text"
              value={currentTeam.teamName}
              onChange={(e) => handleTeamFormChange("teamName", e.target.value)}
              placeholder="Enter team name"
            />
          </div>

          <div className="form-group">
            <label>Keeper:</label>
            <Select
              isMulti
              // options={[...squadA, ...squadB]}
              options={squadA.concat(squadB).filter(player => player.role === "wk")} // Filter for wicketkeepers

              value={currentTeam.keepers}
              onChange={(selected) => handleTeamFormChange("keepers", selected)}
              placeholder="Select Keepers"
              closeMenuOnSelect={false}
              isSearchable
              maxMenuHeight={200}
            />
          </div>

          <div className="form-group">
            <label>Batsmen:</label>
            <Select
              isMulti
              // options={[...squadA, ...squadB]}
              options={squadA.concat(squadB).filter(player => player.role === "bat")} // Filter for batsmen

              value={currentTeam.batsmen}
              onChange={(selected) => handleTeamFormChange("batsmen", selected)}
              placeholder="Select Batsmen"
              closeMenuOnSelect={false}
              isSearchable
              maxMenuHeight={200}
            />
          </div>

          <div className="form-group">
            <label>All-rounders:</label>
            <Select
              isMulti
              // options={[...squadA, ...squadB]}
              options={squadA.concat(squadB).filter(player => player.role === "all")} // Filter for all-rounders

              value={currentTeam.allrounders}
              onChange={(selected) =>
                handleTeamFormChange("allrounders", selected)
              }
              placeholder="Select All-rounders"
              closeMenuOnSelect={false}
              isSearchable
              maxMenuHeight={200}
            />
          </div>

          <div className="form-group">
            <label>Bowlers:</label>
            <Select
              isMulti
              // options={[...squadA, ...squadB]}
              options={squadA.concat(squadB).filter(player => player.role === "bowl")} // Filter for bowlers

              value={currentTeam.bowlers}
              onChange={(selected) => handleTeamFormChange("bowlers", selected)}
              placeholder="Select Bowlers"
              closeMenuOnSelect={false}
              isSearchable
              maxMenuHeight={200}
            />
          </div>

          <button type="button" onClick={addTeam} className="submit-btn">
            Add Team
          </button>
        </div>
      )}

      <hr style={{ margin: "50px 0px" }}></hr>

      {/* Playing 11 Selection for Team A */}
      <h3>Select Playing 11 for {teamA}</h3>
      <div className="form-group">
        <label>Playing 11:</label>
        <Select
          isMulti
          options={squadA}
          value={playing11A}
          onChange={(selected) => handlePlaying11Select("A", selected)}
          placeholder={`Select Playing 11 for ${teamA}`}
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
          maxMenuWidth={300}
        />
        <p>Select up to 11 players</p>
      </div>

      {/* Playing 11 Selection for Team B */}
      <h3>Select Playing 11 for {teamB}</h3>
      <div className="form-group">
        <label>Playing 11:</label>
        <Select
          isMulti
          options={squadB}
          value={playing11B}
          onChange={(selected) => handlePlaying11Select("B", selected)}
          placeholder={`Select Playing 11 for ${teamB}`}
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
          maxMenuWidth={300}
        />
        <p>Select up to 11 players</p>
      </div>

      <hr style={{ margin: "50px 0px" }}></hr>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
