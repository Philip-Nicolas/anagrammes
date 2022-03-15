/*
 * Anagrammes game setup as described in README
 */

class AnagrammesGenerator {
  static GENERATOR_VERSION = "0.0.1";
  static DEFAULT_DURATION = 60000;
  static DEFAULT_WORD_SCORES_BY_LENGTH_6_LETTERS = {
    3: 100,
    4: 400,
    5: 1200,
    6: 2000,
  };
  static DEFAULT_MINIMUM_WORD_LENGTH_6_LETTERS = 3;

  /*
   * Specifies format for game setup.
   * Includes information that is Absolutely Necessary to describe the game.
   */
  static createSetup = (letters, words, duration, wordScoresByLength, minimumWordLength) => {
    return {
      letters,
      words,
      duration,
      wordScoresByLength,
      minimumWordLength,
    }
  }

  /*
   * Specifies format for metadata.
   * Includes useful but not Absolutely Necessary information about the game.
   */
  static createMeta = (language, dictionaryName, gameVersion) => {
    return {
      language,
      dictionaryName,
      gameVersion,
      generatorVersion: AnagrammesGenerator.GENERATOR_VERSION,
    }
  }

  static createGame = (setup, meta) => {
    return {
      setup,
      meta,
    }
  }


  static getEnglishTestGame = () => {
    return this.createGame(
      this.createSetup(
        "abcdef", [
          "abed",
          "ace",
          "aced",
          "bad",
          "bade",
          "bead",
          "bed",
          "cab",
          "cad",
          "cafe",
          "dab",
          "dace",
          "deaf",
          "deb",
          "decaf",
          "def",
          "fab",
          "face",
          "faced",
          "fad",
          "fade",
          "fed",
        ], this.DEFAULT_DURATION, this.DEFAULT_WORD_SCORES_BY_LENGTH_6_LETTERS, this.DEFAULT_MINIMUM_WORD_LENGTH_6_LETTERS),
      this.createMeta(
        "en"
      )
    )
  }
}

class GameState {
  constructor(game) {
    this.game = game;
    this.playedWords = [];
    this.startTime = Date.now();
  }

  timeLeft() {
    return this.startTime + this.game.setup.duration - Date.now();
  }

  isTimeUp() {
    return this.timeLeft() <= 0;
  }

  static copy(gameState) {
    const gameStateCopy = new GameState(gameState.game);
    gameStateCopy.playedWords = [...gameState.playedWords];
    gameStateCopy.startTime = gameState.startTime;

    return gameStateCopy;
  }
}

class GameManager {
  static FEEDBACK_MESSAGES = {
    "en": {
      tooShort: () => "Too Short!",
      notInWordList: () => "Not in Word List!",
      timeIsUp: () => `Time's Up!`,
      alreadyPlayed: (word) => `Already played ${word}!`,
      submitted: (word) => `Submitted ${word}!`,
    }
  }

  static submitWord = (gameState, word) => {
    gameState = GameState.copy(gameState);
    const { setup, meta } = gameState.game;

    // Return score 0 with message specifying why word is invalid.
    if (word.length < setup.minimumWordLength) {
      return {
        score: 0,
        feedback: this.FEEDBACK_MESSAGES[meta.language].tooShort(word),
        gameState,
      }
    }
    if (gameState.playedWords.includes(word)) {
      return {
        score: 0,
        feedback: this.FEEDBACK_MESSAGES[meta.language].alreadyPlayed(word),
        gameState,
      }
    }
    if (!setup.words.includes(word)) {
      return {
        score: 0,
        feedback: this.FEEDBACK_MESSAGES[meta.language].notInWordList(word),
        gameState,
      }
    }
    if (gameState.isTimeUp()) {
      return {
        score: 0,
        feedback: this.FEEDBACK_MESSAGES[meta.language].timeIsUp(word),
        gameState,
      }
    }

    // Otherwise, play word and score according to game's scoring scheme.
    gameState.playedWords.push(word);
    return {
      score: this.getWordScore(gameState.game, word),
      feedback: this.FEEDBACK_MESSAGES[meta.language].submitted(word),
      gameState,
    }
  }

  static getWordScore(game, word) {
    return game.setup.wordScoresByLength[word.length]
  }

  static getScore = (gameState) => {
    return [0, ...gameState.playedWords]
      .reduce((sum, word) => sum + this.getWordScore(gameState.game, word));
  }
}


module.exports = {
  AnagrammesGenerator: AnagrammesGenerator,
  AnagrammesGameState: GameState,
  AnagrammesManager: GameManager,
}