let socket = io();
let userId;
let tableId;
let color;
let turn;

let sendToSocket = (socket, data) => {
  console.log(
    `REQUEST EVENT NAME : ${data.eventName} : REQUEST DATA : ${JSON.stringify(
      data
    )}`
  );
  socket.emit(data.eventName, data);
};

let sessionTableId = sessionStorage.getItem("tableId");
let sessionUserId = sessionStorage.getItem("userId");
if (sessionTableId && sessionUserId) {
  $("#gameInfoBox").addClass("d-none");
  let sinUpData = {
    eventName: "SIGN_UP",
    data: {
      userId: sessionUserId,
      tableId: sessionTableId,
    },
  };
  sendToSocket(socket, sinUpData);
}

function submitEvent() {
  $("form").submit((e) => {
    let userName = $("#userName").val();
    e.preventDefault();
    let signUpData = {
      eventName: "SIGN_UP",
      data: {
        userName: userName,
      },
    };
    sendToSocket(socket, signUpData);
    $("form").addClass("hide");
    setTimeout(() => {
      $("form").addClass("d-none");
    }, 500);
  });
}

submitEvent();

function setBoard(data) {
  let board = data.board;
  document.querySelectorAll(".tile").forEach((element, index) => {
    row = Math.floor(index / 8);
    col = index - row * 8;
    if (board[row][col] == 2) {
      element.innerHTML = `<div class="dice black_dice" id="b"><img src="image/black.png" alt=""></div>`;
    } else if (board[row][col] == 1) {
      element.innerHTML = `<div class="dice red_dice" id="r"><img src="image/red.png" alt=""></img>`;
    } else if (board[row][col] == 5) {
      element.innerHTML = `<div class="dice black_dice king" id="b"><img src="image/black_king.png" alt=""></img>`;
    } else if (board[row][col] == 8) {
      element.innerHTML = `<div class="dice red_dice king" id="r"><img src="image/red_king.png" alt=""></img>`;
    } else {
      element.innerHTML = "";
    }
  });
  if (color == 1) {
    $("#playerScore").html(
      `<img src="./image/red_king.png" alt=""><p >${data.score[0]}</p>`
    );
    $("#animeScore").html(
      `<img src="./image/black_king.png" alt=""><p >${data.score[1]}</p>`
    );
  } else {
    $("#playerScore").html(
      `<img src="./image/black_king.png" alt=""><p >${data.score[1]}</p>`
    );
    $("#animeScore").html(
      `<img src="./image/red_king.png" alt=""><p >${data.score[0]}</p>`
    );
  }
}

function setDiceEvent() {
  let dice;
  console.log("rrrr");
  console.log("color000000000000000000", color);
  if (color == 1) {
    $("#board").addClass("rotate");
    dice = document.querySelectorAll(".red_dice");
  } else {
    dice = document.querySelectorAll(".black_dice");
  }
  dice.forEach((element) => {
    element.addEventListener("click", () => {
      let king = element.classList.contains("king");
      let parentElement = element.parentElement;
      $("#board").children().removeClass("active");
      $(".tile").children().removeClass("possible");
      parentElement.classList.add("active");
      let possibilityData = {
        eventName: "CHECK_POSSIBILITY",
        data: {
          index: parseInt(parentElement.id.slice(1)),
          userId,
          color,
        },
      };
      if (king) {
        possibilityData.data.color = color == 2 ? 5 : 8;
      }
      sendToSocket(socket, possibilityData);
    });
  });
}

function signUp(data) {
  userId = data.userId;
  sessionStorage.setItem("userId", userId);
  if (color && color == 1) {
    $("#board").addClass("rotate");
  }
}

function roundTimer(data) {
  let second = data.delayTime;
  var timer = setInterval(() => {
    if (second == 0) {
      clearInterval(timer);
      $("#gameInfoBox").html(``);
    } else {
      $("#gameInfoBox").html(
        `<div class='timeSecond'>Game Start in ${second--}</div>`
      );
    }
  }, 800);
}

function leaveMatch() {
  let leaveData = {
    eventName: "LEAVE",
    data: {
      userId: userId,
    },
  };

  sendToSocket(socket, leaveData);
  sessionStorage.clear();
  location.reload();
}

