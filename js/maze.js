var Maze = {
    Tile: {
        Type: {
            Floor: 'Floor',
            Wall: 'Wall',
            Empty: 'Empty'
        },

        Size: {
            EIGHT: 8,
            SIXTEEN: 16,
            THIRTY_TWO: 32
        },

        Sprite: {
            Floor: './assets/floor.png',
            Wall: './assets/wall.png'
        },

        Data: null
    },

    CreateArray: function(width, height) {
        var array = [];

        for (var x = 0; x < (width / Drawer.Size); x++) {
            array[x] = [];
            for (var y = 0; y < (height / Drawer.Size); y++) {
                array[x][y] = new this.Add.Tile(x, y, 0, Maze.Tile.Type.Empty);
            }
        }

        return array;
    },

    Init: function() {
        $('#features')
        Maze.Tile.Data = Maze.CreateArray($('#maze-container').width(), $('#maze-container').height());

        $('#maze-container').mousedown(function(event) {
            switch (event.which) {
                case 1:
                    Drawer.isDrawing = true;
                    event.preventDefault();

                    var coords = Maze.GetMousePosition(Drawer.Maze, {
                        x: event.clientX,
                        y: event.clientY
                    });
                    var tile = Maze.GetTileInfo(Drawer.Maze, coords);
                    Maze.PopulateTile(tile.coords.x, tile.coords.y, Drawer.Height, Drawer.Type);
                    Maze.Render(Drawer.Maze);
                    break;

                case 3:
                    var coords = Maze.GetMousePosition(Drawer.Maze, {
                        x: event.clientX,
                        y: event.clientY
                    });
                    var tile = Maze.GetTileInfo(Drawer.Maze, coords);
                    Maze.RemoveTile(tile.coords.x, tile.coords.y, Maze.Tile.Data, Drawer.Maze);
                    Maze.Render(Drawer.Maze);
                    break;

                default:
                    break;
            }
        });

        $('#maze-container').mouseup(function() {
            Drawer.isDrawing = false;
        });

        $(document).mouseup(function() {
            Drawer.isDrawing = false;
        });

        $('#maze-container').bind("contextmenu", function(event) {
            event.preventDefault();
        });

        $('#maze-container').mousemove(function() {
            if (Drawer.isDrawing) {
                event.preventDefault();

                var coords = Maze.GetMousePosition(Drawer.Maze, {
                    x: event.clientX,
                    y: event.clientY
                });
                var tile = Maze.GetTileInfo(Drawer.Maze, coords);
                Maze.PopulateTile(tile.coords.x, tile.coords.y, Drawer.Height, Drawer.Type);
                Maze.Render(Drawer.Maze);
            }
        });

        $('#console').click(function(event) {
            if (event.target === this) {
                if ($(this).is(':animated')) {
                    return;
                }

                $(this).stop(true, true).animate({
                    right: $(this).css('right') === "250px" ? 160 : 250
                }, 500);

                $('#maze-container').animate({
                    left: $('#maze-container').css('left') === "-175px" ? 0 : -175
                }, 500);
            }
        });

        $('input[name="tilesize"]').change(function(event) {
            Drawer.Size = Number($(this).attr('value'));
            Maze.Tile.Data = Maze.CreateArray(Drawer.Maze.width, Drawer.Maze.height);
            Maze.Render(Drawer.Maze);
        });

        $('input[name="type"]').change(function(event) {
            $(this).attr('value') === 'Floor' ? Drawer.Type = Maze.Tile.Type.Floor : Drawer.Type = Maze.Tile.Type.Wall
        });

        $('#maze-container').bind('dragstart', function(event) {
            event.preventDefault();
        });

        $('#clear').click(function() {
            Maze.Tile.Data = Maze.CreateArray(Drawer.Maze.width, Drawer.Maze.height);
            Maze.Render(Drawer.Maze);
        });

        $('#height').keypress(function(event) {
            if (String.fromCharCode(event.which).match(/[1234567890]/g)) {
                return true;
            } else {
                return false;
            }
        });

        $('#height').keyup(function() {
            Drawer.Height = Number($(this).val());
        });

        this.Render(Drawer.Maze);
    },

    RemoveTile: function(x, y, array, canvas) {
        Maze.Tile.Data[x][y] = new this.Add.Tile(x, y, 0, Maze.Tile.Type.Empty);
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
        },

        TileInfo: function(top, bottom, left, right) {
            this.top = top;
            this.bottom = bottom;
            this.left = left;
            this.right = right;
        }
    },

    PopulateTile: function(x, y, height, type) {
        var tile = new this.Add.Tile(x, y, height, type);

        Maze.Tile.Data[x][y] = tile;
    },

    GetMousePosition: function(canvas, coords) {
        var rect = canvas.getBoundingClientRect();

        var x = Math.floor((coords.x - rect.left) / Drawer.Size);
        var y = Math.floor((coords.y - rect.top) / Drawer.Size);

        return {
            x: x,
            y: y
        }
    },

    Render: function(canvas) {
        var c = Drawer.Maze.getContext('2d');

        for (var x = 0; x < Maze.Tile.Data.length; x++) {
            for (var y = 0; y < Maze.Tile.Data[x].length; y++) {
                if (Maze.Tile.Data[x][y].type === Maze.Tile.Type.Empty) {
                    c.clearRect((Maze.Tile.Data[x][y].x * Drawer.Size), (Maze.Tile.Data[x][y].y * Drawer.Size), Drawer.Size, Drawer.Size);
                } else {
                    if (this.Tile.Data[x][y].type === Maze.Tile.Type.Floor) {
                        var img = new Image();
                        img.src = Maze.Tile.Sprite.Floor;

                        c.drawImage(img, (Maze.Tile.Data[x][y].x * Drawer.Size), (Maze.Tile.Data[x][y].y * Drawer.Size), Drawer.Size, Drawer.Size);
                    }

                    if (this.Tile.Data[x][y].type === Maze.Tile.Type.Wall) {
                        var img = new Image();
                        img.src = Maze.Tile.Sprite.Wall;

                        c.drawImage(img, (this.Tile.Data[x][y].x * Drawer.Size), (Maze.Tile.Data[x][y].y * Drawer.Size), Drawer.Size, Drawer.Size);
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
            for (var y = 0; y < data.length; y++) {
                array[x][y] = {
                    x: data[x][y].x,
                    y: data[x][y].y,
                    height: data[x][y].height,
                    type: data[x][y].type
                };
            }
        }
        return array;
    },

    GetTileSurroundings: function(data) {},

    GenerateMaze: function() {}
};