import './App.css';
import { useState } from "react";

const { WordEntryArea } = require('./presentation/WordEntry.js');
const { GameStateDisplayArea } = require('./presentation/GameState');

// region Mocked Dependencies

const getLetters = () => "abcdef";

const getLanguage = () => "fr";

// endregion

// region Utils

const getLineHeightForHeight = (height) => {
  return Math.round(height * 2 / 3)
}

// endregion


function App() {
  const [startDate] = useState(Date.now());
  const [duration] = useState(60000);

  const submitWord = (word) => {
    return "submitted " + word
  }

  return (
    <div className="AppContainer">
      <div className="App">
        <header>
          <p>
            Anagrammes
          </p>
        </header>
        <GameStateDisplayArea startDate={startDate} duration={duration} timeLeft="0:23" score="0000"/>
        <WordEntryArea letters={getLetters().toUpperCase().split("")} submitWord={submitWord}/>
        <footer/>
      </div>
    </div>
  );
}

export default App;
