var Exporter = (function(exporter) {
    var camera;
    var renderer;
    var scene;
    var controls;

    exporter.animate = function() {
        exporter.render();
        requestAnimationFrame(exporter.animate);
    };

    exporter.render = function() {
        renderer.render(scene, camera);
    };

    exporter.init = function() {
        renderer = new THREE.CanvasRenderer({
            alpha: true,
            canvas: $('#3dCanvas').get(0)
        });

        renderer.setSize($(window).width(), 400);
        renderer.setClearColor(Math.random() * 0xff0000, 0);

        camera = new THREE.PerspectiveCamera(45, 1, 1, 1500);
        camera.position.x = 425;
        camera.position.y = 200;
        camera.position.z = -600;

        controls = new THREE.OrbitControls(camera);
        
        $('#3dContainer').change(function() {
            exporert.renderer();
        });

        controls.minDistance = 900;
        controls.maxDistance = 800;

        scene = new THREE.Scene();
        this.animate();
    };

    exporter.getCamera = function() {
        return camera;
    };

    exporter.addTile = function(x, y, size, height, color, wireframe, texture) {
        var tile = new THREE.Mesh(new THREE.BoxGeometry(size, size, height), new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(texture),
            overdraw: true
        }));

        tile.position.y = 300 + ((y * size) * -1);
        tile.position.x = 300 + ((x * size) * -1);
        tile.position.z = 1;

        return tile;
    };

    exporter.generate3DMaze = function(data) {
        for (var x = 0; x < data.length; x++) {
            for (var y = 0; y < data[x].length; y++) {
                if (data[x][y].type === Maze.Tile.Type.Floor) {
                    var tile = exporter.addTile(x, y, 32, .1, 0x1abc9c, false, './assets/tiles/floor.png');
                    scene.add(tile);
                }

                if (data[x][y].type === Maze.Tile.Type.Wall) {
                    var tile = exporter.addTile(x, y, 32, 32, 0x3498db, false, './assets/tiles/wall.png');
                    scene.add(tile);
                }
            }
        }
    };

    exporter.getSceneObjects = function() {
        return objects;
    };

    exporter.clearScene = function() {
        for (var i = scene.children.length; i >= 0; i--) {
            scene.remove(scene.children[i]);
        }
    };

    return exporter;

}(Exporter || {}));