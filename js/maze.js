var maze_data;
var tilesize = 32;

document.addEventListener("DOMContentLoaded", function() {
    Init();
    AddHandlers();
}, false);

function Init() {
    var c = document.getElementById("maze-container");
    maze_data = CreateArray(c.width, c.height, tilesize);
}

function AddHandlers() {
    var can = document.getElementById("maze-container");

    can.addEventListener("click", function(e) {
        switch (e.keyCode) {
            case 0:
                var tile = GetTileInfo(can);
                PopulateTile(tile.x, tile.y, tile.height, tile.type)
                Render();
                break;
        }
    }, false);
}

function RemoveTile(x, y, array) {
    if (typeof array[x][y] === undefined) return false;
    else {
        array[x][y] = {};
        return true;
    }
}

function GetTileInfo(canvas) {
    /* Get information of the tile:
		- Height
		- Type
	*/
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((event.clientX - rect.left) / tilesize),
        y: Math.floor((event.clientY - rect.top) / tilesize),
        height: 20,
        type: 'Wall'
    }
}

function ClickHandler(canvas, event) {
    var coords = GetMousePosition(canvas, event)
    return coords
}

function CreateArray(width, height, tilesize) {
    var array = [];

    for (var x = 0; x < (width / tilesize); x++) {
        array[x] = [];
        for (var y = 0; y < (height / tilesize); y++) {
            array[x][y] = null;
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

function PopulateTile(x, y, h, t) {
    var temp = new Tile(x, y, h, t);

    maze_data[x][y] = temp;
}

function Render() {
    return true;
}