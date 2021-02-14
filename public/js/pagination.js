//This generates the time stamp
function timeDifference(time, date) {
  let cur = new Date().getTime();
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let elapsed = cur - time;
  if (elapsed < msPerMinute) {
    let val = Math.round(elapsed / 1000);
    return val + (val > 1 ? " seconds ago" : " second ago");
  } else if (elapsed < msPerHour) {
    let val = Math.round(elapsed / msPerMinute);
    return val + (val > 1 ? " minutes ago" : " minute ago");
  } else if (elapsed < msPerDay - msPerHour / 2) {
    let val = Math.round(elapsed / msPerHour);
    return val + (val > 1 ? " hours ago" : " hour ago");
  } else return `${date}`;
}

let pg = 2;
//This is used in making icons of the cards
function iconGenerator(type, id, icon_tag, icon_cat) {
  let icon = document.createElement("div");
  icon.classList.add(type, "icon", id);
  let i = document.createElement("i");
  i.classList.add(icon_cat, icon_tag);
  icon.innerHTML = i.outerHTML;
  return icon;
}
//This is used to make new cards for incoming elements
//The card element is hardcoded
function cardgenerator(meme) {
  let card = document.createElement("div");
  card.classList.add("card", meme["_id"]);
  let meme_img = document.createElement("div");
  meme_img.classList.add("meme_img");
  let img = document.createElement("img");
  img.classList.add("memeImgVal", meme["_id"]);
  img.src = meme.url;
  meme_img.appendChild(img);
  card.appendChild(meme_img);
  let info = document.createElement("div");
  let user = document.createElement("div");
  let usertoggle = document.createElement("div");
  card.appendChild(info);
  info.classList.add("info");
  user.classList.add("user");
  usertoggle.classList.add("usertoggle");
  info.appendChild(usertoggle);
  usertoggle.appendChild(user);
  let userName = document.createElement("h2");
  userName.classList.add("userName", meme["_id"]);
  userName.innerText = meme.name;
  let timestamp = document.createElement("p");
  timestamp.classList.add("timestamp");
  timestamp.innerText = timeDifference(meme.time, meme.date);
  let userCaption = document.createElement("p");
  userCaption.classList.add("userCaption", meme["_id"]);
  userCaption.innerText = meme.caption;
  user.innerHTML =
    userName.outerHTML + userCaption.outerHTML + timestamp.outerHTML;
  document.querySelector(".container").appendChild(card);
  let editors = document.createElement("div");
  editors.classList.add("editors");
  let trash = iconGenerator("trash", meme["_id"], "fa-trash-alt", "far");
  let pencil = iconGenerator("pencil", meme["_id"], "fa-edit", "far");
  editors.innerHTML = trash.outerHTML + pencil.outerHTML;
  usertoggle.appendChild(editors);
  let likeButton = document.createElement("div");
  likeButton.classList.add("likeButton");
  let heart = iconGenerator("heart", meme["_id"], "fa-heart", "fas");
  let likect = document.createElement("span");
  likect.classList.add("likect");
  likect.innerText = `${meme.like} ${meme.like != 1 ? "likes" : "like"}`;
  likeButton.innerHTML = heart.outerHTML + likect.outerHTML;
  info.appendChild(likeButton);
  if (localStorage.getItem("mode")) card.classList.add("dark");
}
//It handles the show more button
async function showMore() {
  document.querySelector(".showMore").setAttribute("disabled", "disabled");
  let memes = await axios.get(`/page/${pg}`);
  pg += 1;
  memes = memes.data;
  if (memes.length < 9) {
    document.querySelector(".showMore").classList.add("cloak");
  }
  for (let meme of memes) cardgenerator(meme);
  setTimeout(activateEvent, 500);
  document.querySelector(".showMore").removeAttribute("disabled");
}

document.querySelector(".showMore").addEventListener("click", showMore);
//This handles the like counter
function heartupdate(heart, id, ct) {
  heart.addEventListener("click", () => {
    heart.classList.toggle("loved");
    console.log(heart.children[0]);
    heart.children[0].classList.toggle("activeheart");
    if (heart.classList.contains("loved")) {
      ct.innerText =
        parseInt(ct.innerText) +
        1 +
        (parseInt(ct.innerText) != 0 ? " likes" : " like");
      axios.patch(`/${id}/like/loved`);
    } else {
      ct.innerText =
        parseInt(ct.innerText) -
        1 +
        (parseInt(ct.innerText) != 2 ? " likes" : " like");
      axios.patch(`/${id}/like/unloved`);
    }
  });
}
//This handles the delete button
function deletememe(card, trash, id) {
  trash.addEventListener("click", () => {
    card.remove();
    axios.delete(`/${id}`);
  });
}
//This handles the edit button
//Same form is used for editing and adding new memes
function editMeme(edit, id) {
  edit.addEventListener("click", () => {
    document.querySelector(".alert").classList.add("cloak");
    document.querySelector(".editmode").classList.remove("cloak");
    document.querySelector(".menucontents>h1").innerText = "Itsy Bitsy Changes";
    document.querySelector("#name").style.borderBottom = "2px solid red";
    let form = document.querySelector(".newmeme");
    let memeimg = document.getElementsByClassName(`memeImgVal ${id}`)[0];
    let user = document.getElementsByClassName(`userName ${id}`)[0];
    let caption = document.getElementsByClassName(`userCaption ${id}`)[0];
    form.action = `/edit/${id}?_method=PATCH`; //Switches the action of form to edit route
    document.querySelector("#name").value = user.innerText;
    document.querySelector("#caption").value = caption.innerText;
    document.querySelector("#url").value = memeimg.src;
    document.querySelector("#sampleimg").src = memeimg.src;
    document.querySelector("#name").setAttribute("readonly", true);
    btn.click();
  });
}
//This  updates the event listeners after adding new elements using show more
function activateEvent() {
  let trashes = document.querySelectorAll(".trash");
  for (let trash of trashes) {
    deletememe(
      document.getElementsByClassName(`card ${trash.classList[2]}`)[0],
      trash,
      trash.classList[2]
    );
  }
  for (let pencil of document.querySelectorAll(".pencil")) {
    editMeme(pencil, pencil.classList[2]);
  }

  let hearts = document.querySelectorAll(".heart");
  for (let heart of hearts) {
    heartupdate(heart, heart.classList[2], heart.parentElement.children[1]);
  }
}
activateEvent();
