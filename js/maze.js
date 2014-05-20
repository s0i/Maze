var maze_data;
var tilesize = 32;


function Init() {
    var c = document.getElementById('maze-container');
    maze_data = CreateArray(c.width, c.height, tilesize);
    AddHandlers(c);
}

function AddHandlers(canvas) {
    canvas.addEventListener("onclick", function(event) {
        switch (event.button) {
            case 0:
                var coords = ClickHandler(canvas, event);
                var tile = GetTileInfo();
                PopulateTile(coords.x, coords.y, tile.height, tile.type);
                Render();
                break;
            case 2:
                var coords = ClickHandler(canvas, event);
                RemoveTile(coords.x, coords.y);
                Render();
                break;
        }
    });
}

function RemoveTile(x, y, array) {
    array[x][y] = null;
}

function GetTileInfo() {
    /* Get information of the tile:
			- Height
			- Type
	*/
}

function ClickHandler(canvas, event) {
    var coords = GetMousePosition(canvas, event)
    return coords
}

function GetMousePosition(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor((event.clientX - rect.left) / tilesize),
        y: Math.floor((event.clientY - rect.top) / tilesize)
    }
}

function CreateArray(width, height, tilesize) {
    var array = [];

    for (var x = 0; x < (width / tilesize); x++) {
        array[x] = [];
        for (var y = 0; y < (height / tilesize); y++) {
            array[x][y] = {};
        }
    }
    return array;
}

function Tile(x, y, height, type) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.type = type;

    this.getTileX = function() {
        return x;
    }
    this.getTileY = function() {
        return y;
    }

    this.getHeight = function() {
        return height;
    }

    this.getType = function() {
        return type;
    }
}

function PopulateTile(x, y, h, t) {
    var temp = new Tile(x, y, h, t);

    maze_data[x][y] = temp;
}