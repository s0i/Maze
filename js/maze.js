function Tile(x, y, height, type) {
    var x = x;
    var y = y;
    var height = height;
    var type = type;

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