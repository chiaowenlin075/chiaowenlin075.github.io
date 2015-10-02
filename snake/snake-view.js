(function () {
  if (typeof Snakes === "undefined") {
    window.Snakes = {};
  }

  var View = Snakes.View = function (board, $el) {
    this.$el = $el;
    this.$snakeContent = this.$el.find(".snake-content");
    this.board = board;
    this.highestScore = 0;
    this.initialize();
    this.bindHandlers();
  };

  View.prototype.initialize = function(){
    this.setupBoard();
    this.speedOptionButton();
    this.$el.find(".highest-score").remove();
    var $highScore = $("<h3 class='highest-score'>");
    $highScore.text("Your highest score: " + this.highestScore);
    $highScore.insertBefore(this.$snakeContent);
  };

  View.prototype.bindHandlers = function(){
    this.handleChooseSpeed();
    this.handlekeypress();
    this.playAgain();
  };

  View.prototype.handleChooseSpeed = function () {
    this.$snakeContent.on("click", "button.speed-option", function(event){
      event.preventDefault();
      var option = $(event.currentTarget).data("speed");
      this.board.speed = option * 1000;
      this.$snakeContent.find(".speed-choices").remove();
      this.$snakeContent.append("<h2 class='score'>Score: " + this.board.score + "<h2>");
      this.makeMove();
    }.bind(this));
  };

  View.prototype.playAgain = function(){
    this.$snakeContent.on("click", "button.play-again", function(event){
      event.preventDefault();
      this.$snakeContent.empty();
      this.board = new Snakes.Board(12, 0.5);
      this.initialize();
    }.bind(this));
  };

  View.prototype.makeMove = function () {
    var intervalId = setInterval(function(){
      this.board.snake.move();
      this.board.generateApple();
      if (!this.board.onBoard() || this.board.snake.eatSelf()) {
        this.$snakeContent.append("<h2 class='lose-msg'>Oops, You died :(</h2>");
        this.$snakeContent.append("<button class='play-again'>Play Again!</button>");
        clearInterval(intervalId);
      } else {
        this.render();
      }
    }.bind(this), this.board.speed);
  };

  View.prototype.setupBoard = function () {
    var $ul = $("<ul class='snake-grid group'>");
    for (var i = 0; i < this.board.grid.length; i++){
      for (var j = 0; j < this.board.grid.length; j++){
        var $li = $("<li class='grid-square'>");
        $li.attr("data-pos", [i, j]);
        $ul.append($li);
      };
    };
    this.$snakeContent.append($ul);
  };

  View.prototype.speedOptionButton = function(){
    var $fastOption = $("<button>").text("Master")
                                   .addClass("speed-fast speed-option")
                                   .data("speed", 0.08);
    var $normalOption = $("<button>").text("Regular")
                                     .addClass("speed-normal speed-option")
                                     .data("speed", 0.12);
    var $slowOption = $("<button>").text("Beginner")
                                   .addClass("speed-slow speed-option")
                                   .data("speed", 0.5);
    var $buttonDiv = $("<div class='speed-choices group'>");
    $buttonDiv.append($fastOption, $normalOption, $slowOption);
    this.$snakeContent.prepend($buttonDiv);
  };

  View.prototype.render = function(){
    this.cleanUpBoard();
    var snakePos = this.board.snake.allPos();
    var apple = [this.board.apple.row, this.board.apple.col];
    snakePos.forEach(function(el){
      $("[data-pos='" + el + "']").addClass("snake-body");
    })

    $("[data-pos='" + apple + "']").addClass("apple");
    this.$snakeContent.find(".score").text("Score: " + this.board.score);
    if (this.highestScore < this.board.score){
      this.highestScore = this.board.score;
      this.$el.find(".highest-score")
              .text("Your highest score: " + this.highestScore);
    };
  };

  View.prototype.cleanUpBoard = function(){
    this.$snakeContent.find(".grid-square")
                      .removeClass("apple")
                      .removeClass("snake-body");
  };

  View.prototype.handlekeypress = function(){
    $(document).on("keydown", function(event){
      event.preventDefault();
      if (!this.board.snake.canTurn) { return; };
      if ([37, 38, 39, 40].indexOf(event.keyCode) !== -1) {
        this.board.snake.canTurn = false;
      };
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
