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
  

  // Fetch squads for both teams when matchId is provided
  useEffect(() => {
    if (matchId) {
      axios
        .get(
          `https://rest.entitysport.com/v2/matches/${matchId}/squads?token=73d62591af4b3ccb51986ff5f8af5676`
        )
        .then((response) => {
          const teamAPlayers = response.data.response.teama.squads.map(
            (player) => ({
              value: player.player_id,
              label: player.name,
            })
          );
          const teamBPlayers = response.data.response.teamb.squads.map(
            (player) => ({
              value: player.player_id,
              label: player.name,
            })
          );
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

      <div className="form-group">
        <label>Records:</label>
        <textarea
          value={records}
          onChange={(e) => setRecords(e.target.value)}
          placeholder="Enter match records"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Winning Percentage:</label>
        <textarea
          value={winningPercentage}
          onChange={(e) => setWinningPercentage(e.target.value)}
          placeholder="Enter winning percentage"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Pitch Behaviour:</label>
        <textarea
          value={pitchBehaviour}
          onChange={(e) => setPitchBehaviour(e.target.value)}
          placeholder="Describe pitch behaviour"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Average Inning Score:</label>
        <textarea
          value={avgInningScore}
          onChange={(e) => setAvgInningScore(e.target.value)}
          placeholder="Enter average inning score"
          rows="2"
        />
      </div>

      <div className="form-group">
        <label>Best Suited To:</label>
        <textarea
          value={bestSuitedTo}
          onChange={(e) => setBestSuitedTo(e.target.value)}
          placeholder="Which team is the pitch best suited to?"
          rows="2"
        />
      </div>

      <h3>Select Players for {teamA}</h3>

      <div className="form-group">
        <label>Keeper:</label>
        <Select
          isMulti
          options={squadA}
          value={keepersA}
          onChange={(selected) => handleRoleSelect("A", "keepers", selected)}
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
          options={squadA}
          value={batsmenA}
          onChange={(selected) => handleRoleSelect("A", "batsmen", selected)}
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
          options={squadA}
          value={allroundersA}
          onChange={(selected) =>
            handleRoleSelect("A", "allrounders", selected)
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
          options={squadA}
          value={bowlersA}
          onChange={(selected) => handleRoleSelect("A", "bowlers", selected)}
          placeholder="Select Bowlers"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

      <h3>Select Players for {teamB}</h3>

      <div className="form-group">
        <label>Keeper:</label>
        <Select
          isMulti
          options={squadB}
          value={keepersB}
          onChange={(selected) => handleRoleSelect("B", "keepers", selected)}
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
          options={squadB}
          value={batsmenB}
          onChange={(selected) => handleRoleSelect("B", "batsmen", selected)}
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
          options={squadB}
          value={allroundersB}
          onChange={(selected) =>
            handleRoleSelect("B", "allrounders", selected)
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
          options={squadB}
          value={bowlersB}
          onChange={(selected) => handleRoleSelect("B", "bowlers", selected)}
          placeholder="Select Bowlers"
          closeMenuOnSelect={false}
          isSearchable
          maxMenuHeight={200}
        />
      </div>

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

      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
