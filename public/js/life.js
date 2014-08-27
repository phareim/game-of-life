// worlds smallest jQuery-port
function $(selector,container){
    return (container || document).querySelector(selector);

}


(function(){

    var _ = self.Life = function(seed) {
        this.seed = seed;
        this.height = seed.length;
        this.width = seed[0].length;

        this.prevBoard = [];
        this.board = cloneArray(seed);
    };

    _.prototype = {
        setNewAliveValue: function (neighbors, alive) {

            function continueBeingDead(){
                return 0;
            }
            function underPopulation() {
                return neighbors < 2 && alive;
            }

            function goldilocks() {
                return (neighbors === 2 || neighbors === 3 ) && alive;
            }

            function overpopulation() {
                return neighbors > 3 && alive;
            }

            function reproduction() {
                return neighbors === 3 && !alive;
            }

            if (goldilocks() || reproduction()) {
                return 1;
            }
            else if (underPopulation() || overpopulation()) {
                return 0;
            }
            else {
                return continueBeingDead();
            }
            

        }, step: function(){
            this.prevBoard = cloneArray(this.board);
            var totalLiveNodes = 0;
            for(var y=0; y<this.height;y++){
                for(var x=0; x<this.width;x++){
                    var neighbors = this.aliveNeighbors(this.prevBoard, x, y);
                    var alive = !!this.board[y][x];
                    totalLiveNodes += alive;
                    this.board[y][x] =
                        this.setNewAliveValue(
                            neighbors,
                            alive);
                }
            }
            if (totalLiveNodes === 0) {
                lifeView.stop();
            };
        },
        aliveNeighbors: function(array,x,y){
            var prevRow = array[y-1]||[];
            var thisRow = array[y];
            var nextRow = array[y+1]||[];

            return [
                prevRow[x-1], prevRow[x]  , prevRow[x+1],
                thisRow[x-1], thisRow[x+1],
                nextRow[x-1], nextRow[x]  , nextRow[x+1]
            ].reduce(function (prev,current){
                    return prev + (+!!current);
                },0);
        },
        toString: function (){
            return this.board.map(function(row){return row.join(' ');}).join('\n');
        },
        clear: function (){
            this.board = [];
        }
    };

    function cloneArray(array){
        return array.slice().map(function (row) {return row.slice();});
    }

})();

(function(){
    var _ = self.LifeView = function(table,size){
        this.grid = table;
        this.size = size;
        this.initiated = false;
        this.running = false;

        this.createGrid();
    };

    _.prototype = {
        createGrid: function (){

            var fragment = document.createDocumentFragment();
            this.grid.innerHTML = '';
            this.checkboxes = [];

            for(var y=0; y<this.size;y++){
                var row = document.createElement('tr');
                this.checkboxes[y] = [];

                for(var x = 0; x<this.size;x++){
                    var cell = document.createElement('td');
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    this.checkboxes[y][x] = checkbox;

                    cell.appendChild( checkbox );
                    row.appendChild( cell );
                }
                fragment.appendChild(row);
            }

            this.grid.appendChild(fragment);
        },
        get boardArray(){
            return this.checkboxes.map(function(row){
                return row.map(function(box){
                    return (+box.checked);
                });
            });
        },
        setUpGame : function(){
            if(!this.initiated || this.game){
                this.game = new Life(this.boardArray);
            }
            this.running = true;

        },
        clear:function(){
            this.game.clear();
            this.createGrid();
        },
        checkBoxes: function () {
            var board = this.game.board;

            for (var y = 0; y < this.size; y++) {
                for (var x = 0; x < this.size; x++) {
                    this.checkboxes[y][x].checked = !!board[y][x];
                }
            }
        },
        step : function(){
            var me = this;

            this.game.step();
            this.checkBoxes();
            if(this.running){
                setTimeout(function(){
                    me.step();
                },1000);
            }
        },
        stop: function(){
            this.running = false;
        }
    };

})();

var lifeView = new LifeView(document.getElementById('grid'),document.getElementById('boardsize').value);


$('a.play').addEventListener('click',function(event){
    lifeView.setUpGame();
    lifeView.step();
});
$('a.stop').addEventListener('click',function(event){
    lifeView.stop();
});
$('a.clear').addEventListener('click',function(event){
    lifeView.stop();
    lifeView.clear();
});
