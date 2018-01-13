var cols = 50;
var rows = 50;
var grid = new Array(cols);

var openSet = [];
var closedSet = [];
var start;
var end;
var w, h;
var path = [];

function removeFromArray(arr, ell) {
    for (var i = arr.length-1; i >= 0; i--) {
        if(arr[i] == ell) {
            arr.splice(i, 1);
        }
    }
}

function heuristic(a, b) {
    var d = dist(a.i, a.j,b.i,b.j);
    return d
}

function setup() {
    createCanvas(400,400);
    console.log('A')

    w = width / cols;
    h = height/ rows;

    setupGrid()
}

function draw() {

    if (openSet.length > 0) {

        var lowestIndex = 0;
        for(var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndex].f) {
                lowestIndex = i;
            }
        }

        var current = openSet[lowestIndex];

        if (current === end) {
            noLoop();
            console.log('DONE!');
        }

        removeFromArray(openSet, current);
        closedSet.push(current);

        var neighbors = current.neighbors;
        for(var i = 0; i < neighbors.length; i++) {
            var neighbor  = neighbors[i];

            if(!closedSet.includes(neighbor) && !neighbor.wall) {
                var tempG = current.g + heuristic(neighbor, current);

                if(openSet.includes(neighbor)) {
                    if (tempG < neighbor.g) {
                        neighbor.g = tempG
                        newPath = true;
                    }
                } else {
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }

                if (newPath) {
                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                  }
            }   
        }
    } else {
        noLoop();
        console.log('no solution')
        return
    }
    background(0);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++){
            grid[i][j].show(color(255)); 
        }
    }
    
    path = [];
    var temp = current;
    while (temp.previous) {
        path.push(temp.previous)
        temp = temp.previous
    }
    
    drawLine()
    

}

function drawLine() {
    noFill();
    stroke(255, 0, 200);
    strokeWeight(w / 2);
    beginShape();
    for (var i = 0; i < path.length; i++) {
        vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
    }
    endShape();
}

function setupGrid() {
    for (var i = 0; i< cols; i ++) {
        grid[i] = new Array(rows)
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++){    
            grid[i][j] = new Spot(i, j)
        }   
    }

    for(var i = 0; i < cols; i++) {
        for(var j = 0; j < rows; j++){    
            grid[i][j].addNeighbors(grid);
        }   
    }

    start = grid[0][0]
    end = grid[cols-1][rows-1]
    start.wall = false;
    end.wall = false
    openSet.push(start);
}