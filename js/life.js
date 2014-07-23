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
        play: function(){
            this.prevBoard = cloneArray(this.board);

            for(var y=0; y<this.height;y++){
                for(var x=0; x<this.width;x++){
                    var neighbors = this.aliveNeighbors(this.prevBoard,x,y);
                    // console.log(y,x,": ",neighbors);

                    var alive = !!this.board[y][x];

                    switch (true) {
                        case neighbors < 2 && alive:
//                            console.log('under-population');
                            this.board[y][x] = 0;
                            break;
                        case (neighbors === 2 || neighbors === 3 )&& alive:
//                            console.log('goldilocks');
                            this.board[y][x] = 1;
                            break;
                        case neighbors > 3 && alive:
//                            console.log('overpopulation');
                            this.board[y][x] = 0;
                            break;
                        case neighbors === 3 && !alive:
//                            console.log('reproduction');
                            this.board[y][x] = 1;
                            break;
                        default:
//                            console.log('continue being dead');
                            this.board[y][x] = 0;
                    }
                }
            }
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


    // helper
    function cloneArray(array){
        return array.slice().map(function (row) {return row.slice();});
    }

})();

(function(){
    var _ = self.LifeView = function(table,size){
        this.grid = table;
        this.size = size;
        this.started = false;

        this.createGrid();
    };

    _.prototype = {
        createGrid: function (){
            var me = this;
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

            this.grid.addEventListener('change',function(evt){
                if (evt.target.nodeName.toLowerCase() === 'input'){
                    me.started = false;
                }
            });

            this.grid.addEventListener('keyup',function(evt){

            });

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
            this.game = new Life(this.boardArray);
        },
        clear:function(){
            this.game.clear();

            this.createGrid();
        },
        play : function(){
            var me = this;
            if(!this.started || this.game){
                this.setUpGame();
            }
            this.game.play();



            var board = this.game.board;

            for(var y=0;y<this.size;y++){
                for(var x=0;x<this.size;x++){
                    this.checkboxes[y][x].checked = !!board[y][x];
                }
            }

            setTimeout(function(){
                me.play();
            },1000);

        }
    };

})();

var lifeView = new LifeView(document.getElementById('grid'),12);


$('button.play').addEventListener('click',function(event){
    lifeView.play();

});