function gameStart() {
  $("#gameInfoBox").html('<div class="timeSecond">Game Start</div>');

  setTimeout(() => {
    $("#gameInfoBox").addClass("hide");
    if (color == 1) {
      $("#board").addClass("rotate");
    }
  }, 2000);

  setTimeout(() => {
    $("#gameInfoBox").addClass("d-none");
  }, 2500);
}

function userTurnStart(data) {
  if (data.userId == userId) {
    turn = true;
    if (turn) {
      $("#playerName").addClass("playerActive");
      $("#animeName").removeClass("playerActive");
    }
    setDiceEvent();
  } else {
    turn = false;
    if (!turn) {
      $("#playerName").removeClass("playerActive");
      $("#animeName").addClass("playerActive");
    }
  }
}

function checkPossibility(data) {
  if (data.userId == userId) {
    let king = document
      .querySelector(".active .dice")
      .classList.contains("king");

    if (data.killRow && data.killRow.length > 0) {
      for (var i = 0; i < data.killRow.length; i++) {
        let element = data.killRow[i];
        let id = element * 8 + data.killCol[i] + 1;
        document.getElementById(
          `b${id}`
        ).innerHTML = `<div class="possible kill"></div>`;
        setMoveEvent(id, king, data.kill[i]);
      }
    }
    data.row.forEach((element, index) => {
      let id = element * 8 + data.col[index] + 1;
      document.getElementById(
        `b${id}`
      ).innerHTML = `<div class="possible"></div>`;
      setMoveEvent(id, king);
    });
  }
}

function move(data) {
  setBoard(data);
  $("#board").children().removeClass("active");
}

function setMoveEvent(id, king, kill) {
  let element = document.querySelector(`#b${id} .possible`);
  element.addEventListener("click", () => {
    let currentId = document.querySelector(".active").id;

    let moveData = {
      eventName: "MOVE",
      data: {
        id: currentId,
        moveId: `b${id}`,
        color,
        userId,
        kill,
      },
    };
    if (king) {
      moveData.data.color = color == 2 ? 5 : 8;
    }
    sendToSocket(socket, moveData);
  });
  $(".possible").off("click");
}

function winGame(data) {
  $("#board").addClass("d-none");
  sessionStorage.clear();
  if (data.winnerId == userId) {
    $("#gameInfoBox").addClass("win-box");
    $("#gameInfoBox").html(`<img src="./image/win.gif" alt="">`);
  } else {
    $("#gameInfoBox").addClass("lose-box");
    $("#gameInfoBox").html(`<img src="./image/lose.png" alt="">`);
  }
  $(" #gameInfoBox").removeClass("d-none");
  $(" #gameInfoBox").removeClass("hide");

  setTimeout(() => {
    location.reload();
  }, 5000);
}

function leaveUser() {
  alert(`User left the match!!`);
}

function joinGame(data) {
  if (data.status == "waiting") {
    $(" #gameInfoBox").html(
      `<h2 class="text-white">Waiting For Other Player</h2><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>`
    );
  } else {
    sessionStorage.setItem("tableId", data.tableId);
    if (data.userData[0]._id == userId) {
      color = 1;
      $("#playerName").html(data.userData[0].userName);
      $("#animeName").html(data.userData[1].userName);
    } else {
      color = 2;
      $("#playerName").html(data.userData[1].userName);
      $("#animeName").html(data.userData[0].userName);
    }
    setBoard(data);
  }
}

socket.onAny((eventName, data) => {
  console.log(`RESPONSE EVENT: ${eventName} DATA: ${JSON.stringify(data)}`);

  switch (eventName) {
    case "SIGN_UP":
      signUp(data.data);
      break;
    case "JOIN_GAME":
      joinGame(data.data);
      break;
    case "ROUND_TIMER_START":
      roundTimer(data.data);
      break;
    case "START_GAME":
      gameStart(data.data);
      break;
    case "USER_TURN_START":
      userTurnStart(data.data);
      break;
    case "CHECK_POSSIBILITY":
      checkPossibility(data.data);
      break;
    case "MOVE":
      move(data.data);
      break;
    case "WIN":
      winGame(data.data);
      break;
    case "LEAVE_USER":
      leaveUser();
  }
});
