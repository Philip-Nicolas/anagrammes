import './App.css';
import { useState } from "react";
import { words } from "./words/en-arr";
// import { words } from "./words/ar-arr";

const { getAllowedWords } = require('./words/utils');

const { WordEntryArea } = require('./presentation/WordEntry.js');
const { GameStateDisplayArea } = require('./presentation/GameState');

// region Mocked Dependencies

const getLetters = () => "abcdef";
// const getLetters = () => "ابتبجح";

const getLanguage = () => "fr";

// endregion

// region Utils

const getLineHeightForHeight = (height) => {
  return Math.round(height * 2 / 3)
}

// endregion
const wordsArray = words.toString().split("\n").filter(word => word.length <= 6);

const scoreWord = (word) => {
  const scores = {
    3: 100,
    4: 400,
    5: 1200,
    6: 2000,
  }

  return scores[word.length] || 0;
}


const letters = getLetters();
const allowedWords = getAllowedWords(getLetters(), wordsArray);


function App() {
  const [startDate] = useState(Date.now());
  const [duration] = useState(60000);

  const [score, setScore] = useState(0);
  const [usedWords, setUsedWords] = useState([]);

  console.log(allowedWords)

  const submitWord = (word) => {
    if (usedWords.includes(word)) {
      return "Already used " + word + "!"
    }
    if (word.length === 0) {
      return "Enter a word!"
    }
    if (word.length < 3) {
      return "Too short!"
    }
    if (!allowedWords.includes(word.toLowerCase())) {
      return "Not a Word!"
    }

    const newUsedWords = [...usedWords];
    newUsedWords.push(word);
    setUsedWords(newUsedWords);
    setScore(score + scoreWord(word))
    return `Submitted ${word}!`;
  }

  return (
    <div className="AppContainer">
      <div className="App">
        <header>
          <p>
            Anagrammes
          </p>
        </header>
        <GameStateDisplayArea startDate={startDate} duration={duration} timeLeft="0:23"
                              score={`${score}`.padStart(4, "0")}/>
        <WordEntryArea letters={letters.toUpperCase().split("")} submitWord={submitWord}/>
        <footer/>
      </div>
    </div>
  );
}

export default App;
