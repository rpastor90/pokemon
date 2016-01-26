/* jshint browser:true */
/* globals PIXI, requestAnimationFrame */
(function() {

    document.addEventListener('DOMContentLoaded', function() {
        // create an new instance of a pixi stage
        var stage = new PIXI.Container();

        //initiate DUST
        var d = new Dust(PIXI);

        // create a renderer instance
        var width = screen.availWidth;
        var height = screen.availHeight;
        var renderer = new PIXI.WebGLRenderer(width, height, {backgroundColor : 0xFFFFFF});

        // add the renderer view element to the DOM
        document.body.appendChild(renderer.view);

        requestAnimationFrame(gameLoop);

        var noFighting = true;

        var bgSprite = new PIXI.Sprite.fromImage("asset/mountain.jpg");
        bgSprite.height = height;
        bgSprite.width = width;
        stage.addChild(bgSprite);
    
        var grass = new PIXI.Sprite.fromImage("asset/pgrass.png");
        grass.position.x = (width / 5) * 4;
        grass.position.y = (height / 10) + 30;
        grass.anchor.x = 0.5;
        grass.anchor.y = 0.5;
        stage.addChild(grass);

        // create a texture from an image path
        var texture = PIXI.Texture.fromImage("asset/charizard/charizard0.png");
        var texture2 = PIXI.Texture.fromImage("asset/pikachu.png");
        
        // SPLASH SCREEN
        var splashText = new PIXI.Text (
              "BATTLE!",
              {font: "60px sans-serif", fill: "black", padding: 0, margin: 0}
            );

        splashText.anchor.x = 0.5;
        splashText.anchor.y = 0.5;
        splashText.x = width / 2 ;
        splashText.y = height / 2 ;
        splashText.interactive = true;

        stage.addChild(splashText);

        splashText.click = splashText.tap = function () {
            stage.removeChild(splashText);
            noFighting = false;
        };


        // create a new Sprite using the texture
        var charizard = new PIXI.Sprite(texture);
        var pikachu = new PIXI.Sprite(texture2);
        charizard.interactive = true;
        pikachu.interactive = true;
        charizard.buttonMode = true;
        pikachu.buttonMode = true;
        // character attributes
        pikachu.health = 200;
        charizard.health = 200;


        // CHARIZARD add health bar 
        var charizardName = new PIXI.Text (
          "Charizard",
          {font: "15px sans-serif", fill: "black", padding: 0, margin: 0}
        );
        charizardName.x = 10;
        charizardName.y = 20;

        stage.addChild(charizardName);

        

        // PIKA HEALTH BAR
        var pikachuName = new PIXI.Text (
          "Pikachu",
          {font: "15px sans-serif", fill: "black", padding: 0, margin: 0}
        );
        pikachuName.x = (width / 5) * 2;
        pikachuName.y = ((height / 5) * 4) - 20;

        stage.addChild(pikachuName);




        // center the sprites anchor point
        charizard.anchor.x = 0.5;
        charizard.anchor.y = 0.5;
        charizard.height = 120;
        charizard.width = 120;

        pikachu.anchor.x = 0.5;
        pikachu.anchor.y = 0.5;

        // move the sprite to the center of the screen
        charizard.position.x = (width / 5) * 4;
        charizard.position.y = height / 10;

        pikachu.position.x = (width / 5);
        pikachu.position.y = (height /5) * 4;

        stage.addChild(charizard);
        stage.addChild(pikachu);

        

        var texture3;
        var fireContainer;
        var texture4;
        var lightningContainer;

        var counter = 0;

            function createFire () {
                // LET THERE BE FIRE
                texture3 = PIXI.Texture.fromImage("asset/fire1.png");
                fireContainer = new PIXI.ParticleContainer(
                  15000,
                  {alpha: true, scale: true, rotation: true, uvs: true}
                );

                stage.addChild(fireContainer);
                
            }
            function createLightning() {
            // LET THERE BE LIGHTNING
                texture4 = PIXI.Texture.fromImage("asset/lightning.png");
                lightningContainer = new PIXI.ParticleContainer(
                  15000,
                  {alpha: true, position: true, scale: false, rotation: false, uvs: true}
                );

                stage.addChild(lightningContainer);
            }

        function gamePlay () {
            

            var particleStreamFire = d.emitter(200, function () {
                return d.create((width /2), height / 2, function () {
                    return new PIXI.Sprite(texture3);
                },
                fireContainer,
                10,
                0.1,
                true,
                3, 3.14,
                200, 300,
                1, 2,
                0.005, 0.01,
                0.005, 0.01,
                0.05, 0.2
                );
            });

            
            var particleStreamLgt = d.emitter(200, function () {
                return d.create((width /2), height / 2, function () {
                    return new PIXI.Sprite(texture4);
                },
                lightningContainer,
                3,
                0,
                true,
                5.0, 5.9,
                150, 200,
                1, 2,
                0.005, 0.01,
                0.005, 0.01,
                0.05, 0.1
                );
            });


            charizard.mousedown = charizard.touchstart = function(data)
            {
                if (noFighting === false) {
                    createFire();
            //      data.originalEvent.preventDefault()
                    // store a refference to the data
                    // The reason for this is because of multitouch
                    // we want to track the movement of this particular touch
                    this.data = data;
                    this.alpha = 0.9;
                    this.dragging = true;
                    charizard.x -= 50;
                    charizard.y += 50;

                    // pika hurt
                    pikachu.alpha = 0.4;
                }
            };
            // set the events for when the mouse is released or a touch is released
            charizard.mouseup = charizard.mouseupoutside = charizard.touchend = charizard.touchendoutside = function(data)
            {
                if (noFighting === false) {
                    this.alpha = 1;
                    this.dragging = false;
                    // set the interaction data to null
                    this.data = null;

                    //move charizard back
                    charizard.position.x = (width / 5) * 4;
                    charizard.position.y = height / 10;

                    // hurt pikachu
                    if (pikachu.health >= 0) pikachu.health -= 20;
                    pikachu.alpha = 1;


                    //stop fire
                    stage.removeChild(fireContainer);
                    particleStreamFire.stop();

                }
            };
            
            // set the callbacks for when the mouse or a touch moves
            charizard.mousemove = charizard.touchmove = function(data)
            {
                if(this.dragging && noFighting === false)
                {
                    particleStreamFire.play();
                    if (pikachu.health >= 0) pikachu.health -= 1;
                    // need to get parent coords..
                    // var newPosition = this.data.data.getLocalPosition(this.parent);
                    // this.position.x = newPosition.x;
                    // this.position.y = newPosition.y;
                }
            }

            pikachu.mousedown = pikachu.touchstart = function(data)
            {
                if (noFighting === false) {
                    createLightning();
            //      data.originalEvent.preventDefault()
                    // store a refference to the data
                    // The reason for this is because of multitouch
                    // we want to track the movement of this particular touch
                    this.data = data;
                    this.alpha = 0.9;
                    this.dragging = true;
                    pikachu.x += 50;
                    pikachu.y -= 50;

                    //char hurt
                    charizard.alpha = 0.4;
                }
                
            };
            
            // set the events for when the mouse is released or a touch is released
            pikachu.mouseup = pikachu.mouseupoutside = pikachu.touchend = pikachu.touchendoutside = function(data)
            {
                if (noFighting === false) {
                    this.alpha = 1;
                    this.dragging = false;
                    // set the interaction data to null
                    this.data = null;

                    // move pika back
                    pikachu.position.x = (width / 5);
                    pikachu.position.y = (height /5) * 4;

                    // char hurt
                    if (charizard.health >= 0) charizard.health -= 20;
                    charizard.alpha = 1;
                    stage.removeChild(lightningContainer);
                    particleStreamLgt.stop();
                }
            };
            
            // set the callbacks for when the mouse or a touch moves
            pikachu.mousemove = pikachu.touchmove = function(data)
            {
                if(this.dragging && noFighting === false)
                {
                    // Lightning play
                    particleStreamLgt.play();
                    if (charizard.health >= 0) charizard.health -= 1;
                    // need to get parent coords..
                    // var newPosition = this.data.data.getLocalPosition(this.parent);
                    // this.position.x = newPosition.x;
                    // this.position.y = newPosition.y;
                }
            };
            
        }

        function lifeUpdate () {
            var winnerText;

            if (charizard.health <= 0) {
                charizard.health = 0;
                stage.removeChild(charizard);
                stage.removeChild(charizardName);
                charHealthBar.removeChild(innerBar);
                charHealthBar.removeChild(outerBar);
                stage.removeChild(charHealthBar);
                winnerText = new PIXI.Text (
                      "Pikachu WINS!",
                      {font: "40px sans-serif", fill: "black", padding: 0, margin: 0}
                    );

                winnerText.anchor.x = 0.5;
                winnerText.anchor.y = 0.5;
                winnerText.x = width / 2 ;
                winnerText.y = height / 2 ;
                winnerText.interactive = true;

                stage.addChild(winnerText);

            }
            if (pikachu.health <= 0) {
                pikachu.health = 0;
                stage.removeChild(pikachu);
                stage.removeChild(pikachuName);
                pikaHealthBar.removeChild(innerBar);
                pikaHealthBar.removeChild(outerBar);
                stage.removeChild(pikaHealthBar);
                winnerText = new PIXI.Text (
                      "Charizard WINS!",
                      {font: "40px sans-serif", fill: "black", padding: 0, margin: 0}
                    );

                winnerText.anchor.x = 0.5;
                winnerText.anchor.y = 0.5;
                winnerText.x = width / 2 ;
                winnerText.y = height / 2 ;
                winnerText.interactive = true;

                stage.addChild(winnerText);
            }
            // CHAR health
            charHealthBar = new PIXI.DisplayObjectContainer();
            charHealthBar.position.set(10, 40);
            stage.addChild(charHealthBar);

            //Create the black background rectangle
            var innerBar = new PIXI.Graphics();
            innerBar.beginFill(0x000000);
            innerBar.drawRect(0, 0, 200, 8);
            innerBar.endFill();
            charHealthBar.addChild(innerBar);
            // charizard health rectangle
            var outerBar = new PIXI.Graphics();
            outerBar.beginFill(0x00FF00);
            outerBar.drawRect(0, 0, charizard.health, 8);
            outerBar.endFill();
            charHealthBar.addChild(outerBar);

            charHealthBar.outer = outerBar;

            //PIKA health
            pikaHealthBar = new PIXI.DisplayObjectContainer();
            pikaHealthBar.position.set(( width / 5 ) * 2, (height/ 5) * 4);
            stage.addChild(pikaHealthBar);

            //Create the black background rectangle
            var innerBar = new PIXI.Graphics();
            innerBar.beginFill(0x000000);
            innerBar.drawRect(0, 0, 200, 8);
            innerBar.endFill();
            pikaHealthBar.addChild(innerBar);

            //Create the front red rectangle
            var outerBar = new PIXI.Graphics();
            outerBar.beginFill(0x00FF00);
            outerBar.drawRect(0, 0, pikachu.health, 8);
            outerBar.endFill();
            pikaHealthBar.addChild(outerBar);

            pikaHealthBar.outer = outerBar;
        }

        function gameLoop() {
            requestAnimationFrame(gameLoop);
            d.update();
            lifeUpdate();
            gamePlay();
            // render the stage
            renderer.render(stage);
        }
    }, false);

}());
