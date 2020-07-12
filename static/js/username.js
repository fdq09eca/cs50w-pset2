function get_username() {
  /* default username to Untitled User */
  if (!localStorage.getItem("username")) {
    localStorage.setItem("username", "Untitled User");
  }
  const username = localStorage.getItem("username");
  return username;
}

function set_fields() {
  document.querySelector("#username-input").value = "";
  document.querySelector("#username").innerHTML = `Hi, ${get_username()}`;
}

function user_rename() {
  const new_username = document.querySelector("#username-input").value;
  // to do: check if username exists in the current user.
  previous_username = get_username();
  localStorage.setItem("username", new_username);
  set_fields();
  socket.emit("user-rename", {
    "new-username": new_username,
    "previous-username": previous_username,
  });
}

function main() {
  var socket = io.connect(
    location.protocol + "//" + document.domain + ":" + location.port
  );

  socket.on("connect", () => {
    console.log("socket connect!");
    socket.emit("new-user", { "new-user": get_username() });
  });
  set_fields();
  document.querySelector("#btn-sumbit-username").onclick = user_rename;

  socket.on("welcome-bdc", (data) => {
    const li = document.createElement("li");
    li.innerHTML = `${data["new_user"]} just entered the lobby`;
    document.querySelector("#sys-msg").append(li);
  });

  socket.on("user-rename-bdc", (data) => {
    const li = document.createElement("li");
    li.innerHTML = `${data["previous_username"]} changed their username to ${data["new_username"]}`;
    document.querySelector("#sys-msg").append(li);
  });
}

main();
