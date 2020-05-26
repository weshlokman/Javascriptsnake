    //quand le window load 
    window.addEventListener("load", startup, false);
    
    //default color 
    var defaultColor = "#FFFFFF";
    //couleur de moto1`
    var tail1Color;
    //couleur de moto1`
    var tail2Color;
    //time
    var refreshIntervalId;
    //time for the speed
    var time = 100;
    //refresh rate
    var refreshRate = 100;


    //game result
    var gameNumber = 0;
    var player1Points = 0;
    var player2Points = 0;
    var stopTime = false;


    //input color setup
    function startup(){
        color1Input = document.getElementById("inputColor1");
        color2Input = document.getElementById("inputColor2");
        tail1Color = defaultColor;
        tail2Color = defaultColor;
        color1Input.addEventListener("change", updateFirst, false);
        color2Input.addEventListener("change", updateFirst, false);
    }
    setUpGame();
    

    //fonction qui permet de hide un element et elle permet aussi de le rendre clear
    // ***domElement : element du Dome quon veut hide
    // ***HideOrclear : on veut le hide = true on ne veut pas = false
    //src w3schools.com/howto/howto_js_toggle_hide_show.asp
    function hideOrClearElement(domElement, HideOrClear){
        var elem = document.getElementById(domElement);
        if (HideOrClear) {
            elem.style.display = "none";
        }
        else {
          elem.style.display = "inline-block";
        }
    }

     //fonction qui ajoute au Dom des éléments
    // ***elementid : le id de l'element du dom
    // ***element qu'on veux ajouter au Dom exemple : '<button id="resetButton" onclick="restartGame()">Restart</button>'
    function addToDom(elementId, domElement ){
        document.getElementById(elementId).innerHTML += domElement; 
    }

    function setUpGame(){
        hideOrClearElement("myCanvas", true);
        hideOrClearElement("spanPoints", true);
        hideOrClearElement("player1Points", true);
        hideOrClearElement("player2Points", true);
        hideOrClearElement("continueButton", true);
        hideOrClearElement("pauseButton", true);
        hideOrClearElement("restartButton", true);
        addToDom("startButton", '<button id="startButton" onclick="startGame()" >Start</button>');

    }

   // document.getElementById('startButton').onclick = function () {
      
    function startGame(){
        hideOrClearElement("myCanvas", false);
        hideOrClearElement("spanPoints", false);
        hideOrClearElement("player1Points", false);
        hideOrClearElement("player2Points", false);
        hideOrClearElement("continueButton", false);
        hideOrClearElement("pauseButton", false);
        hideOrClearElement("restartButton", false);
        hideOrClearElement("startButton", true);
        game();
        
    }

    //
    function speedUp(){
        refreshRate -= 5;
    }



    function updateFirst(event){
        if(event.target.id === "inputColor1"){
            tail1Color = event.target.value;
        }
        else{
            tail2Color = event.target.value;
        }
    }
    
    //recommence le game et elle hide le button restart
    function restartGame(){
        
            clearInterval(refreshIntervalId);
            refreshRate = 100;
            endGame = false;
            stopTime = false;
            game();
    }
    


    //permet de start le game 
    function game(){
        //startInterval();
        // setTimer();
        refreshGame();
        //add to innerHtml 
        pointsSpan = document.getElementById("spanPoints");
        playerPointsSpan1 = document.getElementById("player1Points");
        playerPointsSpan2 = document.getElementById("player2Points");
        pointsSpan.innerHTML = ("Game Number: " + gameNumber);
        playerPointsSpan1.innerHTML = ("Player 1 Points: " + player1Points);
        playerPointsSpan2.innerHTML = ("Player 2 Points: " + player2Points);
        // Creates a 2D array filled with zeros
        var create2DArray = function( numColumns, numRows ) {
            var array = [];
            for ( var c = 0; c < numColumns; c++ ) {
                array.push([]); // adds an empty 1D array at the end of "array"
                for ( var r = 0; r < numRows; r++ ) {
                    array[c].push(0); // add zero at end of the 1D array "array[c]"
                }
            }
            return array;
        }
        
        
        //set le canva et prepare le object pour dessiner
        var canvas = document.getElementById("myCanvas");
        var C = canvas.getContext("2d");
        var C1 = canvas.getContext("2d");
        var C2 = canvas.getContext("2d");
        var canvas_rectangle = canvas.getBoundingClientRect();
        
        var cellSize = 5; // each cell in the grid is a square of this size, in pixels
        
        //width est 700 et le cellsize est 5 pixel donc 140 cells de 5pixels
        var NUM_CELLS_HORIZONTAL = canvas.width / cellSize; //140 cells
        var NUM_CELLS_VERTICAL = canvas.height / cellSize;  //140 cells
        
        
        
        //pos initiale moto 2 
        var x0 = ( canvas.width - NUM_CELLS_HORIZONTAL * cellSize ) /2;
        var y0 = ( canvas.height - NUM_CELLS_VERTICAL * cellSize ) /2;
        console.log(x0);
        console.log(y0);
        
        var grid = create2DArray( NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL );
        var CELL_EMPTY = 0;
        var CELL_OCCUPIED1 = 1;
        var CELL_OCCUPIED2 = 2;

        
        // Current position and direction of light cycle 1
        var lightCycle1_x = NUM_CELLS_HORIZONTAL / 2;
        var lightCycle1_y = NUM_CELLS_VERTICAL - 1;
        var lightCycle1_vx = 0; // positive for right
        var lightCycle1_vy = -1; // positive for down
        var lightCycle1_alive = true;
        
        
        // Current position and direction of light cycle 2
        var lightCycle2_x = NUM_CELLS_HORIZONTAL / 2;
        var lightCycle2_y = -1 ;
        var lightCycle2_vx = 0; // positive for right
        var lightCycle2_vy = 1; // positive for down
        var lightCycle2_alive = true;
        var lightCyle2_pointer

        grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED1; // to mark the initial grid cell as occupied
        grid[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED2; // to mark the initial grid cell as occupied

        var endGame = false;
        
        
        //Contrôle du joueur avec les touches du clavier
        function keyDownHandler(e) {
            // console.log("keyCode: " + e.keyCode );
            // e = e || window.event;
            speedUp();
            if (e.keyCode === 38) { // up arrow
                lightCycle1_vx = 0;
                lightCycle1_vy = -1;
            }
            else if (e.keyCode === 40) { // down arrow
                lightCycle1_vx = 0;
                lightCycle1_vy = 1;
            }
            else if (e.keyCode === 37) { // left arrow
                lightCycle1_vy = 0;
                lightCycle1_vx = -1;
            }
            else if (e.keyCode === 39) { // right arrow
                lightCycle1_vy = 0;
                lightCycle1_vx = 1;

                lightCycle2_vy = 0;
                lightCycle2_vx = 1;
            }
            //light cycle 2
            else if (e.keyCode === 87) { // w key
                lightCycle2_vx = 0;
                lightCycle2_vy = 1;
            }
            else if (e.keyCode === 83) { // S  key
                lightCycle2_vx = 0;
                lightCycle2_vy = -1;
            }
            else if (e.keyCode === 68) { // D key
                lightCycle2_vy = 0;
                lightCycle2_vx = 1;
            }
            else if (e.keyCode === 65) { // A key
                lightCycle2_vx = -1;
                lightCycle2_vy = 0;
        
            }
        }
        
        document.onkeydown = keyDownHandler;

        //Ajout des EventListener pour la souris
        canvas.addEventListener("mousedown", mouseDown);
        canvas.addEventListener("mouseup", mouseUp);

        //Coordonées de la souris clique down et up
        var pX0 = 0;
        var pY0 = 0;
        var pX1 = 0;
        var pY1 = 0;

        function mouseDown (e) {
            setTimeout(function(){ time -= 10; }, 1000);
            console.log("mouseDown event");
            pX0 = e.offsetX;
            pY0 = e.offsetY;
            console.log(pX0+","+pY0);
            speedUp();
        }

        function mouseUp (e) {
            console.log("mouseUp event");
            pX1 = e.offsetX;
            pY1 = e.offsetY;
            console.log(pX1+","+pY1 );
            
            //Appel la fonction mouseControl après avoir recu la position initial et final
            mouseControl();
        }

        //Controle de la souris Partie 4
        var mouseControl = function () {
            
            console.log("In mouse Control");
            var deltaX = pX1 - pX0; 
            var deltaY = pY1 - pY0;
            console.log(deltaX);
            //
            //console.log("Les deltas"+ "("+ deltaX +","+ deltaX +")");
            
            if(Math.abs(deltaX) >  Math.abs(deltaY)) {
                if(deltaX > 0 ) {
                    lightCycle1_vy = 0;
                    lightCycle1_vx = 1;
                }else {
                    //
                    lightCycle1_vy = 0;
                    lightCycle1_vx = -1;
                }
                
            } else if (deltaY > 0) {
                //Geste vers le bas
                lightCycle1_vx = 0;
                lightCycle1_vy = 1;
            } else {
                //Geste vers le haut
                lightCycle1_vx = 0;
                lightCycle1_vy = -1;
            }

            //console.log("deltaX:" + deltaX + "deltaY:" + deltaY); 

        }
    

        //Gère la partie une fois quel est terminé 
        function gamefinish() {

            if(endGame){
                endGame = false;
                gameNumber++;
                clearTimeout(refreshIntervalId);
                stopTime = true;
                if(!lightCycle1_alive && !lightCycle2_alive) {
                    
                    //Si match nulle aucun point pour personne
                    alert("Match Nul!!!");

                } else {

                        if(lightCycle1_alive){
                            alert("Joueur 1 a gagné!!!");
                            player1Points++;
                        }
                        else{
                            alert("Joueur 2 a gagné!!!");
                            player2Points++;
                        }
            }
  
                
            }
        }

        var redraw = function() {
         
            C.fillStyle = "#000000";
            C.fillRect(0,0,canvas.width,canvas.height);
        
            for ( var i = 0; i < NUM_CELLS_HORIZONTAL; ++i ) {
                for ( var j = 0; j < NUM_CELLS_VERTICAL; ++j ) {

                        if ( grid[i][j] === CELL_OCCUPIED1 ){
                            //console.log("le grid "+grid[i][j]);
                            C1.fillStyle = tail1Color ;
                            C1.fillRect( x0+i*cellSize+1, y0+j*cellSize+1, cellSize-2, cellSize-2 );
                            
                        }
                        else if ( grid[i][j] === CELL_OCCUPIED2 ){
                              //  console.log("le grid "+grid[i][j]);
                                C2.fillStyle = tail2Color;
                                C2.fillRect( x0+i*cellSize+1, y0+j*cellSize+1, cellSize-2, cellSize-2 );
                        }

                    
            }
            C1.fillStyle = lightCycle1_alive ? "#ff0000" : "#FFFFFF";
            C1.fillRect( x0+lightCycle1_x*cellSize, y0+lightCycle1_y*cellSize, cellSize, cellSize );
            C2.fillStyle = lightCycle2_alive ? "#ff0000" : "#FFFFFF";
            C2.fillRect( x0+lightCycle2_x*cellSize, y0+lightCycle2_y*cellSize, cellSize, cellSize );
        
            
        
         } 
        }  


        //Pour continuer le jeu 
        document.getElementById('continueButton').onclick = function continueButtonHandler() {
           
            refreshGame(100);
            console.log("DANS le buton continue")

        }
        //Pour mettre le jeu sur Pause
        document.getElementById('pauseButton').onclick =  function pauseButtonHandler() {

            // clearInterval(refreshIntervalId);
            clearTimeout(refreshIntervalId);

            console.log("DANS le buton pause");
        }

        document.getElementById('restartButton').onclick = function restartButtonHandler() {

            restartGame();
            console.log("Dans le boutton restart");
    
        }
      

        //Fonction pour faire avancer les motos
        var advance = function() {
        
            if ( lightCycle1_alive && lightCycle2_alive) {

                var new1_x = lightCycle1_x + lightCycle1_vx;
                var new1_y = lightCycle1_y + lightCycle1_vy;

            
        
                var new2_x = lightCycle2_x + lightCycle2_vx;
                var new2_y = lightCycle2_y + lightCycle2_vy;
        
                

                // Check for collision with grid boundaries and with trail
                if ( new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL 
                    || new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
                    || grid[new1_x][new1_y] === CELL_OCCUPIED1 || grid[new1_x][new1_y] === CELL_OCCUPIED2 ) {
                    
                    lightCycle1_alive = false;
                }
                
                if (new2_x < 0 || new2_x >= NUM_CELLS_HORIZONTAL
                    || new2_y < 0 || new2_y >= NUM_CELLS_VERTICAL
                    || grid[new2_x][new2_y] === CELL_OCCUPIED1 || grid[new2_x][new2_y] === CELL_OCCUPIED2 ) {

                    lightCycle2_alive = false
                } 
                if (!lightCycle1_alive && !lightCycle2_alive) {
                    endGame = true;

                    gamefinish();

                }

                
                else if (!lightCycle1_alive || !lightCycle2_alive){
                    console.log("lightCycle1State : " + lightCycle1_alive + " lightCycle2State : " + lightCycle2_alive);
                    endGame = true;
                    gamefinish();
                }
                else {
                    //Position occuper moto 1
                    grid[new1_x][new1_y] = CELL_OCCUPIED1;
                    //Position occuper moto 2
                    grid[new2_x][new2_y] = CELL_OCCUPIED2;
                    //Nouvelle position moto 1
                    lightCycle1_x = new1_x;
                    lightCycle1_y = new1_y;
                    //Nouvelle position moto 2
                    lightCycle2_x = new2_x;
                    lightCycle2_y = new2_y;
                }

                
                redraw();
                
            }  
            
        
        }

      



      
        
        
      // Refresh/advance game
      function refreshGame() {
        // To run the passed function every 100 milliseconds:
        var timeOut =  setTimeout(function run() {
                advance();
                console.log("running");
                if(stopTime){
                    return;
                }
                refreshIntervalId = setTimeout(function() { run(); }, refreshRate);
            }, 100);
      }


    
}
