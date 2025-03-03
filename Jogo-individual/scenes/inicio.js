// classe que contém a tela de início
class Inicio extends Phaser.Scene {

    constructor() {

        super({
            key: 'Inicio',
        });
    }

    //carregas elementos da tela
    preload(){
        this.load.image('backg', "Jogo-individual/assets/telaInicial.png");
        this.load.image('playBt', "Jogo-individual/assets/playBt.png");
    }
    //adicionando elementos na tela
    create(){
        ///adiciona os elementos da tela
        this.add.image(this.game.config.width /2,this.game.config.height / 2,'backg');
        this.playBt = this.add.image(this.game.config.width / 2, (this.game.config.height / 2) + 30, 'playBt').setScale(0.4);
        this.playBt.setInteractive(); // deixa o botão clicável

        this.playBt.on('pointerdown', function(){ // ações ao clicar no botão
            this.scene.stop('Inicio');
            this.scene.start('CarroCun');
        },this);
    }

}


    