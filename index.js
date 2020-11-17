const randomWords = require('random-english-words')
const prompt = require('prompt-sync')()

class State {
  constructor() {
    this.newGame()
    State.instance = this
  }

  static getInstance() {
    if (!State.instance) {
      State.instance = new State()
    }
    return State.instance
  }

  newGame(randomWord = randomWords()) {
    this.randomWord = randomWord
    this.randomWordChars = []
    this.hp = 10
    this.win = false
    this.guesses = []
    this.guessesCount = 0

    for (let i = 0; i < randomWord.length; i++) {
      if (!this.randomWordChars.includes(randomWord[i])) {
        this.randomWordChars.push(randomWord[i])
      }
    }
  }
}

function play() {
  const state = State.getInstance()

  state.newGame()

  while (state.hp > 0 && state.win === false) {
    playRound()
  }

  console.log(`\n`)

  if (state.win) {
    console.log(`Congratulations you won!\n The word was ${state.randomWord}.\n It took you ${state.guessesCount} tries`)
  } else {
    console.log(`Unfortunately you did not guess the word.\n The word was ${state.randomWord}.`)
  }
}

function playRound() {
  const state = State.getInstance()

  let secretWord = ''

  for (let i = 0; i < state.randomWord.length; i++) {
    if (state.guesses.includes(state.randomWord[i])) {
      secretWord += state.randomWord[i]
    } else {
      secretWord += '_ '
    }
  }

  console.log(`\n`)
  console.log(`Secret word: ${secretWord}`)
  console.log(`You have ${state.hp} guesses remaining!`)
  console.log(`Alreay guessed: ${state.guesses.sort()}`)

  const promptGuess = prompt('Enter a letter or guess the word: ')
  if (!promptGuess) return false
  const guess = promptGuess.trim().toLowerCase()

  if (state.guesses.includes(guess)) {
    console.log(`You have already guessed ${guess}!\n Guess something else!`)
    return false
  }

  state.guesses.push(guess)
  state.guessesCount++

  if (guess === state.randomWord) {
    state.win = true
  } else if (state.randomWordChars.includes(guess)) {
    const check = state.randomWordChars.every((char) => state.guesses.includes(char))
    if (check) {
      state.win = true
    } else {
      console.log(`The letter ${guess} is in the secret word!`)
    }
  } else {
    if (guess.length > 1) {
      console.log(`${guess} is not the secret word!`)
    } else {
      console.log(`Character ${guess} is not in the secret word!`)
    }
    state.hp--
  }

  if (guess === 'exit') state.hp = 0
}

play()