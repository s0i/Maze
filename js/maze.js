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
            Floor: './assets/tiles/floor.png',
            Wall: './assets/tiles/wall.png'
        },

        Data: null
    },

    CreateArray: function(width, height) {
        var array = [];

        for (var x = 0; x < (width / Drawer.Size); x++) {
            array[x] = [];
            for (var y = 0; y < (height / Drawer.Size); y++) {
                array[x][y] = new this.Add.Tile(x, y, 0, Maze.Tile.Type.Empty, false);
            }
        }

        return array;
    },

    Init: function() {
        this.Tile.Data = Maze.CreateArray(Drawer.Maze.width, Drawer.Maze.height);

        $('#maze-container').bind({
            mousedown: function(event) {
                switch (event.which) {
                    case 1:
                        Drawer.isDrawing = true;
                        event.preventDefault();

                        var coords = Maze.GetMousePosition(Drawer.Maze, {
                            x: event.clientX,
                            y: event.clientY
                        });
                        var tile = Maze.GetTileInfo(coords);
                        Maze.PopulateTile(tile.coords.x, tile.coords.y, Drawer.Height, Drawer.Type);
                        Maze.Render(Drawer.Maze);
                        break;

                    case 3:
                        var coords = Maze.GetMousePosition(Drawer.Maze, {
                            x: event.clientX,
                            y: event.clientY
                        });
                        var tile = Maze.GetTileInfo(coords);
                        Maze.RemoveTile(tile.coords.x, tile.coords.y, Maze.Tile.Data);
                        Maze.Render(Drawer.Maze);
                        break;

                    default:
                        break;
                }
            },

            mouseup: function() {
                Drawer.isDrawing = false;
            },

            contextmenu: function() {
                event.preventDefault();
            },

            mousemove: function() {
                if (Drawer.isDrawing) {
                    event.preventDefault();

                    var coords = Maze.GetMousePosition(Drawer.Maze, {
                        x: event.clientX,
                        y: event.clientY
                    });
                    var tile = Maze.GetTileInfo(coords);
                    Maze.PopulateTile(tile.coords.x, tile.coords.y, Drawer.Height, Drawer.Type);
                    Maze.Render(Drawer.Maze);
                }
            },

            dragstart: function() {
                event.preventDefault();
            },

            mousewheel: function(event) {
                event.preventDefault();
                // var wheel = event.originalEvent.wheelDelta / 120;
                // var scale = Math.pow(1 + Math.abs(wheel) / 2, wheel > 0 ? 1 : -1);

                // Drawer.Scale *= scale;

                // Drawer.Maze.getContext('2d').scale(scale, scale);
                // Maze.Render(Drawer.Maze);
            }
        });

        $(document).mouseup(function() {
            Drawer.isDrawing = false;
        });

        $('#console, #console_label').click(function(event) {
            if ($(this).is(':animated')) {
                return;
            } else {
                if (event.target === this) {
                    $(this).stop(true, true).animate({
                        right: $(this).css('right') === "250px" ? 160 : 250
                    }, 500);

                    $('#maze-container').animate({
                        left: $('#maze-container').css('left') === "-175px" ? 0 : -175
                    }, 500);
                }
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

        $('#darken').click(function() {

        });

        this.Render(Drawer.Maze);
    },

    RemoveTile: function(x, y, data) {
        data[x][y] = new this.Add.Tile(x, y, 0, Maze.Tile.Type.Empty, false);
    },

    Add: {
        Tile: function(x, y, height, type, visited) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.type = type;
            this.visited = visited;
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
        var tile = new this.Add.Tile(x, y, height, type, false);

        this.Tile.Data[x][y] = tile;
    },

    GetMousePosition: function(canvas, coords) {
        var rect = canvas.getBoundingClientRect();

        var x = Math.floor(((coords.x - rect.left) / Drawer.Scale) / Drawer.Size);
        var y = Math.floor(((coords.y - rect.top) / Drawer.Scale) / Drawer.Size);

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

    GetToolTip: function(coords) {
        var tile = this.GetTileInfo(coords);

    },

    GetTileInfo: function(coords) {
        try {
            var tile = {
                coords: {
                    x: Maze.Tile.Data[coords.x][coords.y].x,
                    y: Maze.Tile.Data[coords.x][coords.y].y
                },
                height: Maze.Tile.Data[coords.x][coords.y].height,
                type: Maze.Tile.Data[coords.x][coords.y].type
            };
        } catch (e) {}

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

    GetNeighborDirections: function(tile, data) {
        var x = tile.x;
        var y = tile.y;

        var top, right, bottom, left;
        var directions = [];

        if (x > 0) {
            if (this.Tile.Data[x - 1][y].type !== this.Tile.Type.Empty) {
                left = 1;
            } else {
                left = 0;
            }
        } else {
            left = 0;
        }

        if (x <= data.length) {
            if (this.Tile.Data[x + 1][y].type !== this.Tile.Type.Empty) {
                right = 1;
            } else {
                right = 0;
            }
        } else {
            right = 0;
        }

        if (y > 0) {
            if (this.Tile.Data[x][y + 1].type !== this.Tile.Type.Empty) {
                bottom = 1;
            } else {
                bottom = 0;
            }
        } else {
            bottom = 0;
        }

        if (y <= data.length) {
            if (this.Tile.Data[x][y + 1].type !== this.Tile.Type.Empty) {
                top = 1;
            } else {
                top = 0;
            }
        } else {
            top = 0;
        }

        directions.push(top, right, bottom, left);

        return directions;
    },

    GetNeighbors: function(tile, data) {
        var neighbors = [];

        tile.x > 0 ? neighbors.push(data[tile.x - 1][tile.y]) : 0
        tile.x < data.length ? neighbors.push(data[tile.x + 1][tile.y]) : 0
        tile.y > 0 ? neighbors.push(data[tile.x][tile.y - 1]) : 0
        tile.y < data.length ? neighbors.push(data[tile.x][tile.y + 1]) : 0

        return neighbors;
    },

    GetRandomCell: function(data) {
        return data[Math.floor(Math.random() * data.length)][Math.floor(Math.random() * data.length)];
    },

    GenerateMaze: function(data) {
        var totalCells = Math.pow(data.length, 2);
        var visited = 0;
        var counter = 0;

        var maze = this.CreateArray(Drawer.Maze.width, Drawer.Maze.height);

        var current = Maze.GetRandomCell(data);
        current.visited = true;

        while (visited < totalCells) {
            var neighbors = Maze.GetNeighbors(current, data);
            var neighbor = neighbors[Math.floor(Math.random() * (neighbors.length + 1))];
            if (neighbor.visited !== false) {
                current = neighbor;
                data[neighbor.x][neighbor.y].visited = true;
                visited++;
                maze[current.x][current.y] = current;
            }
            counter++;
            console.log(counter);
        }

        return maze;
    }
};