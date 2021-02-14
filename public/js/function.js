//This file is used by ejs page to generate time stamp on first call

function timeDifference(time, date) {
  let cur = new Date().getTime();
  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let elapsed = cur - time;
  if (elapsed < msPerMinute) {
    let val = Math.round(elapsed / 1000);
    return "Just now";
  } else if (elapsed < msPerHour) {
    let val = Math.round(elapsed / msPerMinute);
    return val + (val > 1 ? " mins ago" : " min ago");
  } else if (elapsed < msPerDay - msPerHour / 2) {
    let val = Math.round(elapsed / msPerHour);
    return val + (val > 1 ? " hrs ago" : " hr ago");
  } else return `${date}`;
}
module.exports = timeDifference;
