var grid;
let paused = false;
let genNum = 1;

function setup () {
  createCanvas(500, 400);
  grid = new Grid(10);
  grid.randomize();
  
  pauseButton = new MenuItem("Pause", 0, color(200, 0, 200), 20, pauseGame);
  resetButton = new MenuItem("Reset", 55, color(200, 0, 200), 20, resetBoard);
  cellCount = new MenuItem("0", 110, color(200, 0, 200), 15);
  genCount = new MenuItem("0", 165, color(200, 0, 200), 15);
  
  //Print Statements
  print("Getting the reset button to not alternate colors when pressed. It seems like a simple fix looking back on it now, but in the moment I could not figure it out.");
  print("Somewhat, for awhile I was teetering on the edge of only doing two of the challenges, but I pushed through and enjoyed finishing two more.");
  print("This would be a cool addition to my portfolio.");
  print("As of now I don't have a huge number of projects in my portfolio so any addition helps. I also feel like having a portfolio with some projects that are more on the less serious / more fun side can prevent your portfolio from being boring.");
}

function draw () {
  background(230);
  if(paused === false) {
    +grid.updateNeighborCounts();
    grid.updatePopulation();
    
    genNum++;
  }
  grid.draw();
  
  pauseButton.draw();
  resetButton.draw();
  cellCount.text = "Living:" + grid.getNumAliveCells();
  cellCount.draw();
  genCount.text = "Gen#:" + genNum;
  genCount.draw();
}

function pauseGame() {
  if(paused) {
    paused = false;
    this.buttonColor = 240;
  }
  else {
    paused = true;
    this.buttonColor = 200;
  }
}

function resetBoard() {
  
  grid = new Grid(10);
  grid.randomize();
  genNum = 1;
  
}

class MenuItem {
  constructor (text, yPosition, textColor, fontSize, action) {
  
    this.xPosition = width-98;
    this.yPosition = yPosition;
    this.text = text;
    this.action = action;
    this.buttonColor = 240;  
    this.fontSize = fontSize;
    
  }
  
  draw() {
    fill(this.buttonColor);
    rect(width-98, this.yPosition, 100, 50);
    
    textSize(this.fontSize);
    
    fill(100, 0, 100);
    text(this.text, this.xPosition + 20, this.yPosition + 32);
  }
  
  isClicked(x, y) {
    if((x > this.xPosition && x < this.xPosition + 100) && (y > this.yPosition && y < this.yPosition + 50)) {
      
      this.action();
      
    }
  }
  
}

class Cell {
  constructor (column, row, size) {
    
    this.isAlive = false
    this.column = column;
    this.row = row;
    this.size = size;
    this.liveNeighborCount = 0;
    
  }
  
  liveOrDie() {
    if(this.liveNeighborCount < 2) {
      this.isAlive = false;
    }
    if(this.liveNeighborCount > 3) {
      this.isAlive = false;
    }
    if(this.liveNeighborCount === 3) {
      this.isAlive = true;
    }
  }
  
  setIsAlive(value) {
    if(value) {
      this.isAlive = true;
    }
    else {
      this.isAlive = false;
    }
  }
  
  draw() {
    if(this.isAlive) {
      fill(200, 0, 200);
    }
    else {
      fill(240);
    }
    noStroke();
    rect(this.column * this.size + 1, this.row * this.size + 1, this.size - 1, this.size - 1);
  }
}

class Grid {
  constructor (cellSize) {
    // update the contructor to take cellSize as a parameter
    // use cellSize to calculate and assign values for numberOfColumns and numberOfRows
    this.numberOfColumns = Math.floor((width-100)/cellSize);
    this.numberOfRows = height/cellSize;
    this.cellSize = cellSize;
    
    this.cells = new Array(this.numberOfColumns);
    for(var i = 0;i < this.numberOfColumns; i++) {
      this.cells[i] = new Array(this.numberOfRows)
    }
    
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        this.cells[column][row] = new Cell(column, row, cellSize);
      }
    }
  }
  
  getNumAliveCells() {
    let liveOnes = 0;
    
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        if(this.cells[column][row].isAlive) {
          liveOnes += 1;
        }
      }
    }
    
    return liveOnes;
  }
  
  updateNeighborCounts() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        
        this.cells[column][row].liveNeighborCount = 0;
        let neighborList = this.getNeighbors(this.cells[column][row]);

        for(var i = 0; i < neighborList.length; i++) {
          if(neighborList[i].isAlive) {
            this.cells[column][row].liveNeighborCount += 1;
          }
        }
      }
    }
  }
  
  isValidPosition(column, row) {
    
    return (row >= 0 && row < this.cells.length) && (column >= 0 && column < this.cells[0].length);
    
  }
  
  getNeighbors(currentCell) {
    
    let neighborList = [];
    
    for (var xOffset = -1; xOffset <= 1; xOffset++) {
      for (var yOffset = -1; yOffset <= 1; yOffset++) {
        
        var neighborColumn = currentCell.column + xOffset;
        var neighborRow = currentCell.row + yOffset;
        
        if(this.isValidPosition(neighborColumn, neighborRow) && !(neighborColumn === currentCell.column && neighborRow === currentCell.row)) {
        
          neighborList.push(this.cells[neighborColumn][neighborRow]);
          
        }
        
      }
    }
    
    return neighborList;
  }
  
  updatePopulation() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        
        this.cells[column][row].liveOrDie();
        
      }
    }
  }
  
  randomize() {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        
        this.cells[column][row].setIsAlive(Math.floor(random(2)));
        
      }
    }
  }

  draw () {
    for (var column = 0; column < this.numberOfColumns; column ++) {
      for (var row = 0; row < this.numberOfRows; row++) {
        
        this.cells[column][row].draw();
        
      }
    }
  }
}

function mousePressed() {
  pauseButton.isClicked(mouseX, mouseY);
  resetButton.isClicked(mouseX, mouseY);
}