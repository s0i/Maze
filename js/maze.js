var TileTypeSprite = {
    Floor: '../assets/Star100.png' /* Floor sprite path */ ,
    Wall: '' /* Wall sprite path */
}

var TileType = {
    Floor: 'Floor',
    Wall: 'Wall'
}

var maze_data;
var tilesize = 32;
var currentTileType = TileType.Wall;

document.addEventListener("DOMContentLoaded", function() {
    $('#about-maze').dialog({
        autoOpen: false
    });
    Init();
    AddHandlers();
}, false);

function Init() {
    var c = document.getElementById("maze-container");
    maze_data = CreateArray(c.width, c.height, tilesize);
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
        RemoveTile(tile.x, tile.y, maze_data, e);
    }, false);

    about.addEventListener("click", function() {
        $('#about-maze').dialog('isOpen') ? $('#about-maze').dialog('close') : $('#about-maze').dialog('open');
    }, false);
}

function RemoveTile(x, y, array) {
    typeof array[x][y] === undefined || null ? array[x][y] = new Tile() : array[x][y] = new Tile();
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
            array[x][y] = new Tile(x, y, 0, TileType.Floor);
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

    for (var tile in maze_data) {
        if (tile === undefined || null) {
            tile.type = TileType.Floor;
            var img = TileTypeSprite.Floor;
            c.drawImage(img, tile.x, tile.y)
        } else {
            var img = new Image();
            tile.type = TileType.Wall ? img.src = TileTypeSprite.Wall : img.src = TileTypeSprite.Floor;
            c.drawImage(img, tile.x, tile.y);
        }
    }
    return true;
}