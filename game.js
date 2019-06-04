var characterId;
var opponentId;
var characterChosen = false;
var opponentChosen = false;
var opponentsLeft;
var characterHealth;
var opponentHealth;
var characterBaseAttack;
var characterAttack;
var opponentAttack;
var timesClicked = 0;
var emptiedImages = [];

function resetGame() {
  $("#your-character-img").empty();
  $("#opponent-img").empty();
  emptiedImages.forEach(function(element, index) {
    $("#character-images").append(element);
  });

  $(".image-padding").each(function() {
    playerName = $(this).attr("id");
    $("#" + playerName).removeClass("red-padding");
    $("#" + playerName).addClass("green-padding option");
    $("#stat-" + playerName).text("Overall: " + $(this).attr("attack"));
    $("#hp-" + playerName).empty();
    $("#character-images").append($(this));
    $("#instructions").text("Choose your player");
    $("#instructions").removeClass("green-font red-font");
    $("#instructions").addClass("blink green-font");
    characterChosen = false;
    opponentChosen = false;
    opponentsLeft = $(".image-padding").length - 1;
    emptiedImages = [];
    timesClicked = 0;
  });

  $(document).ready(gameplay);
}

function gameplay() {
  $(".image-padding").each(function() {
    playerName = $(this).attr("id");
    $("#stat-" + playerName).text("Over: " + $(this).attr("attack"));
  });

  opponentsLeft = $(".image-padding").length - 1;

  var chooseCharacter = $(".option");
  chooseCharacter.unbind("click");
  chooseCharacter.on("click", function() {
    if (characterChosen === false) {
      characterId = $(this).attr("id");
      $("#" + characterId).removeClass("option");
      $("#your-character-img").append($("#" + characterId));
      $("#instructions").text("Choose Opponent");
      $("#instructions").removeClass("green-font");
      $("#instructions").addClass("red-font");
      $(".option").removeClass("green-padding");
      $(".option").addClass("red-padding");
      characterHealth = parseInt($("#" + characterId).attr("hp"));
      characterBaseAttack = parseInt($("#" + characterId).attr("attack"));
      characterAttack = characterBaseAttack;
      characterChosen = true;
      $("#hp-" + characterId).text("HP: " + characterHealth);

      $(".option").each(function() {
        playerName = $(this).attr("id");
        $("#stat-" + playerName).text("Counter: " + $(this).attr("counter"));
      });
    } else if (characterChosen === true && opponentChosen === false) {
      opponentId = $(this).attr("id");
      $("#" + opponentId).removeClass("option");
      $("#opponent-img").append($("#" + opponentId));
      $("#instructions").text("Click Basketball to Attack Opponent");
      $("#instructions").removeClass("red-font");
      $("#instructions").addClass("black-font");
      $("#instructions").removeClass("blink");
      opponentHealth = parseInt($("#" + opponentId).attr("hp"));
      opponentAttack = parseInt($("#" + opponentId).attr("counter"));
      $("#hp-" + opponentId).text("HP: " + opponentHealth);
      opponentChosen = true;
      audio.pause();
      audio = new Audio("../rpgGame/assets/audio/crowd_noise.mp3");
      audio.loop = true;
      audio.play();
    } else {
    }
  });

  var attackButton = $("#basketball");
  attackButton.unbind("click");
  attackButton.on("click", function() {
    if (
      opponentChosen === true &&
      characterChosen === true &&
      opponentHealth > 0 &&
      characterHealth > 0
    ) {
      characterHealth = characterHealth - opponentAttack;
      opponentHealth = opponentHealth - characterAttack;
      $("#hp-" + characterId).text("HP: " + characterHealth);
      $("#hp-" + opponentId).text("HP: " + opponentHealth);
      timesClicked++;
      characterAttack = characterBaseAttack * (timesClicked + 1);
      $("#stat-" + characterId).text("Attack: " + characterAttack);

      if (opponentHealth <= 0 && characterHealth > 0) {
        opponentsLeft--;
        emptiedImages.push($("#opponent-img").html());
        var name = $("#" + opponentId).attr("name");
        $("#opponent-img").empty();
        $("#instructions").addClass("blink");
        $("#instructions").removeClass("black-font");
        if (opponentsLeft > 0) {
          opponentChosen = false;
          $("#instructions").text("You defeated " + name);
          $("#instructions").append("<br>");
          $("#instructions").append("Choose your next opponent");
          $("#instructions").addClass("red-font");
        } else {
          $("#instructions").text("You are an NBA Champion");
          $("#instructions").append("<br>");
          $("#instructions").append("Game is resetting...");
          $("#instructions").addClass("green-font");
          emptiedImages.push($("#your-character-img").html());
          audio.pause();
          audio = new Audio("../rpgGame/assets/audio/cheer.mp3");
          audio.loop = false;
          audio.play();
          setTimeout(resetGame, 5000);
        }
      }

      if (characterHealth <= 0) {
        emptiedImages.push($("#your-character-img").html());
        emptiedImages.push($("#opponent-img").html());
        $("#your-character-img").empty();
        if (opponentHealth <= 0) $("#opponent-img").empty();
        $("#instructions").addClass("blink");
        $("#instructions").removeClass("black-font");
        $("#instructions").addClass("red-font");
        $("#instructions").text("Better luck next season");
        $("#instructions").append("<br>");
        $("#instructions").append("Game is resetting");
        audio.pause();
        audio = new Audio("../rpgGame/assets/audio/buzzer.mp3");
        audio.loop = false;
        audio.play();
        setTimeout(resetGame, 5000);
      }
    }
  });
}

$(document).ready(gameplay);
