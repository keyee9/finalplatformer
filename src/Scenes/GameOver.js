class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOver");
        this.highscores = [];
    }

    init(data) {
        this.finalScore = data.score || 0;


    }
    
    preload() {
        this.load.image('3', '3.png');
    }

    create() {

        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;
 this.bg3 = this.add.image(centerX / 2, centerY / 2, '3');
        this.bg3.setDisplaySize(centerX*3.4,centerY*3);
        this.add.text(centerX-120, centerY+300 , "DEAD", {
            fontSize: "100px",
            color: "#ff0000",
            stroke: "#000000",
            strokeThickness: 15
        }).setOrigin(0, 5); 


        this.coinText = this.add.text(centerX, centerY, "Coins gathered: " + this.finalScore, {
            fontSize: "75px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 15
        }).setOrigin(0.5);


        this.add.text(centerX, centerY + 240, "R to return", {
            fontSize: "100px",
            color: "#000000",
            stroke: "#000000",
            strokeThickness: 7
        }).setOrigin(0.5);

        this.rKey = this.input.keyboard.addKey('R');
    }
    

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
                        this.sound.play("revivesfx");

            this.scene.start("platformerScene");
        }
    }
}