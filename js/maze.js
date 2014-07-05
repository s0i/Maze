document.addEventListener("DOMContentLoaded", function() {
    AddHandlers();
    $('#about-maze').dialog({
        autoOpen: false
    });
    Init();
}, false);

var TileTypeSprite = {
    Floor: '../assets/floor.png' /* Floor sprite path */ ,
    Wall: '../assets/wall.png' /* Wall sprite path */
}

var TileType = {
    Floor: 'Floor',
    Wall: 'Wall',
    Empty: 'Empty'
}

var maze_data;
var tilesize = 32;
var currentTileType = TileType.Floor;

function Init() {
    var c = document.getElementById("maze-container");
    maze_data = CreateArray(c.width, c.height, tilesize);
    Render(c);
}

function AddHandlers() {
    var can = document.getElementById("maze-container");
    var about = document.getElementById("about");
    var aboutMaze = document.getElementById('about-maze');

    can.addEventListener("click", function(e) {
        e.preventDefault();
        switch (e.keyCode) {
            case 0:
                var tile = GetTileInfo(can, e);
                PopulateTile(tile.x, tile.y, tile.height, currentTileType);
                Render(can);
                break;
        }
    }, false);

    can.addEventListener("contextmenu", function(e) {
        e.preventDefault();

        var tile = GetTileInfo(can, e);
        RemoveTile(tile.x, tile.y, maze_data, can);
        Render(can);
    }, false);

    about.addEventListener("click", function() {
        $('#about-maze').dialog('isOpen') ? $('#about-maze').dialog('close') : $('#about-maze').dialog('open');
    }, false);
}

function RemoveTile(x, y, array, canvas) {
    var c = canvas.getContext('2d');

    maze_data[x][y] = new Tile(x, y, 0, TileType.Blank);
    c.rect((x * tilesize), (y * tilesize), tilesize, tilesize);
    c.fillStyle = "#FFFFFF";
    c.fill();
}

function GetTileInfo(canvas, e) {
    var coords = GetMousePosition(canvas, e);
    var tile = [maze_data[coords.x][coords.y].type, maze_data[coords.x][coords.y].height];
    return {
        x: coords.x,
        y: coords.y,
        height: tile[1],
        type: tile[0]
    }
}

function GetMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();

    var x = Math.floor((event.clientX - rect.left) / tilesize);
    var y = Math.floor((event.clientY - rect.top) / tilesize);

    return {
        x: x,
        y: y
    }
}

function CreateArray(width, height, tilesize) {
    var array = [];

    for (var x = 0; x < (width / tilesize); x++) {
        array[x] = [];
        for (var y = 0; y < (height / tilesize); y++) {
            array[x][y] = new Tile(x, y, 0, TileType.Empty);
        }
    }
    return array;
}

function Tile(x, y, height, type) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.type = type;
}

function PopulateTile(x, y, height, type) {
    var tile = new Tile(x, y, height, type);

    maze_data[x][y] = tile;
}

function Render(canvas) {
    var c = canvas.getContext('2d');

    for (var x = 0; x < maze_data.length; x++) {
        for (var i = 0; i < maze_data[x].length; i++) {
            if (maze_data[x][i].type === TileType.Empty) {} else {
                if (maze_data[x][i].type === TileType.Floor) {
                    var img = new Image();
                    img.src = TileTypeSprite.Floor;

                    c.drawImage(img, (maze_data[x][i].x * tilesize), (maze_data[x][i].y * tilesize));
                }

                if (maze_data[x][i].type === TileType.Wall) {
                    var img = new Image();
                    img.src = TileTypeSprite.Wall;

                    c.drawImage(img, (maze_data[x][i].x * tilesize), (maze_data[x][i].y * tilesize));
                }
            }
        }
    }
}

function GetMazeData() {
    var array = [];

    for (var x = 0; x < maze_data.length; x++) {
        for (var y = 0; y < maze_data[x].length; y++) {}
    }
    return array;
}