import './App.css';
import { useMemo, useState } from "react";

const { AnagrammesGenerator, AnagrammesManager, AnagrammesGameState } = require('./words/AnagrammesGame');

const { WordEntryArea } = require('./presentation/WordEntry.js');
const { GameStateDisplayArea } = require('./presentation/GameState');

function App() {
  const game = useMemo(() => AnagrammesGenerator.getEnglishTestGame(), []);
  const [gameState, setGameState] = useState(new AnagrammesGameState(game));

  const submitWord = (word) => {
    const submissionResult = AnagrammesManager.submitWord(gameState, word);
    setGameState(submissionResult.gameState);
    return submissionResult;
  }

  return (
    <div className="AppContainer">
      <div className="App">
        <header>
          <p>
            Anagrammes
          </p>
        </header>
        <GameStateDisplayArea gameState={gameState}/>
        <WordEntryArea letters={game.setup.letters.split("")} submitWord={submitWord}/>
        <footer/>
      </div>
    </div>
  );
}

export default App;
