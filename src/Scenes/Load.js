class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
        // Audio   
        this.load.audio("bgm", "bgm.mp3");
        this.load.audio("win", "win.mp3");
        this.load.audio("coinsfx", "coin.mp3");
        this.load.audio("jumpsfx", "jump.mp3");
        this.load.audio("deathsfx", "timeskip.mp3");
        this.load.audio("revivesfx", "rbd.mp3");
        this.load.audio("levernotif", "levernotif.mp3");
        this.load.audio("levelnotif", "levelnotif.mp3");
        this.load.audio("switch", "switch.mp3");

        this.load.image("movingplatform","movingplatform.png");

                this.load.image("1", "1.png");
                this.load.image("2", "2.png");   
                this.load.image("3", "3.png");   
   

        this.load.image("tilemap_tiles", "tilemap_packed.png");   
        this.load.image("bgmap_tiles", "tilemap-backgrounds_packed.png");                      // Packed tilemap
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON
    
        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

            this.load.spritesheet("tilemap_sheet2", "tilemap-backgrounds_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("startScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}