// Get the modal and buttons
var modal = document.getElementById('add-part');
var openModalBtn = document.getElementById('openModalBtn');
var closeModalBtn = document.getElementById('closeModalBtn');

// Open the modal
openModalBtn.onclick = function() {
    modal.style.display = 'block';
}

// Close the modal
closeModalBtn.onclick = function() {
    modal.style.display = 'none';
}

// Close the modal if the user clicks outside the modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// List of players' names
var players = [];
// Amount of players 
var players_quantity = 0;
// Name and numbers of new player
var name;
var numbers;
// Number drawn in the game
var number_drawn;
// Already drawn numbers
var drawnNumbers = []; 

// alert("-------------REGRAS \n • O limite de jogadores é 6 \n • O máximo de números por jogador é 10 \n • Os números escolhidos devem estar entre 0 - 20 \n • O jogador deve cadastrar todos os seus números de uma vez \n • O nome deve ter no máximo 8 caracteres \n • Dois jogadores não podem ter o mesmo nome \n • O mesmo jogador não pode escolher o mesmo número duas vezes \n --- May the odds be ever in your favour :)");

function addPart() {
  // Gets information from the inputs 
  name = document.getElementById("add-p-name").value;
  numbers = document.getElementById("add-p-numbers").value;
  numbers = numbers.split(",", 9);
  // Limits to 5 players per game
  if (players_quantity >= 5) {
    alert("This round is full.");
  } else if (numbers.length != 9) {
    alert("You must choose nine numbers to play.");
  } else {
    // Adds player's name to the list
    players.push(name);
    // Validates the player's name (must be unique)
    if (sameNamePlayer()&&name!=="") {
      // Validates the player's numbers (each number only once)
      if (sameNumberTwice()) {
        // Validates the player's numbers (must be in the 1-60 range)
        if (numberOutOfRange()) {
          players_quantity++;
          // Writes player's name in their header
          var player_header =  document.getElementById("h"+players_quantity);
          player_header.innerHTML = name;
          // Writes player's numbers in their table
          var a = 0;
          for (var i = 1; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
              var cell = document.getElementById("c"+players_quantity+i+j);
              cell.innerHTML = parseInt(numbers[a]);
              a++;
            }
          }
          // Empties variables
          name = "";
          numbers = [];
          document.getElementById("add-p-name").value = "";
          document.getElementById("add-p-numbers").value = "";
        } else {
          alert("You can only pick each number once.");
          players.pop();
        }
      } else {
        alert("Some of your numbers don't follow the rules.");
        players.pop();
      }
    } else {
      alert("Pick another name.");
      players.pop();
    }
  }
}

function generatePlayersNumbers() {
  var randomNumbers = [];
  while (randomNumbers.length < 9) {
    var randomNumber = Math.floor(Math.random() * 60) + 1;
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }
  document.getElementById("add-p-numbers").value = randomNumbers;
}

function sameNamePlayer() {
  // Player's name is unique?
  var isUnique = true;
  for (var i = 0; i <= players.length - 1; i++) {
    for (var j = 0; j <= players.length - 1; j++) {
      if (i != j) {
        if (players[i]==players[j]) {
          isUnique = false;
        }
      }
    }
  }
  return isUnique;
}

function numberOutOfRange() {
  // Numbers are in the 1-60 range?
  var isInRange = true;
  for (var i = 1; i <= numbers.length - 1; i++) {
    if (
      parseInt(numbers[i]) > 70 ||
      parseInt(numbers[i]) < 0 ||
      isNaN(parseInt(numbers[i]))
    ) {
      isInRange = false;
    }
  }
  return isInRange;
}

function sameNumberTwice() {
  // Numbers are unique?
  var isUnique = true;
  for (var i = 0; i <= numbers.length - 1; i++) {
    for (var j = 0; j <= numbers.length - 1; j++) {
      if (i != j) {
        if (numbers[i] == numbers[j]) {
          isUnique = false;
        }
      }
    }
  }
  return isUnique;
}

function drawNumber() {
  // Range from 0 to 60, no repeats
  do {
    number_drawn = Math.floor(Math.random() * 60 + 1);
  } while (drawnNumbers.includes(number_drawn) && drawnNumbers.length < 60);
  drawnNumbers.push(number_drawn);
  // Drawn number in the field
  var number_drawn_field = document.getElementById("number-drawn");
  if (drawnNumbers.length > 60){
    number_drawn_field.value = "No numbers left!";
  }else{
    number_drawn_field.value = number_drawn;
  }
  // Checks number in the tables (main and players')
  fillMainTable();
  checkPlayerNumbers();
}

function fillMainTable() {
  // Paints cell with the drawn number
  var main_table = document.getElementById("numbers-table");
  for (i = 0; i < 6; i++) {
    var main_cells = main_table.rows.item(i).cells;
    for (var j = 0; j < 10; j++) {
      var cellValue = parseInt(main_cells.item(j).innerHTML);
      if (cellValue == number_drawn) {
        main_cells[j].style.backgroundColor = "#ede5a0";
      }
    }
  }
}

function checkPlayerNumbers() {
  // Paints player's cells with the drawn number
  // One player at a time
  for (player = 1; player <= players.length; player++) {
    console.log(player)
    var player_table = document.getElementById("table"+player);
    // Checks if the player won (all number are painted)
    var cells_checked = 0; 
    for (var i = 1; i < 4; i++) {
      for (var j = 1; j < 4; j++) {
        var cell = document.getElementById("c"+player+i+j);
        var cellValue = parseInt(cell.innerHTML);
        if (cellValue == number_drawn) {
          // Paints cell
          cell.style.backgroundColor = "#ede5a0";
        }
        if (cell.style.backgroundColor) {
          // Counts how many cells are painted
          cells_checked ++;
        }
      }
    }
    // If 9 of their cells are painted, the player won
    if (cells_checked  == 9) {
        var winner = document.getElementById("h"+player);
        alert(winner.innerHTML + " ganhou! Parabéns :)");
        //novoJogo();
    }
  }
  
}

function novoJogo() {
  location.reload();
}


function remPart() {
  if (players_quantity > 0) {
    if (jogardorExiste()) {
      // pra isso funcionar tem q inverter a array
      players.reverse();
      var a = players.indexOf(document.getElementById("dpart").value);
      document.getElementById("tabela1").deleteRow(a);
      players.splice(a, 1);
      // ai inverte d nv dps de tirar
      players.reverse();
      players_quantity--;
    }
  } else {
    alert("Esse jogador nao existe.");
    // aq é se n tiver jogadores
    // parece redundancia mas tava dando errado
  }
}

function jogardorExiste() {
  // vai checar se o jogador q ta tentando tirar existe
  var vale = false;
  for (var i = 0; i <= players.length - 1; i++) {
    if (document.getElementById("dpart").value == players[i]) {
      vale = true;
    }
  }
  // isso ta meio enrolado mas da crt
  if (vale) {
    return true;
  } else {
    // aq é se o jogador n existir
    alert("Esse jogador nao existe.");
  }
}