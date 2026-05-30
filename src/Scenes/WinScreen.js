class WinScreen extends Phaser.Scene {
    constructor() {
        super("winScreen");
        this.highscores = [];
    }

    init(data) {
        this.finalScore = data.score || 0;


    }
    
    preload() {
        // Preload assets here if needed
    }

    create() {
        // Clear background color fallback to black
        this.cameras.main.setBackgroundColor('#000000');

        // FIXED: Use height for the Y coordinate centering!
        let centerX = this.sys.game.config.width / 2;
        let centerY = this.sys.game.config.height / 2;

        // 1. GAME OVER HEADER TEXT
        this.add.text(centerX-180, centerY+300 , "WINNER", {
            fontSize: "100px",
            color: "#d3cf05",
            stroke: "#000000",
            strokeThickness: 20
        }).setOrigin(0, 5); // Centers the text block perfectly

        // 2. COINS GATHERED TEXT
        // FIXED: Corrected string concatenation syntax
        this.coinText = this.add.text(centerX, centerY, "Coins gathered: " + this.finalScore, {
            fontSize: "75px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 20
        }).setOrigin(0.5);


        // 5. RESTART INSTRUCTION
        this.add.text(centerX, centerY + 170, "RETURN TO ZERO", {
            fontSize: "100px",
            color: "#aaaaaa"
        }).setOrigin(0.5);

        // Listen for the R key to restart the game
        this.rKey = this.input.keyboard.addKey('R');
    }
    

    update(time, delta) {
        // If player presses R, kick them back to your main level scene
        if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.sound.play("revivesfx");

            this.scene.start("platformerScene");
        }
    }
}