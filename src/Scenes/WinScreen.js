class WinScreen extends Phaser.Scene {
    constructor() {
        super("winScreen");
        this.highscores = [];
    }

    init(data) {
        this.finalScore = data.score || 0;


    }
    
    preload() {
        this.load.image('2', '2.png');
    }

    create() {

        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;
 this.bg2 = this.add.image(centerX / 2, centerY / 2, '2');
        this.bg2.setDisplaySize(centerX*3.4,centerY*3);
        // 1. GAME OVER HEADER TEXT
        this.add.text(centerX-180, centerY+300 , "WINNER", {
            fontSize: "100px",
            color: "#d3cf05",
            stroke: "#000000",
            strokeThickness: 15
        }).setOrigin(0, 5); 

        this.coinText = this.add.text(centerX, centerY, "Coins gathered: " + this.finalScore, {
            fontSize: "75px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 15
        }).setOrigin(0.5);



        this.add.text(centerX, centerY + 240, "RETURN TO ZERO", {
            fontSize: "100px",
            color: "#aaaaaa",
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