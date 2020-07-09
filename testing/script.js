function main() {
  if (get_username()) {
    set_fields();
  } else {
    show_form();
    document.querySelector("button").onclick = setname;
  }
}

function setname() {
  let username = document.getElementById("name").value;
  localStorage.setItem("username", username);
  set_fields();
}

function get_username() {
  return localStorage.getItem("username");
}

function set_fields() {
  document.getElementById("form").style.display = "none";
  document.querySelector("h1").innerHTML = `Hello, ${get_username()}.`;
}

function show_form() {
  document.getElementById("form").style.display = "block";
}

document.addEventListener("DOMContentLoaded", main);
