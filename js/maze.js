var Maze = {
    Tile: {
        Type: {
            Floor: 'Floor',
            Wall: 'Wall',
            Empty: 'Empty'
        },

        Tilesize: {
            NINE: 9,
            EIGHTEEN: 18,
            THIRTY_SIX: 36
        },

        Data: null,

        Sprite: {
            Floor: '',
            Wall: '',
            Empty: ''
        }
    },

    Init: function() {
        $('#maze-container').click(function(event) {
            event.preventDefault();
            var coords = GetMousePosition($(this));
            var tile = GetTileInfo($(this), coords);
            PopulateTile(tile.x, tile.y, tile.height, CurrentTileType);
            Render($(this));
        });

        $('#maze-container').bind("contextmenu", function(event) {
            event.preventDefault();

            var coords = GetMousePosition($(this));
            var tile = GetTileInfo($(this), coords);
            RemoveTile(tile.x, tile.y, maze_data, $(this));
            Render($(this));
        });

        CreateArray();
        Render($('#maze-container'));
    },

    RemoveTile: function(x, y, array, canvas) {
        maze_data[x][y] = new Tile(x, y, 0, Tile.Type.Empty);
    },

    CreateArray: function(width, height, tilesize) {
        var array = [];

        for (var x = 0; x < (width / tilesize); x++) {
            array[x] = [];
            for (var y = 0; y(height / tilesize); y++) {
                array[x][y] = new Tile(x, y, 0, TileType.Empty);
            }
        }

        return array;
    },

    Add: {
        Tile: function(x, y, height, type) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.type = type;
        },

        NPC: function(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
        },

        Item: function(x, y, type) {
            this.x = x;
            this.y = y;
            this.type = type;
        }
    },

    PopulateTile: function(x, y, height, type) {
        var tile = new Add.Tile(x, y, height, type);

        maze_data[x][y] = tile;
    },

    GetMousePosition: function(canvas, coords) {
        var rect = canvas.getBoundingClientRect();

        var x = Math.floor((coords.x - rect.left) / tilesize);
        var y = Math.floor((coords.y - rect.top) / tilesize);

        return {
            x: x,
            y: y
        }
    },

    Render: function(canvas) {
        var c = canvas.getContext('2d');

        for (var x = 0; x < maze_data.length; x++) {
            for (var y = 0; y < maze_data[x].length; y++) {
                if (maze_data[x][y].type === TileType.Empty) {
                    // Diddly squat
                } else {
                    if (maze_data[x][y].type === TileType.Floor) {
                        var img = new Image();
                        img.src = Tile.Sprite.Floor;

                        c.drawImage(img, (maze_data[x][y].x * tiles))
                    }

                    if (maze_data[x][i].type === TileType.Wall) {
                        var img = new Image();
                        img.src = Tile.Sprite.Wall;

                        c.drawImage(img, (maze_data[x][i].x * tilesize), (maze_data[x][i].y * tilesize));
                    }
                }
            }
        }
    },

    GetTileInfo: function(canvas, coords) {
        var tile = {
            coords: {
                x: maze_data[coords.x][coords.y].x,
                y: maze_data[coords.x][coords.y].y
            },
            height: maze_data[coords.x][coords.y].height,
            type: maze_data[coords.x][coords.y].type
        };

        return tile;
    },

    GetMazeData: function(data) {
        var array = [];

        for (var x = 0; x < data.length; x++) {
            array[x] = [];
            for (var y = 0; y < data[x].length; y++) {
                array[x][y] = {
                    x: data[x][y].x,
                    y: data[x][y].y,
                    height: data[x][y].height,
                    type: data[x][y].type
                };
            }
        }
        return array;
    }
};