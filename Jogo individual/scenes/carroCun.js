// Classe que contém o jogo 
class CarroCun extends Phaser.Scene {
    constructor() {
        super({ key: 'CarroCun' });
    }

    init() {
        // Configuração dos objetos
        this.bg = {
            x: 200,
            y: 0,
            y_start: 0,
            y_end: 915,
            obj: null

        }
        this.gameControls = {
            over: false,
            score: 0,
            restartBt: null,
        };

        this.objects = this.physics.add.group();
        this.objectsConfig = {
            count: 7,
            minY: -500,
            maxT: -500,
            screenSpeed: -3,
        };
        this.player = {
            width:17,
            height: 32,
            obj: null,
        }
        this.faquir = {
            y: 100,
            x1: 110,
            x2: 250,
            speed: 3,

            camaFaquir1: null,
            camaFaquir2: null,
        }

        this.positionsX = [94, 120, 132,145, 166, 201, 235]; // posicoes dos carros x
        Phaser.Utils.Array.Shuffle(this.positionsX); 

        this.positionsY = [-100, -170, -310,-280, -240, -380, - 450]; // posicoes dos carros y 
        Phaser.Utils.Array.Shuffle(this.positionsY); // embaralha a lista
    }
    //carregando os objetos que estarão em cena
    preload() {
        this.load.image('bg', "assets/fundoJogo.png");
        this.load.image('carroAzul', "assets/carroAzul.png");
        this.load.image('carroVerde', "assets/carroVerde.png");
        this.load.image('carroAmarelo', "assets/carroAmarelo.png");
        this.load.image('carroVermelho', "assets/carroVermelho.png");
        this.load.image('carroJogador', "assets/carroJogador.png");
        this.load.image('camaFaquir', "assets/camaFaquir.png");
        this.load.image('gameOver', "assets/gameOver.png");
        this.load.image('restartBt', "assets/restartBt.png");
        this.load.image('boost', "assets/turbo.png");
    }

    create() {
        // Criando o fundo animado
        this.bg.obj = this.add.image(this.game.config.width / 2 ,this.game.config.height / 2, 'bg');

        this.boost = this.physics.add.image(175, 420,'boost').setVisible(false).setScale(0.35);

        this.faquir.camaFaquir1 =this.physics.add.image(this.faquir.x1,this.faquir.y,'camaFaquir').setImmovable(true);
        this.faquir.camaFaquir2 =this.physics.add.image(this.faquir.x2,this.faquir.y-400,'camaFaquir').setImmovable(true);
       
        // Criando o carro do jogador
        this.playerCar = this.physics.add.image(175, 400, 'carroJogador').setCollideWorldBounds(true).setImmovable(false);

        // ação ao enconstar nos obstáculos
        this.physics.add.overlap(this.faquir.camaFaquir1, this.playerCar,this.gameOver, null, this)
        this.physics.add.overlap(this.faquir.camaFaquir2, this.playerCar,this.gameOver, null, this)
          
       
        
        this.physics.world.setBounds(50, 0, 250, 700); // adicionando limites a tela

        
        //interaççao com o teclado
        this.keyboard = this.input.keyboard.createCursorKeys();

        // Coloca os carros em posições diferentes
        this.randomCar();

        // Adicionando colisões
            this.physics.add.overlap(this.playerCar, this.objects, () =>{  // condição quando o carro do jogador atinge os outros              
                    this.playerCar.y -= this.objectsConfig.screenSpeed -6;//velocidade contrária ao jogo
            }); 
            
            this.placar = this.add.text(10, 10, 'Pontos: 0', { fontSize: '20px', fill: '#fff' });
            this.gameControls.restartBt = this.add.image(this.game.config.width / 2, (this.game.config.height / 2)+ 100, 'restartBt').setVisible(false);
            this.gameControls.restartBt.setInteractive();
            //ação ao clicar o botão de reiniciar
            this.gameControls.restartBt.on('pointerdown', () =>{
                if(this.gameControls.over)
                {
                    this.gameControls.over = false;
                    this.gameControls.score = 0;
                    this.scene.restart();
                }
            });
    }

