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

    Scale: 1,

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
        $('body').niceScroll().hide();

        $('#maze-container').bind({
            mousedown: function(event) {
                switch (event.which) {
                    case 1:
                        Drawer.isDrawing = true;

                        var coords = Maze.GetMousePosition(Drawer.Maze, {
                            x: event.clientX,
                            y: event.clientY
                        });
                        var tile = Maze.GetTileInfo(coords);
                        Maze.PopulateTile(tile.coords.x, tile.coords.y, Drawer.Height, Drawer.Type);
                        break;

                    case 3:
                        var coords = Maze.GetMousePosition(Drawer.Maze, {
                            x: event.clientX,
                            y: event.clientY
                        });
                        var tile = Maze.GetTileInfo(coords);
                        Maze.RemoveTile(tile.coords.x, tile.coords.y, Maze.Tile.Data);
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
                }
            },

            dragstart: function() {
                event.preventDefault();
            }
        });

        $(document).mouseup(function() {
            Drawer.isDrawing = false;
        });

        $('#console').click(function(event) {
            if ($(this).is(':animated')) {
                return;
            } else {
                if (event.target === this) {
                    $(this).stop(true, true).animate({
                        right: $(this).get(0).style.right === "13%" ? "20%" : "13%"
                    }, 500);

                    $('#maze-container').animate({
                        left: $('#maze-container').css('left') === "0px" ? '-14%' : 0
                    }, 500);
                }
            }
        });

        $('input[name="tilesize"]').change(function(event) {
            Drawer.Size = Number($(this).attr('value'));

            Maze.Tile.Data = Maze.CreateArray(Drawer.Maze.width, Drawer.Maze.height);
        });

        $('input[name="type"]').change(function(event) {
            $(this).attr('value') === 'Floor' ? Drawer.Type = Maze.Tile.Type.Floor : Drawer.Type = Maze.Tile.Type.Wall
        });

        $('#clear').click(function() {
            Maze.Tile.Data = Maze.CreateArray(Drawer.Maze.width, Drawer.Maze.height);
            Exporter.clearScene();
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

        $('#generate').click(function() {
            Exporter.generate3DMaze(Maze.Tile.Data);
            $('body').animate({
                scrollTop: $('#3dContainer').offset().top
            }, 2000);
        });

        $('#darken').click(function() {});

        Maze.Render();
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

    Render: function() {
        requestAnimationFrame(Maze.Render);
        Maze.Draw();
    },

    Draw: function(canvas) {
        var c = Drawer.Maze.getContext('2d');
        c.save();
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

        c.restore();
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

        if (x < data.length) {
            if (this.Tile.Data[x + 1][y].type !== this.Tile.Type.Empty) {
                right = 1;
            } else {
                right = 0;
            }
        } else {
            right = 0;
        }

        if (y < data.length) {
            if (this.Tile.Data[x][y + 1].type !== this.Tile.Type.Empty) {
                bottom = 1;
            } else {
                bottom = 0;
            }
        } else {
            bottom = 0;
        }

        if (y > 0) {
            if (this.Tile.Data[x][y - 1].type !== this.Tile.Type.Empty) {
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
    },

    ZoomHandler: function(event) {
        delta = event.wheelDelta / 120;
        Maze.Scale += delta * 0.01;

        if (Maze.Scale < 1) Maze.Scale = 1;
    }
};