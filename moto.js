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


    //input color setup
    function startup(){
        color1Input = document.getElementById("inputColor1");
        color2Input = document.getElementById("inputColor2");
        tail1Color = defaultColor;
        tail2Color = defaultColor;
        color1Input.addEventListener("change", updateFirst, false);
        color2Input.addEventListener("change", updateFirst, false);
    }

    function updateFirst(event){
        if(event.target.id === "inputColor1"){
            tail1Color = event.target.value;
        }
        else{
            tail2Color = event.target.value;
        }
    }

    function restartGame(){
        //hideOrClearElement("resetButton", true);
        clearInterval(refreshIntervalId);
        endGame = false;
        game();
    }

 function game(){
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
     var lightCycle1_y = NUM_CELLS_VERTICAL - 2;
     var lightCycle1_vx = 0; // positive for right
     var lightCycle1_vy = -1; // positive for down
     var lightCycle1_alive = true;
     
     grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED1; // to mark the initial grid cell as occupied
     
     // Current position and direction of light cycle 2
     var lightCycle2_x = NUM_CELLS_HORIZONTAL / 2;
     var lightCycle2_y = 2 ;
     var lightCycle2_vx = 0; // positive for right
     var lightCycle2_vy = 1; // positive for down
     var lightCycle2_alive = true;
     
     grid[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED2; // to mark the initial grid cell as occupied

     var endGame = false
    // Creates a 2D array filled with zeros
    function fillRectancle(){
        C.fillStyle = "#000000";
        C.fillRect(0,0,canvas.width,canvas.height);
    }

    function draw(){
        fillRectancle();

        for ( var i = 0; i < NUM_CELLS_HORIZONTAL; ++i ) {
            for ( var j = 0; j < NUM_CELLS_VERTICAL; ++j ) {
                if ( grid[i][j] === CELL_OCCUPIED1 ){
                        C1.fillStyle = tail1Color ;
                        C1.fillRect( x0+i*cellSize+1, y0+j*cellSize+1, cellSize-2, cellSize-2 );
                }
                else if ( grid[i][j] === CELL_OCCUPIED2 ){
                        C2.fillStyle = tail2Color;
                        C2.fillRect( x0+i*cellSize+1, y0+j*cellSize+1, cellSize-2, cellSize-2 );
                }
            }
        }
        C1.fillStyle = lightCycle1_alive ? "#ff0000" : "#FFFFFF";
        C1.fillRect( x0+lightCycle1_x*cellSize, y0+lightCycle1_y*cellSize, cellSize, cellSize );
        C2.fillStyle = lightCycle2_alive ? "#ff0000" : "#FFFFFF";
        C2.fillRect( x0+lightCycle2_x*cellSize, y0+lightCycle2_y*cellSize, cellSize, cellSize );
        
        if(endGame){
            clearInterval(refreshIntervalId);
            endGame = false;
            //ici dans le onclick recommencer
            addToDom("gameMenu", '<button id="resetButton" onclick="restartGame()" >Restart</button>');

            
        }
    }
     //Ajout des EventListener pour la souris
     canvas.addEventListener("mousedown", mouseDown);
     canvas.addEventListener("mouseup", mouseUp);

     //Coordonées de la souris clique down et up
     var pX0 = 0;
     var pY0 = 0;
     var pX1 = 0;
     var pY1 = 0;

     function mouseDown (e) {
         console.log("mouseDown event");
         pX0 = e.offsetX;
         pY0 = e.offsetY;
         console.log(pX0+","+pY0);
         
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
          elem.style.display = "block";
        }
    }
        //fonction qui ajoute au Dom des éléments
    // ***elementid : le id de l'element du dom
    // ***element qu'on veux ajouter au Dom exemple : '<button id="resetButton" onclick="restartGame()">Restart</button>'
    function addToDom(elementId, domElement ){
        document.getElementById(elementId).innerHTML += domElement; 
    }
    //recommence le game et elle hide le button restart
   
    function keyDownHandler(e) {
            // console.log("keyCode: " + e.keyCode );
            // e = e || window.event;
        
            // light cycle 1
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
            }
            //light cycle 2
            else if (e.keyCode === 87) { // w key
                lightCycle2_vx = 0;
                lightCycle2_vy = -1;
            }
            else if (e.keyCode === 83) { // S  key
                lightCycle2_vx = 0;
                lightCycle2_vy = 1;
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

 
        var advance1 = function() {
        
            if ( lightCycle1_alive && lightCycle2_alive) {

                var new1_x = lightCycle1_x + lightCycle1_vx;
                var new1_y = lightCycle1_y + lightCycle1_vy;

                var new2_x = lightCycle2_x + lightCycle2_vx;
		        var new2_y = lightCycle2_y + lightCycle2_vy;
                // Check for collision with grid boundaries and with trail
                if (
                    new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL || new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
                    || grid[new1_x][new1_y] === CELL_OCCUPIED1 || grid[new2_x][new2_y] === CELL_OCCUPIED2
                ) {
                    lightCycle1_alive = false;
                    endGame = true;
                }
                else if (
                    new2_x < 0 || new2_x >= NUM_CELLS_HORIZONTAL
                    || new2_y < 0 || new2_y >= NUM_CELLS_VERTICAL
                    || grid[new2_x][new2_y] === CELL_OCCUPIED2
                    || grid[new2_x][new2_y] === CELL_OCCUPIED1

                ) {
                    lightCycle2_alive = false
                    console.log("2"+lightCycle2_alive);
        
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
                draw();
            }
        }
    
        refreshIntervalId = setInterval( function() { 
            advance1();
        }, 100 /*milliseconds*/ );
    }
    game();
    
    
