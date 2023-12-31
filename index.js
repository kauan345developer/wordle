const MAX_LETTER_PER_ROW = 5
const MAX_COLUMN_PER_ROUND = 6
const BtnReset = document.getElementById("BtnReset")

let end = false

const gameInitialConfig = {
  currentRow:1,
  currentLetter:1,
  actualGuess: "",
  rightWord:""
}

function isAphalbetic(key){
  return key.length === 1 && /[A-Za-z]/.test(key)
}

function isBackSpace(key){
  return key === "Backspace" 
}

function isEnter(key){
  return key === "Enter"
}

function Validkey(key,game) {
  if (end) {
    return
  }
  else if(isAphalbetic(key)){
    putLetterOnTheBoard(key,game)
  }
  else if (isBackSpace(key)){
    removeLetterFromtheBoard(game)
  }
  else if(isEnter(key)){
    pressEnter(game,game.database)
  }
  else{
    return console.log("tecla invlaida")
  }
}
function getKeyboardKeys(game){
  const keyboardKeys = document.querySelectorAll(".charKey")
  keyboardKeys.forEach((ev) => ev.addEventListener("click",(ev) => 
  { 
  if(end){
    return
  }
   else if(isEnter(ev.target.dataset.word)){
    pressEnter(game,game.database)
  }
  else if (isBackSpace(ev.target.dataset.word)){
    removeLetterFromtheBoard(game)
  }
  else if(isAphalbetic(ev.target.dataset.word)){
    putLetterOnTheBoard(ev.target.dataset.word,game)}
  }))
  
}

const reset = (game) => {
  BtnReset.addEventListener("click",() => {
  document.querySelectorAll(".lines div").forEach((ev) => {
    ev.textContent = ""
 
    ev.classList.remove("correct")
    ev.classList.remove("empty")
    ev.classList.remove("wrong")
  })

  game.rightWord = getRandomWord(game.database)

  game.currentRow = 1
  game.currentLetter=1
  game.actualGuess = ""

  console.log(game.rightWord)

  document.querySelectorAll(".charKey").forEach((ev) => {
    ev.classList.remove("correct")
    ev.classList.remove("empty")
    
  })
  BtnReset.style.display = "none"
  end = false
})}

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
  
  if(rightGuess(game)){
    putColor(game)
    end = true
    setTimeout(() => alert("voce ganhou"))
    return BtnReset.style.display = "block"
  }

  putColor(game)

  

}

function rightGuess(game){
  return game.actualGuess === game.rightWord
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
  const keyboard = document.querySelectorAll(".charKey")

  for (let index = 0; index < MAX_LETTER_PER_ROW ; index++) {
    const element = getGameLetterFromBoard(index+1,currentRow)

    if(actualGuess[index] === rightWord[index]){
      element.classList.add("correct")
      const letter = actualGuess[index]

      keyboard.forEach((param) => {
        if(param.dataset.word === letter){
          param.classList.remove("empty")
          param.classList.add("correct")
        }
      })
    }  
    else if(rightWord.includes(actualGuess[index])){
      const letter = actualGuess[index]
      element.classList.add("empty")

      keyboard.forEach((param) => {
        if(param.dataset.word === letter){
          param.classList.remove("correct")
          param.classList.add("empty")
        }
      })
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


const start = async () => {
  const database  = await loadWords()
  const chosenWord = getRandomWord(database)
  const rightWord = chosenWord
  const game = {...gameInitialConfig,database,rightWord}
  console.log(game)
  document.addEventListener('keydown',(ev) => Validkey(ev.key, game))
  getKeyboardKeys(game)
  reset(game)
}

start()
