// Import npm packages
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

    // Generated random word
    this.randomWord = randomWord

    // Holds unique randomWord chars
    this.randomWordChars = []

    // User's lives
    this.hp = 10

    // If true then user has won the game
    this.win = false

    // Guessed words
    this.guesses = []

    // Amount of guesses the user has made
    this.guessesCount = 0

    // Puts every unique randomWord's char into a string
    for (let i = 0; i < randomWord.length; i++) {
      if (!this.randomWordChars.includes(randomWord[i])) {
        this.randomWordChars.push(randomWord[i])
      }
    }
  }
}

// Game area
function play() {
  const state = State.getInstance()

  state.newGame()

  // Game lasts until user has won the game or doesnt have enough health (hp)
  while (state.hp > 0 && state.win === false) {
    playRound()
  }

  // Creates a space between
  console.log(`\n`)

  // Gives user feedback after the game ends
  if (state.win) {
    console.log(`Congratulations you won!\n The word was ${state.randomWord}.\n It took you ${state.guessesCount} tries`)
  } else {
    console.log(`Unfortunately you did not guess the word.\n The word was ${state.randomWord}.`)
  }
}

// game rounds
function playRound() {
  const state = State.getInstance()

  let secretWord = ''

  // Creates a game area display
  for (let i = 0; i < state.randomWord.length; i++) {
    if (state.guesses.includes(state.randomWord[i])) {
      secretWord += state.randomWord[i]
    } else {
      secretWord += '_ '
    }
  }

  // Show's user game state
  console.log(`\n`)
  console.log(`Secret word: ${secretWord}`)
  console.log(`You have ${state.hp} guesses remaining!`)
  console.log(`Alreay guessed: ${state.guesses.sort()}`)

  // Asks user input and changes it to the lowercase
  const promptGuess = prompt('Enter a letter or guess the word: ')
  if (!promptGuess) return false
  const guess = promptGuess.trim().toLowerCase()

  // Checks if user has already made the same guess
  if (state.guesses.includes(guess)) {
    console.log(`You have already guessed ${guess}!\n Guess something else!`)
    return false
  }

  // Adds a +1
  state.guesses.push(guess)
  state.guessesCount++

  // Checks user's guess. If the user guessed the whole word at once
  if (guess === state.randomWord) {
    state.win = true

  // If the guess was correct
  } else if (state.randomWordChars.includes(guess)) {
    const check = state.randomWordChars.every((char) => state.guesses.includes(char))

    // If the user has guessed every randomWord's char
    if (check) {
      state.win = true
    } else {
      console.log(`The letter ${guess} is in the secret word!`)
    }
  } else {

    // Gives user negative feedback
    if (guess.length > 1) {
      console.log(`${guess} is not the secret word!`)
    } else {
      console.log(`Character ${guess} is not in the secret word!`)
    }

    // Takes -1 hp
    state.hp--
  }

  // Ends the game when user guessed 'exit'
  if (guess === 'exit') state.hp = 0
}

play()