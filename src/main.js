var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
};

var game = new Phaser.Game(config),
    grid,
    scene,
    updating = false;

function preload(){
    scene = this;
    width = this.game.canvas.width;
    height = this.game.canvas.height;
    var progressBar = this.add.graphics(),
        progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRoundedRect((width/2)-150, (height/2)-25, 300, 50, 5);

    this.load.on('progress', function (value) {
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRoundedRect((width/2)-140, (height/2)-15, 280 * value, 30, 5);
    });

    this.load.on('complete', function () {
        progressBar.destroy();
        progressBox.destroy();
    });

    this.load.image('empty-tile', 'assets/empty-tile.jpg');
    this.load.image('white-light', 'assets/white-light.png');
    this.load.image('reflector-tile', 'assets/reflector.png');

    this.load.scripts('all', [
        makeURL('tiles', 'emptyTile'),
        makeURL('', 'grid'),
        makeURL('', 'light'),
        makeURL('tiles', 'reflectorTile'),
        makeURL('tiles', 'colorFilterTile'),
    ]);
}

function create(){
    grid = new Grid(10, 20, 50, 50, 34);
    grid.setTile(new Light(0, 0, 'E', 'white', grid));
    grid.setTile(new ReflectorTile(10, 0, grid, 34, 0));
}

function update(){
    if (updating){
        grid.tiles.forEach(layer => {
            layer.forEach(tile => {
                if (tile instanceof Light){
                    tile.update();
                }
            });
        });
    }
}

function makeURL(folder,file){
    if (folder === ''){
        var name = file;
    } else {
        var name = folder+'/'+file;
    }
    return './src/'+name+'.js';
}

function keyBinds(e){
    if (e.key == 'r'){
        updating = true;
    } else if (e.key == 's'){
        updating = false;
    }
}