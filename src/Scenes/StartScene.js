class StartScene extends Phaser.Scene {
    constructor() {
        super("startScene");
    }

    init() {


    }
    
    preload() {
        this.load.image('1', '1.png');
    }

    create() {


        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;
        this.bg = this.add.image(centerX / 2, centerY / 2, '1');
        this.bg.setDisplaySize(centerX*3.4,centerY*3);


        this.add.text(centerX-400, centerY+600 , "Hungry P", {
            fontSize: "165px",
            color: "#f500cc",
            stroke: "#02ff41",
            strokeThickness: 20
        }).setOrigin(0, 5); // Centers the text block perfectly

        this.coinText = this.add.text(centerX-20, centerY+120, "By: Kevin Yee " , {
            fontSize: "40px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 11
        }).setOrigin(0.5);


        this.add.text(centerX-30, centerY + 270, "R to Play", {
            fontSize: "100px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 11
        }).setOrigin(0.5);


        this.rKey = this.input.keyboard.addKey('R');
    }
    

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.start("platformerScene"); //Starts Game
        }
    }
}