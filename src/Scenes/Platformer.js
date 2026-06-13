class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        this.ACCELERATION = 250;
        this.MAX_SPEED= 200;
        this.DRAG = 650;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1800;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 0;
        this.SCALE = 2.0;
        this.maxJumps = 2;  
        this.jumpsLeft = 0;
        this.coinCount = 0;

    }

    
    createItems(){
        // COINS
        this.coinText = this.add.text(780, 20, "Coins: 0", {
            fontSize: "24px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
            
        });
        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.coinGroup = this.add.group(this.coins);

        // Coin Animation
        
        this.anims.create({
            key: 'coinSpin',
            frames: [
                        { key: 'tilemap_sheet', frame: 151 },
                        { key: 'tilemap_sheet', frame: 152 }
                    ],
            frameRate: 2,
            repeat: -1    
        });
            this.coins.forEach(coin => {
                coin.anims.play('coinSpin');
            });

// Levers

        this.lever1 = this.map.createFromObjects("Objects", {
            name: "Lever 1",
            key: "tilemap_sheet",
            frame: 66
        });

    this.physics.world.enable(this.lever1, Phaser.Physics.Arcade.STATIC_BODY);
    this.leverGroup = this.add.group(this.lever1);

        this.leversTouched = 0;
        this.invincible = false;;
        this.hasKey = false;
//Water

        this.water = this.map.createFromObjects("Objects", {
            name: "water",
            key: "tilemap_sheet",
            frame: 33
        });
        this.physics.world.enable(this.water, Phaser.Physics.Arcade.STATIC_BODY);
        this.waterGroup = this.add.group(this.water);

        // Water Animation
        
        this.anims.create({
            key: 'waterMove',
            frames: [
                        { key: 'tilemap_sheet', frame: 33 },
                        { key: 'tilemap_sheet', frame: 53 }
                    ],
            frameRate: 2,
            repeat: -1    
        });
            this.water.forEach(water => {
                water.anims.play('waterMove');
            });
    }

    loadMap(){
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 150, 25);

        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.bgset= this.map.addTilesetImage("kenny_tilemap_packed_air", "bgmap_tiles");

        this.physics.world.setBounds(0,0,2700,2220);
        
        this.deathlayer = this.map.createLayer("Death", this.tileset, 0,0);
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.bgLayer=this.map.createLayer("Background", this.bgset, 0, 0);
        this.bgLayer.setDepth(-1);
        this.doorlayer=this.map.createLayer("Door", this.tileset, 0,0);
        this.sdoorlayer=this.map.createLayer("SecretDoor", this.tileset, 0,0);
        this.check1=this.map.createLayer("Check-1", this.tileset,0,0);
        this.check2=this.map.createLayer("Check-2", this.tileset,0,0);

    }

    
    loadPlayer(){
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);
        my.sprite.player.setMaxVelocity(this.MAX_SPEED, 800);
        
    }

    loadPlatform(){
        this.movingPlatform = this.physics.add.image(2401, 240, 'movingplatform');
        this.movingPlatform.setImmovable(true);
        this.movingPlatform.body.allowGravity = false;
        this.movingPlatform.setVelocityX(100);
        this.platformStartX = this.movingPlatform.x; 
    }
    checkCollision(){
        // Add player x ground collision
        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // Player x death collision
        this.deathlayer.setCollisionByProperty({
            dead: true
        });

        this.physics.add.collider(my.sprite.player,this.deathlayer, () => {
        if (this.invincible) return;
            this.sound.play('deathsfx', {
            volume: 0.3 
            });
        this.bgMusic.stop();
        this.scene.start("gameOver", { score: this.coinCount    });  
            });

        // Coin Collision            
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
        obj2.destroy();
        this.coinCount++;
        this.sound.play("coinsfx", {
           volume: 0.6 
            });
        this.coinText.setText("Coins: " + this.coinCount);

        if (this.coinCount >=15) {
            this.physics.add.collider(my.sprite.player, this.doorlayer, () => {
            this.bgMusic.stop();
            this.scene.start("winScreen", { score: this.coinCount }); 
        });
    }
        
});    
        this.doorlayer.setCollisionByProperty({
            win: true
        });
        this.sdoorlayer.setCollisionByProperty({
            win: true
        });
    

        //Secret Door
        this.physics.add.collider(my.sprite.player, this.sdoorlayer, () => {
            this.bgMusic.stop();
            this.scene.start("winScreen", { score: this.coinCount }); 
        });

        // First Check 
        this.check1.setCollisionByProperty({
            collides: true
        });
        // Second Check
        this.check2.setCollisionByProperty({
            collides: true
        });
        // Door Collision
        this.doorlayer.setCollisionByProperty({
            win:true        
        });
        // Lever Collision
    this.physics.add.overlap(my.sprite.player, this.leverGroup, (player, lever) => {

            if (!lever.touched) {
                lever.touched = true;
                this.leversTouched++;
                this.sound.play("switch");
                lever.setFrame(64);
                console.log("button touched");

            }


        });
    
        this.check1collider=this.physics.add.collider(my.sprite.player, this.check1);
        this.check2collider=this.physics.add.collider(my.sprite.player, this.check2);
        this.physics.add.collider(my.sprite.player, this.movingPlatform, this.matchPlatformVelocity, null, this);


    }

    followCamera(){
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        // Coin

        this.coinText.setScrollFactor(0,1);
        this.coinText.setOrigin(-1.25,0);
    }

    createVFX(){
                my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
                frame: ['dirt_01.png', 'dirt_03.png'],
                scale: {start: 0.03, end: 0.03},
                frequency: 100,
                lifespan: 350,
                alpha: {start: 1, end: 0.1}, 
            });
            my.vfx.walking.stop();
            this.jumpVFX = this.add.particles(0, 0, "kenny-particles", {
                frame: ["smoke_07.png", "smoke_08.png"],
                scale: { start: 0.05, end: 0.03 },
                lifespan: 250,
                frequency: 100,
                alpha: { start: 1, end: 0.1 },
                maxAliveParticles: 1,
                emitting: false
                
            });

    }
    inputKeys(){
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }
    debug(){
        this.physics.world.drawDebug = !this.physics.world.drawDebug;
        this.physics.world.debugGraphic.clear();
    }
    create() {

        this.loadMap();
        this.createItems();
        this.loadPlayer();
        this.loadPlatform();
        this.checkCollision();
        this.followCamera();
        this.createVFX();
        this.inputKeys();
        this.debug();

        this.bgMusic  = this.sound.add('bgm',  { volume: 0.2, loop: true });
        this.bgMusic.play();
    }

    handleMovement(){
        let isMoving=false;
        if(this.aKey.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            isMoving=true;

        if (my.sprite.player.body.blocked.down) {
            my.vfx.walking.start();

            }
        } else if(this.dKey.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            isMoving=true;

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();

        }
        if (my.sprite.player.body.blocked.down && isMoving) {
            my.vfx.walking.startFollow(my.sprite.player, 0, 16, false); 
        if (!my.vfx.walking.emitting) {
            my.vfx.walking.start();
            }
        } else {
            my.vfx.walking.stop();
        }
    }
    checkBorder(){
        if (this.coinCount >=5){ 
            if (this.check1collider && this.check1collider.world) {
            this.check1collider.destroy();
            this.sound.play('levelnotif', { volume: 0.6 });
            this.check1collider = null; 
        }
            this.check1.forEachTile(tile => {
            this.check1.removeTileAt(tile.x, tile.y);
        });
    }
        if (this.coinCount >=10){
            if (this.check2collider && this.check2collider.world) {
                this.check2collider.destroy();
                this.sound.play('jumpsfx', { volume: 0.3 });
                this.check2collider = null; 
            }
            this.check2.forEachTile(tile => {
            this.check2.removeTileAt(tile.x, tile.y);
            });
        }
    }
    handleJumping(){
        if (my.sprite.player.body.blocked.down) {
            this.jumpsLeft = this.maxJumps;
        } else {
            my.sprite.player.anims.play('jump', true);
    }

        if (Phaser.Input.Keyboard.JustDown(this.wKey) && this.jumpsLeft > 0) {
        my.sprite.player.setVelocityY(this.JUMP_VELOCITY);
        this.sound.play('jumpsfx', { volume: 0.3 });
        this.jumpsLeft--;

        this.jumpVFX.emitParticleAt(
            my.sprite.player.x,
            my.sprite.player.y + my.sprite.player.displayHeight / 2,
            6
        );
    }

    }

    handlePlatformMovement(){
         let startX = this.platformStartX;
    let range = 100;

    if (this.movingPlatform.x >= startX + range) {
        this.movingPlatform.setVelocityX(-100);
    } else if (this.movingPlatform.x <= startX - range) {
        this.movingPlatform.setVelocityX(100);
    }
    }

    handleLeverCheckpoint(){
        if (!this.invincible && this.leversTouched === 3) {
                this.invincible = true;
                                this.sound.play("levernotif", {
           volume: 0.5 
            });

                console.log("You can't die now!");
            }
    }

    update() {

        this.handleMovement();
        this.checkBorder();
        this.handleJumping();
        this.handlePlatformMovement();
        this.handleLeverCheckpoint();

   
}

}