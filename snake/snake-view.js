(function () {
  if (typeof Snakes === "undefined") {
    window.Snakes = {};
  }

  var View = Snakes.View = function (board, $el) {
    this.board = board;
    this.$el = $el;
    this.initialize();
    this.handleChooseSpeed();
    this.handlekeypress();
    this.playAgain();
  };

  View.prototype.initialize = function(){
    this.setupBoard();
    this.speedOptionButton();
  };

  View.prototype.handleChooseSpeed = function () {
    this.$el.on("click", "button.speed-option", function(e){
      var option = $(e.currentTarget).data("speed");
      this.board.speed = option * 1000;
      this.makeMove();
    }.bind(this));
  };

  View.prototype.playAgain = function(){
    this.$el.on("click", "button.play-again", function(event){
      event.preventDefault();
      this.$el.empty();
      this.board = new Snakes.Board(12, 0.5);
      this.initialize();
    }.bind(this));
  };

  View.prototype.makeMove = function () {
    var intervalId = setInterval(function(){
      this.board.snake.move();
      this.board.eatApple();
      this.render();
      if (!this.board.onBoard() || this.board.snake.eatSelf()) {
        this.$el.append("<h2 class='lose-msg'>Oops, You died :(</h2>");
        this.$el.append("<button class='play-again'>Play Again!</button>");
        clearInterval(intervalId);
      } else {
        this.board.grid = this.board.makeGrid();
        this.board.placeSnake();
        this.board.placeApple();
      }
    }.bind(this), this.board.speed);
  };

  View.prototype.setupBoard = function () {
    var $ul = $("<ul></ul>").addClass("snake-grid group");
    for (var i = 0; i < this.board.grid.length; i++){
      for (var j = 0; j < this.board.grid.length; j++){
        var $li = $("<li></li>").addClass("grid-square");
        $li.attr("data-pos", [i, j]);
        $ul.append($li);
      };
    };

    this.$el.append($ul);
  };

  View.prototype.speedOptionButton = function(){
    var $fastOption = $("<button>Master</button>").addClass("speed-fast speed-option").data("speed", 0.07);
    var $normalOption = $("<button>Regular</button>").addClass("speed-normal speed-option").data("speed", 0.2);
    var $slowOption = $("<button>Beginner</button>").addClass("speed-slow speed-option").data("speed", 0.5);
    var buttonDiv = $("<div></div>").addClass("button-choices group");
    buttonDiv.append($fastOption, $normalOption, $slowOption);
    this.$el.prepend(buttonDiv);
  };

  View.prototype.render = function(){
    this.$el.empty();
    this.setupBoard();

    var snakePos = this.board.snake.allPos();
    var apple = [this.board.apple.row, this.board.apple.col];
    snakePos.forEach(function(el){
      $("[data-pos='" + el + "']").addClass("snake-body");
    })

    $("[data-pos='" + apple + "']").addClass("apple");
    this.$el.append("<h2 class='score'>Score: " + this.board.score + "</h2>");
  };

  View.prototype.handlekeypress = function(){
    $(document).on("keydown", function(event){
      event.preventDefault();
      switch (event.keyCode) {
        case 37:
          this.board.snake.turn("W");
          break;
        case 38:
          this.board.snake.turn("N");
          break;
        case 39:
          this.board.snake.turn("E");
          break;
        case 40:
          this.board.snake.turn("S");
          break;
      };
    }.bind(this));
  };

})();