    update() {

        //avalia a condição do fim do jogo
        if(this.gameControls.over)
        {
            return;
        }
        if(this.playerCar.y >= 600)
        {
            this.gameOver();
        }

        //velocidade da tela
        this.bg.y -= this.objectsConfig.screenSpeed;

        //recarregando a tela
        if(this.bg.y > this.bg.y_end)
        {
            this.bg.y = this.bg.y_start;
        }
        this.bg.obj.y = this.bg.y;

        //atualizando o placar
        this.placar.setText('Pontos: ' + this.gameControls.score);

        //aumentando a velocidade de acordo com os pontos
        if(((this.gameControls.score % 400)+1) === ((Math.floor(this.gameControls.score/400))) && this.gameControls.score >= 200)
        {
            this.objectsConfig.screenSpeed -=0.5;
            this.gameControls.score +=1;
        }

        //velocidade dos objetos em cena e atualizando a posição
        this.faquir.camaFaquir1.y -=this.objectsConfig.screenSpeed;
        this.faquir.camaFaquir2.y -=this.objectsConfig.screenSpeed;

        if(this.faquir.camaFaquir1.y > 600)
        {
            this.faquir.camaFaquir1.y = -600;
        }
        if(this.faquir.camaFaquir2.y > 600)
        {
            this.faquir.camaFaquir2.y = -800;
        }

        // Movendo os carros para baixo
        this.objects.children.iterate(carro => {
            carro.y -= this.objectsConfig.screenSpeed;

            // Quando sair da tela o carro volta pra cima
            if (carro.y > 600) {
                carro.y = this.positionsY[Phaser.Math.Between(0,this.positionsY.length - 1)];
                Phaser.Utils.Array.Shuffle(this.positionsX); // Embaralha as posicoes
                carro.x = this.positionsX[Phaser.Math.Between(0, this.positionsX.length - 1)];
                this.gameControls.score +=10;
            }
        });

        //movimento do carro
        if(this.keyboard.up.isDown)
            {
                this.playerCar.y -=1;
                this.boost.setVisible(true);
                this.boost.setPosition(this.playerCar.x, this.playerCar.y + 20);
            }
        else if(this.keyboard.down.isDown)
            {
                    this.playerCar.y +=1;
            }
        if(this.keyboard.left.isDown && this.keyboard.right.isUp)
            {
                this.playerCar.x -= 1;
                this.playerCar.setAngle(-15);
            }
        else if(this.keyboard.left.isUp)
            {
                this.playerCar.setAngle(0);
            }

        if(this.keyboard.right.isDown && this.keyboard.left.isUp)
            {
                this.playerCar.x += 1;
                this.playerCar.setAngle(15);
            }
        else if(this.keyboard.right.isUp && this.keyboard.left.isUp)
            {
                this.playerCar.setAngle(0);
            }
        if(this.keyboard.left.isDown && this.keyboard.right.isDown)
            {
                this.playerCar.setAngle(0);
            }
            //condições quando estiver usando o boost
        if(this.keyboard.up.isUp)
            {
                this.boost.setVisible(false);
            }
        if(this.keyboard.left.isDown && this.keyboard.up.isDown)
            {
                this.boost.setVisible(true);
                this.boost.setAngle(-15);
                this.boost.setPosition(this.playerCar.x + 4,this.playerCar.y + 20)
            }
        else if(this.keyboard.left.isUp && this.keyboard.up.isUp)
            {
                this.boost.setVisible(false);
            }
        if(this.keyboard.right.isDown && this.keyboard.up.isDown)
            {
                this.boost.setVisible(true);
                this.boost.setAngle(15);
                this.boost.setPosition(this.playerCar.x - 4,this.playerCar.y + 20)
            }
        else if(this.keyboard.right.isUp && this.keyboard.up.isUp)
            {
                this.boost.setVisible(false);
            }

    }

    //função de fim de jogo
    gameOver() {
        this.physics.pause();
        this.playerCar.setTint(0xff0000);
        this.gameControls.over = true;

        this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'gameOver');
        this.gameControls.restartBt.visible = true;
    }

    //coloca carros aleatórios na tela
    randomCar() {
    
        Phaser.Utils.Array.Shuffle(this.positionsX); // embaralha posicoes
        Phaser.Utils.Array.Shuffle(this.positionsY);

        for (var i = 0; i < this.objectsConfig.count; i++) {
            var x = this.positionsX[i % this.positionsX.length]; // pega posicoes aleatórias x
            var y = this.positionsY[i]; //pega posicoes aleatorias y

            var tipoCarro = Phaser.Math.RND.pick(['carroAzul', 'carroVerde', 'carroAmarelo', 'carroVermelho']);
            
        

            this.objects.create(x, y, tipoCarro);


            
            
        }
    }
}

