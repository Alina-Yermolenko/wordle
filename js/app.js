import {
  dictionary
} from './dictionary.js';

const tiles = document.querySelector('.tiles-container');
const check = document.querySelector('.button-check');
const reset = document.querySelector('.button-reset');

let startAttempts = 6;
let wordLength = 5;

class Game {
  constructor() {
    this.attempts = startAttempts;

    this.rows = [];

    this.keypressListener = this.keypressListener.bind(this);
    this.check = this.check.bind(this);
    this.reset = this.reset.bind(this);
  }

  setup() {
    for (let i = 0; i < this.attempts; i++) {
      this.rows.push(new Word(i, tiles));
    }
  }

  clear() {
    this.rows = [];
    this.attempts = startAttempts;
    tiles.innerHTML = '';
    window.removeEventListener('keydown', this.keypressListener);
    check.removeEventListener('click', this.check);
    reset.removeEventListener('click', this.reset);
  }

  setCurrentWord() {
    this.currentWord = getRandomWord();
    return this.currentWord;
  }

  startNewGame() {
    this.setCurrentWord();

    this.clear();
    this.setup();

    window.addEventListener('keydown', this.keypressListener);
    check.addEventListener('click', this.check);
    reset.addEventListener('click', this.reset);
  }

  keypressListener(el) {
    let letterKey = el.key.toLowerCase();
    let alphabet = 'бвгґджзклмнпрстфхцчшщйаеєиіїоуюяь';
    if (alphabet.includes(letterKey)) {
      this.insertKey(letterKey);
    }

    if (letterKey === 'enter') {
      this.check()
    }
    if (letterKey === 'backspace') {
      this.removeKey();
    }
  }


  insertKey(key) {
    let index = startAttempts - this.attempts;
    this.rows[index].addLetter(key);
  }

  removeKey() {
    let index = startAttempts - this.attempts;
    this.rows[index].removeLetter();
  }

  getLastWord() {
    let index = startAttempts - this.attempts;
    let lastrow = this.rows[index];
    let lastWord = lastrow.getWord();
    return lastWord;
  }

  check() {
    let written = this.getLastWord();
    let index = startAttempts - this.attempts;
    let lastrow = this.rows[index];
    if (!dictionary.includes(written)) {
      alert('Слово не існує');
    }
    if (written.length === wordLength && written && dictionary.includes(written)) {
      for (let i = 0; i < this.currentWord.length; i++) {
        let currentCell = lastrow.letters[i];
        let currentLetter = currentCell.letter;

        if (this.currentWord[i] === currentLetter) {
          currentCell.addClass('green');
        } else if (this.currentWord.includes(written[i])) {
          currentCell.addClass('yellow');
        } else {
          currentCell.addClass('grey');
        }
        // document.getElementById("letter").animate([
        //   // keyframes
        //   { transform: 'translateY(0px)' },
        //   { transform: 'translateY(-300px)' }
        // ], {
        //   // timing options
        //   duration: 1000,
        //   iterations: Infinity
        // });
      }

      if (written === this.currentWord) {
        this.won();
      } else if (written !== this.currentWord && this.attempts > 1) {
        this.attempts--;
      } else if (written !== this.currentWord && this.attempts === 1) {
        this.fail();
      }
    }
  }

  won() {
    alert('Перемога!');
  }

  fail() {
    alert(`Невдача, слово ${this.currentWord.toUpperCase()}`)
  }

  reset() {
    GAME.startNewGame();
  }

}


class Word {
  constructor(index, parent) {
    this.id = index;
    this.parent = parent;
    this.letter = this.letterKey;

    this.letters = [];

    this.setup();
  }
  setup() {
    let word = this.renderHTML();
    this.word = this.parent.appendChild(word);

    for (let i = 0; i < wordLength; i++) {
      this.letters.push(new Letter(i, this.word));
    }
  }

  renderHTML() {
    let row = document.createElement('div');
    row.classList.add('row');
    row.classList.add(`row-${this.id}`);
    return row;
  }

  addLetter(letter) {
    let emptycellindex = this.findFirstIndexEmptyCell();
    if (emptycellindex) {
      this.letters[emptycellindex].setLetter(letter);
    }
  }

  getWord() {
    let word = '';
    for (let letterObj of this.letters) {
      word += letterObj.letter;
    }
    return word;
  }

  removeLetter() {
    let fullcellindex = this.findLastIndexFullCell();
    if (fullcellindex === 0 || fullcellindex > 0) {
      this.letters[fullcellindex].setLetter('');
    }
  }

  findLastIndexFullCell() {
    for (let cellindex = this.letters.length - 1; cellindex >= 0; cellindex--) {
      if (this.letters[cellindex].letter) {
        return cellindex;
      }
    }
    return false;
  }

  findFirstIndexEmptyCell() {
    for (let cellindex in this.letters) {
      if (!this.letters[cellindex].letter) {
        return cellindex;
      }
    }
    return false;
  }
}

class Letter {
  constructor(index, parent) {
    this.id = index;
    this.word = parent;
    this.letter = '';

    this.setup();
  }
  setup() {
    let letter = this.renderHTML();
    this.cell = this.word.appendChild(letter);
  }
  renderHTML() {
    let letter = document.createElement('div');
    letter.classList.add('letter');
    letter.classList.add(`letter-${this.id}`);
    return letter;
  }
  setLetter(key) {
    this.letter = key;
    this.cell.textContent = this.letter;
  }

  addClass(className) {
    this.cell.classList.add(className);
  }
}

function getRandomWord() {
  let wordindex = getRandomInt(dictionary.length);

  return dictionary[wordindex];
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const GAME = new Game();

GAME.startNewGame();
