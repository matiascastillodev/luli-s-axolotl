document.getElementById("sleepBtn").addEventListener("click", function () {
  let sleepIcon = document.getElementById("sleepIcon");
  let toggleText = document.getElementById("statusText");
  let currentSrc = sleepIcon.src;

  let image1 = "images/Bucket_of_Axolotl_JE1_BE1.webp";
  let image2 = "images/Water_Bucket_JE2_BE2.webp";

  if (currentSrc.includes(image1)) {
    sleepIcon.src = image2;
    statusText.textContent = "SLEEP";
  } else {
    sleepIcon.src = image1;
    statusText.textContent = "WAKE";
  }
});
