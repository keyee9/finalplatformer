class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 150;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1800;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 0;
        this.SCALE = 2.0;
        this.firstlevel=true;
        
    }

    create() {
        this.jumpCount = 0;
        this.maxJumps = 0;  
        this.jumpsLeft = 0;
        this.coinCount = 0;
                
        this.coinText = this.add.text(780, 20, "Coins: 0", {
            fontSize: "24px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
            
        });
        // Create

        this.map = this.add.tilemap("platformer-level-1", 18, 18, 150, 25);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.bgset= this.map.addTilesetImage("kenny_tilemap_packed_air", "bgmap_tiles");
        this.physics.world.setBounds(0,0,900,550);

        // Create a layer
        this.deathlayer = this.map.createLayer("Death", this.tileset, 0,0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.bgLayer=this.map.createLayer("Background", this.bgset, 0, 0);
        this.bgLayer.setDepth(-1);
        this.doorlayer=this.map.createLayer("Door", this.tileset, 0,0);
        // Make it collidable
        this.groundLayer.setDepth(0);
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        // TODO: Add turn into Arcade Physics here
  // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        
        // TODO: Add coin collision handler
        
        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.coinCount++;
            this.sound.play("coinsfx");
this.coinText.setText("Coins: " + this.coinCount);
        });
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TODO: Add movement vfx here
        
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        
        // my.vfx.jumping = this.add.particles(0,0, "kenny-particles",{
        //   frame:['muzzle_01.png','muzzle_05.png'],
        //   scale:{scale: 0.03, end:0.1},
        //   lifespan:350,
        //  alpha: {start:1, end:0.1},
        //        });
        //   my.vfx.jumping.stop();

        // TODO: add camera code here
        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        this.coinText.setScrollFactor(0,1);
        this.coinText.setOrigin(-1.25,0);


        this.deathlayer.setCollisionByProperty({
            dead: true
        })
        
        this.physics.add.collider(my.sprite.player,this.deathlayer, () => {
this.sound.play('deathsfx', {
   volume: 0.5 


});
this.bgMusic.stop();

this.scene.start("gameOver", { score: this.coinCount    });  
        
        });

this.bgMusic  = this.sound.add('bgm',  { volume: 0.3, loop: true });
this.bgMusic.play();

this.doorlayer.setCollisionByProperty({
    win:true
})




 


    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
                        my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
            // TODO: add particle following code here

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.ACCELERATION>150) my.sprite.ACCELERATION=150;

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
            // TODO: add particle following code here

        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
                        my.vfx.walking.stop();

            // TODO: have the vfx stop playing
        }

        if (this.coinCount >=5 && this.firstlevel) 
                this.physics.world.setBounds(0,0,1800,550);

        if (this.coinCount >=10){
            this.firstlevel=false;
            this.physics.world.setBounds(0,0,2700,550);

        }
        



        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
if (my.sprite.player.body.blocked.down) {
            this.jumpsLeft = 2;
        }
        if (!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump', true);
        }

        if (Phaser.Input.Keyboard.JustDown(cursors.up) && this.jumpsLeft > 0) {
            my.sprite.player.setVelocityY(this.JUMP_VELOCITY);
this.sound.play('jumpsfx', {
   volume: 0.5 


    });
            this.jumpsLeft--;
        }
        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.bgMusic.stop();

        this.scene.start("winScreen", { score: this.coinCount    });  
            }


if (this.coinCount>=15){
    this.physics.add.collider(my.sprite.player, this.doorlayer, () =>{
       this.scene.start("winScreen", { score: this.coinCount    }); 

    });
}

    



    }
}