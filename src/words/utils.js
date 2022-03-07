
function canMakeWordFromLetters(word, letters) {
  const indices = [];
  for (let letter of word) {
    const i = letters.indexOf(letter);
    if (i === -1 || indices.includes(i)) {
      return false;
    } else {
      indices.push(i);
    }
  }
  return true;
}

function getAllowedWords(letters, allWords) {
  return allWords.filter(w => {
    return canMakeWordFromLetters(w, letters)
  });
}

module.exports = {
  getAllowedWords
}