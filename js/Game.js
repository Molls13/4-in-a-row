class Game{
    constructor(board, players, ready){
        this.board = new Board();
        this.players = this.createPlayers();
        this.ready = false;

    }
    /** 
     * Creates two player objects
     * @return  {Array}    An array of two Player objects.
     */

    createPlayers(){
        const players = [new Player(1, 'Player1', '#e15258', true),
                        new Player(2, 'Player2', '#e59a13' )]; //no active argument bc its set to default value
        return players;
    }

    startGame(){
        this.board.drawHTMLBoard();
        this.activePlayer.activeToken.drawHTMLToken();
        this.ready = true;
    }
    
    
    //gets game ready for play

    get activePlayer(){
        return this.players.find(player => player.active);
    }

    handleKeyDown (e){
        if (this.ready){
            if (e.key === "ArrowLeft"){
                this.activePlayer.activeToken.moveleft();
            } else if (e.key === "ArrowRight"){
                this.activePlayer.activeToken.moveright(this.board.columns);
            } else if (e.key === "ArrowDown"){
                this.playToken()
            }
        }
    }

    playToken(){
        let spaces = this.board.spaces;
        let activeToken = this.activePlayer.activeToken;
        let targetColumn = spaces[activeToken.columnLocation];
        let targetSpace = null;
        for( let space of targetColumn){
            if (space.token === null) {
                targetSpace = space;
            }
        }

        if(targetSpace !== null){
            game.ready = false;
            activeToken.drop(targetSpace, function(){
                game.updateGameState(activeToken, targetSpace);
            });
        }
    }

    checkForWin(target){
        const owner = target.token.owner;
        let win = false;
    
        // vertical
        for (let x = 0; x < this.board.columns; x++ ){
            for (let y = 0; y < this.board.rows - 3; y++){
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x][y+1].owner === owner && 
                    this.board.spaces[x][y+2].owner === owner && 
                    this.board.spaces[x][y+3].owner === owner) {
                        win = true;
                }           
            }
        }
    
        // horizontal
        for (let x = 0; x < this.board.columns - 3; x++ ){
            for (let y = 0; y < this.board.rows; y++){
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x+1][y].owner === owner && 
                    this.board.spaces[x+2][y].owner === owner && 
                    this.board.spaces[x+3][y].owner === owner) {
                        win = true;
                }           
            }
        }
    
        // diagonal
        for (let x = 3; x < this.board.columns; x++ ){
            for (let y = 0; y < this.board.rows - 3; y++){
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x-1][y+1].owner === owner && 
                    this.board.spaces[x-2][y+2].owner === owner && 
                    this.board.spaces[x-3][y+3].owner === owner) {
                        win = true;
                }           
            }
        }
    
        // diagonal
        for (let x = 3; x < this.board.columns; x++ ){
            for (let y = 3; y < this.board.rows; y++){
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x-1][y-1].owner === owner && 
                    this.board.spaces[x-2][y-2].owner === owner && 
                    this.board.spaces[x-3][y-3].owner === owner) {
                        win = true;
                }           
            }
        }
    
        return win;
    }

    switchPlayers(){
        for (let player of this.players){
            if (player.active){
                player.active = false;
            } else if (!player.active){
                player.active = true;
            }
        }
    }

    gameOver(message){  
            document.getElementById('game-over').style.display = 'block';
            document.getElementById('game-over').textContent = message;
    }

    updateGameState(token, target){
        target.mark(token);
        if (!this.checkForWin(target)){
            console.log('no win');

            this.switchPlayers();
        
            if (this.activePlayer.checkTokens()) {
                this.activePlayer.activeToken.drawHTMLToken();
                this.ready = true;
            } else {
                this.gameOver('No more tokens');
            }
        } else {
			console.log('win');
            this.gameOver(`${target.owner.name} wins!`)
        }
    }


}