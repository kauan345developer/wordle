const MAX_LETTER_PER_ROW = 5
const MAX_COLUMN_PER_ROUND = 6

function isAphalbetic(key){
  return key.length === 1 && /[A-Za-z]/.test(key)
}

function isBackSpace(key){
  return key === "Backspace" 
}

function isEnter(key){
  return key === "Enter"
}

function Validkey(key,game,database) {
  if(isAphalbetic(key)){
    putLetterOnTheBoard(key,game)
  }
  else if (isBackSpace(key)){
    removeLetterFromtheBoard(game)
  }
  else if(isEnter(key)){
    pressEnter(game,database)
  }
  else{
    
  }
}

function getGameLetterFromBoard(currentLetter,currentRow){
  return document.querySelector(`.all-lines .line-${currentRow} .letter-${currentLetter}`)
}

function putLetterOnTheBoard(key,game){
  if(game.currentLetter > MAX_LETTER_PER_ROW){
    alert("aa")
  }
  else{
  const {currentLetter,currentRow} = game

  const element = getGameLetterFromBoard(currentLetter,currentRow)
  element.textContent = key

  game.currentLetter++
  game.actualGuess += key
  }
  
}

function removeLetterFromtheBoard(game){
  if (game.currentLetter > 1){
  const {currentLetter,currentRow} = game

  const element = getGameLetterFromBoard(currentLetter-1,currentRow)
  element.textContent = ""

  game.currentLetter--
  game.actualGuess = game.actualGuess.slice(0,-1)
  }
}

 function worldInDatabase(game,database){
  return database.includes(game.actualGuess.toLowerCase())
}

function completeRow(game){
  return game.currentLetter === 6
}



function pressEnter(game,database){

  if(!completeRow(game)){
    return alert("palvra incompleta")
  }

  if(!worldInDatabase(game,database)){
  return alert("esta palvra não existe")
}
  
  putColor(game)

  
}

function rightGuess(game){
  return game.actualGuess === game.rightWord
}

const gameInitialConfig = {
  currentRow:1,
  currentLetter:1,
  actualGuess: "",
  rightWord:""
}

function getRandomWord(words){
    const RamdomIndex = Math.floor(Math.random() * words.length)
    return words[RamdomIndex]
  }

async function loadWords(){
  return fetch('./assets/json/database.json')
                  .then((response) => response.json())
                  .then(({ words }) => words)
                  .catch(() => [])
}

function putColor(game){

  const {currentRow,rightWord,actualGuess} = game
  
  for (let index = 0; index < MAX_LETTER_PER_ROW ; index++) {
    const element = getGameLetterFromBoard(index+1,currentRow)
    if(actualGuess[index] === rightWord[index]){
      element.classList.add("correct")
    }  
    else if(rightWord.includes(actualGuess[index])){
      element.classList.add("empty")
    }
    else{
      element.classList.add("wrong")
    }
  }
  console.log(game.actualGuess)
  game.currentRow++
  game.currentLetter = 1
  game.actualGuess =""
}


window.onload = async () => {
  const database  = await loadWords()
  const chosenWord = getRandomWord(database)
  console.log(chosenWord)
  gameInitialConfig.rightWord = chosenWord
  document.addEventListener('keydown',(ev) => Validkey(ev.key, gameInitialConfig,database))
}


