document.addEventListener("DOMContentLoaded", () => {
  let username = localStorage.getItem("username");
  if (!username) {
    document.querySelector("form").style.display = "block";
    document.querySelector("form").addEventListener("submit", (e) => {
      event.preventDefault();
      const formData = new FormData(document.querySelector("form"));
      username = formData.get("username");
      localStorage.setItem("username", username);
      document.querySelector("form").style.display = "none";
      document.querySelector("h1").innerHTML = `Hello, ${username}`;
    });
  } else {
    document.querySelector("h1").innerHTML = `Hello, ${username}`;
  }
});
