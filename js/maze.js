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

    CreateArray: function(width, height) {
        var array = [];

        for (var x = 0; x < (width / 32); x++) {
            array[x] = [];
            for (var y = 0; y < (height / 32); y++) {
                array[x][y] = new this.Add.Tile(x, y, 0, Maze.Tile.Type.Empty);
            }
        }

        return array;
    },

    Init: function() {
        Maze.Tile.Data = Maze.CreateArray($('#maze-container').width(), $('#maze-container').height());

        $('#maze-container').click(function(event) {
            event.preventDefault();

            var coords = Maze.GetMousePosition($('#maze-container').get(0), {
                x: event.clientX,
                y: event.clientY
            });
            var tile = Maze.GetTileInfo($('#maze-container').get(0), coords);
            Maze.PopulateTile(tile.coords.x, tile.coords.y, 10, 'Empty');
            Maze.Render($('#maze-container').get(0));
        });

        $('#maze-container').bind("contextmenu", function(event) {
            event.preventDefault();

            var coords = Maze.GetMousePosition($('#maze-container').get(0), {
                x: event.clientX,
                y: event.clientY
            });
            var tile = Maze.GetTileInfo($('#maze-container').get(0), coords);
            Maze.RemoveTile(tile.coords.x, tile.coords.y, Maze.Tile.Data, $('#maze-container').get(0));
            Maze.Render($('#maze-container').get(0));
        });
        this.Render($('#maze-container').get(0));
    },

    RemoveTile: function(x, y, array, canvas) {
        this.Tile.Data[x][y] = new this.Tile(x, y, 0, Tile.Type.Empty);
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
        var tile = new this.Add.Tile(x, y, height, type);

        Maze.Tile.Data[x][y] = tile;
    },

    GetMousePosition: function(canvas, coords) {
        var rect = canvas.getBoundingClientRect();

        var x = Math.floor((coords.x - rect.left) / 32);
        var y = Math.floor((coords.y - rect.top) / 32);

        return {
            x: x,
            y: y
        }
    },

    Render: function(canvas) {
        var c = canvas.getContext('2d');

        for (var x = 0; x < Maze.Tile.Data.length; x++) {
            for (var y = 0; y < Maze.Tile.Data[x].length; y++) {
                if (Maze.Tile.Data[x][y].type === Maze.Tile.Type.Empty) {
                    // Diddly squat
                } else {
                    if (this.Tile.Data[x][y].type === Maze.Tile.Type.Floor) {
                        var img = new Image();
                        img.src = Maze.Tile.Sprite.Floor;

                        c.drawImage(img, (Maze.Tile.Data[x][y].x * tiles))
                    }

                    if (this.Tile.Data[x][i].type === TileType.Wall) {
                        var img = new Image();
                        img.src = Maze.Tile.Sprite.Wall;

                        c.drawImage(img, (this.Tile.Data[x][i].x * 32), (Maze.Tile.Data[x][i].y * 32));
                    }
                }
            }
        }
    },

    GetTileInfo: function(canvas, coords) {
        var tile = {
            coords: {
                x: Maze.Tile.Data[coords.x][coords.y].x,
                y: Maze.Tile.Data[coords.x][coords.y].y
            },
            height: Maze.Tile.Data[coords.x][coords.y].height,
            type: Maze.Tile.Data[coords.x][coords.y].type
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