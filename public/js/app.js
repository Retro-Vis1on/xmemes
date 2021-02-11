const message = document.querySelector(".alert");
const input = document.querySelector(".newmeme");
let cards = document.querySelectorAll(".card");
const url = document.querySelector("#url");
let btn = document.querySelector(".toggle");

btn.addEventListener("click", () => {
  btn.classList.toggle("active");
  document.querySelectorAll(".icon");
  document.querySelector(".overlay").classList.toggle("active");
  document.querySelector(".menu").classList.toggle("active");
  document.querySelector(".menucontents").classList.toggle("active");
});
let mode = localStorage.getItem("mode");
if (mode) {
  document.querySelector(".darkmode").classList.add("dark");
  document.querySelector(".darktoggle").classList.remove("fa-moon");
  document.querySelector(".darktoggle").classList.add("fa-sun");
} else {
  document.querySelector(".darkmode").classList.remove("dark");
  document.querySelector(".darktoggle").classList.add("fa-moon");
  document.querySelector(".darktoggle").classList.remove("fa-sun");
}

darkmodeupdater();
function modedecider(classes) {
  if (mode) classes.add("dark");
  else classes.remove("dark");
}

function darkmodeupdater() {
  modedecider(document.querySelector("body").classList);
  modedecider(document.querySelector("html").classList);
  modedecider(document.querySelector(".container").classList);
  modedecider(document.querySelector("nav").classList);
  let cards = document.querySelectorAll(".card");
  for (let card of cards) modedecider(card.classList);
  modedecider(document.querySelector(".menu_extra").classList);
  modedecider(document.querySelector(".menucontents").classList);
  let inputs = document.querySelectorAll("input");
  for (let input of inputs) modedecider(input.classList);
  modedecider(document.querySelector(".toggle").classList);
  modedecider(document.querySelector(".submit").classList);
  modedecider(document.querySelector(".editmode").classList);
  modedecider(document.querySelector(".showMore").classList);
  modedecider(document.querySelector(".menucontents>h1").classList);
}

document.querySelector(".darkmode").addEventListener("click", () => {
  let darkbtn = document.querySelector(".darkmode");
  darkbtn.classList.toggle("dark");
  document.querySelector(".darktoggle").classList.toggle("fa-moon");
  document.querySelector(".darktoggle").classList.toggle("fa-sun");
  if (darkbtn.classList.contains("dark")) localStorage.setItem("mode", "1");
  else localStorage.removeItem("mode");
  mode = localStorage.getItem("mode");
  darkmodeupdater();
});

url.addEventListener("change", () => {
  let sample = document.querySelector("#sampleimg");
  sample.src = url.value ? url.value : "icons/gallery-187-902099.png";
});

document.querySelector(".editmode").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".newmeme").action = `/add`;
  document.querySelector(".editmode").classList.add("cloak");
  document.querySelector("#name").style.borderBottom = "2px solid darkgray";
  document.querySelector(".menucontents>h1").innerText = "Contribute!";
});
function checkMe() {
  if (
    input.name.value == "" ||
    input.caption.value == "" ||
    input.url.value == ""
  ) {
    message.classList.remove("cloak");
    message.innerText = "Please check all the fields!";
    return false;
  }
  message.classList.add("cloak");
  btn.click();
  return true;
}
