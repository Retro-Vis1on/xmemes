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
  darkmodeupdater();
}

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
  modedecider(document.querySelector(".twister").classList);
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

url.addEventListener("change", async () => {
  let sample = document.querySelector("#sampleimg");
  if (url.value == "") {
    sample.src = "icons/gallery-187-902099.png";
    return 0;
  }
  if (
    !(
      url.value.includes(".jpeg") ||
      url.value.includes(".jpg") ||
      url.value.includes(".png")
    )
  ) {
    sample.src = "icons/daily-ui-008-404-page-large.png";
  } else sample.src = url.value;
});

document.querySelector(".editmode").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector(".newmeme").action = `/add`;
  document.querySelector(".editmode").classList.add("cloak");
  document.querySelector("#name").style.borderBottom = "2px solid darkgray";
  document.querySelector(".menucontents>h1").innerText = "Contribute!";
  document.querySelector("#name").removeAttribute("readonly");
});

document.querySelector(".twister").addEventListener("click", async () => {
  document.querySelector(".twister").setAttribute("disabled", "disabled");
  let newMemes = [];
  try {
    let memes = await axios.get("https://api.imgflip.com/get_memes");
    newMemes = memes.data.data.memes;
    if (newMemes.length == 0) {
      message.classList.remove("cloak");
      message.innerText = "Twister is having his lunch";
    } else {
      let indi = Math.floor(Math.random() * 100);
      let cururl = newMemes[indi].url;
      let sample = document.querySelector("#sampleimg");
      sample.src = cururl;
      input.url.value = cururl;
      document.querySelector(".twister").removeAttribute("disabled");
    }
  } catch (e) {
    message.classList.remove("cloak");
    message.innerText = "Twister is having his lunch";
  }
});

input.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("firing");
  console.log(input.caption.value);
  if (
    input.name.value == "" ||
    input.caption.value == "" ||
    input.url.value == ""
  ) {
    message.classList.remove("cloak");
    message.innerText = "Please check all the fields!";
    return 0;
  }
  if (input.url.value.match(/\.(jpeg|jpg|gif|png)$/) == null) {
    message.classList.remove("cloak");
    message.innerText = "Please enter correct image URL!";
  } else {
    message.classList.add("cloak");
    btn.click();
    document.querySelector(".submit").setAttribute("disabled", "disabled");
    for (let t of document.querySelectorAll(".trash"))
      t.setAttribute("disabled", "disabled");
    input.submit();
  }
});
