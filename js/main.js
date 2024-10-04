// USER INFO //////////////////////////////////////////////
const playerName = document.querySelector('.player__name');
const playerUserId = document.querySelector('.player__userId');
const noMobileElement = document.querySelector('.noMobile');
const adsenseBtn = document.querySelector("#adsenseBtn");

//SWAL ALERT
function showToast(icon, title) {
  Swal.fire({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    icon: icon,
    title: title,
  });
}
function showClaim(_title) {
  Swal.fire({
    title: _title,
    confirmButtonText: "Claim",
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      Swal.fire("Saved!", "", "success");
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info");
    }
  });
}

//ADSENSE 

adConfig({
    preloadAdBreaks: "on",
    sound: 'off',
    onReady: () => {
        adsenseBtn.style.display="flex";
    },
});

adsenseBtn.addEventListener("click", ()=> {
  adBreak({
      type: 'reward',                      // The type of this placement
      name: '1 extra ticket',              // A descriptive name for this placement
      beforeAd: () => {},                  // Prepare for the ad. Mute and pause the game flow
      afterAd: () => {},                   // Resume the game and re-enable sound
      // Show reward prompt (call showAdFn() if clicked)
      beforeReward: (showAdFn) => {
        Swal.fire({
            title: "Watch the video to get one more chance?",
            showCancelButton: true,
            confirmButtonText: "Watch",
        }).then((result) => {
            if (result.isConfirmed) {
              showAdFn(); //ads
            }
        });
      },
      // Player dismissed the ad before it finished.      
      adDismissed: () => {},  
      // Player watched the ad–give them the reward.             
      adViewed: () => {},
      
      // Always called (if provided) even if an ad didn't show  
      adBreakDone: (placementInfo) => {
          //breakStatus: 'notReady|timeout|error|noAdPreloaded|frequencyCapped|ignored|other|dismissed|viewed',
          switch (placementInfo.breakStatus) {
            case "viewed": 
            showToast( "success", `Congratulations, +0.1 ILC added`);
            break;
            case "notReady": 
            showToast("error", `Ad is not ready`);
            break;
            case "noAdPreloaded": 
            showToast("error", `No ad available at this time`);
            break;
            case "frequencyCapped": 
            showToast("error", `Frequency Capped!`);
            break;
            case "ignored": 
            case "other": 
            case "dismissed": 
            case "timeout": 
            case "error": 
            showToast("error", `Error occured, status: ${placementInfo.breakStatus}`);
            break;
        }
      },  
  });

});

if (window.Telegram && window.Telegram.WebApp) {
  const TELEGRAM = window.Telegram.WebApp;
  console.log(TELEGRAM.initData.start_param);
  TELEGRAM.ready();
  TELEGRAM.disableVerticalSwipes();
  TELEGRAM.enableClosingConfirmation();
  TELEGRAM.setHeaderColor('#000000');
  TELEGRAM.expand();

  //only mobile
  switch (TELEGRAM.platform) {
    case "android":
    case "ios": noMobileElement.style.display = "none";
      break;
    case "weba":
    case "unknown": noMobileElement.style.display = "none"; //FLEX OLACAK 
      break;
    default: noMobileElement.style.display = "flex";
      break;
  }

  let url_tier = "";
  //assign user data
  const user = TELEGRAM.initDataUnsafe.user;
  if (user) {
    playerName.textContent = `${user.first_name}`;
    playerUser Id.textContent = `${user.id}`;
    url_tier = user.id;
  } else {
    playerName.textContent = `No user`;
    playerUserId.textContent = `No ID`;
  }

  //referral
  let ref_link = `${botLink + url_tier}`;
  console.log(ref_link);
  // shareBtn.addEventListener('click', async () => {
  //   const link = `https://t.me/share/url?url=${encodeURIComponent('join, invite and earn more ')}`;
  //   await TELEGRAM.openTelegramLink(link);
  // });

  // copyBtn.addEventListener('click', async () => {
  //   await navigator.clip board.writeText(ref_link);
  //   console.log(`copied successfully, URL: ${ref_link}`)
  // });

} else {
  console.log('Telegram WebApp is not available.');
}
////////////////////////////////////////////////////////////


let acc = document.querySelector(".accordion");

acc.addEventListener("click", function () {
  this.classList.toggle("active");
  let panel = document.querySelector(".panel");
  if (panel.style.display === "flex") {
    panel.style.display = "none";
    document.querySelector(".card").style.borderBottomLeftRadius = "8px";
    document.querySelector(".card").style.borderBottomRightRadius = "8px";
    document.querySelector(".card").style.boxShadow = "0px 1px 6px rgba(95, 243, 208, 0.5)";
    document.querySelector(".panel").style.borderBottomLeftRadius = "0";
    document.querySelector(".panel").style.borderBottomRightRadius = "0";
  } else {
    panel.style.display = "flex";
    document.querySelector(".card").style.borderBottomLeftRadius = "0";
    document.querySelector(".card").style.borderBottomRightRadius = "0";
    document.querySelector(".card").style.boxShadow = "none";
    document.querySelector(".panel").style.borderBottomLeftRadius = "8px";
    document.querySelector(".panel").style.borderBottomRightRadius = "8px";
  }
});


//ADSGRAM INTEGRATION ///////////////////////////////////////////////
const adsgram_blockId = '3260';
const adsgramReward = 200;

const AdController = window.Adsgram.init({ blockId: adsgram_blockId });

document.addEventListener('DOMContentLoaded', () => {
  updateWatchCount();
});

const watchAddBtn = document.querySelector('#watchAddBtn');
const $watchCount = document
  .querySelector('.earn__item__watch-count')
  .querySelector('span');
const maxAdsPerDay = 10;
const currentDate = new Date().toISOString().slice(0, 10);

function updateWatchCount() {
  const adData = getAdData();
  const watchCount = adData.count;
  $watchCount.textContent = watchCount;
}

function getAdData() {
  const adData = JSON.parse(localStorage.getItem('adData')) || {
    count: 0,
    date: currentDate,
  };
  return adData;
}

function setAdData(adData) {
  localStorage.setItem('adData', JSON.stringify(adData));
}

watchAddBtn.addEventListener('click', async () => {
  let adData = getAdData();

  if (adData.date !== currentDate) {
    adData = { count: 0, date: currentDate };
  }

  if (adData.count >= maxAdsPerDay) {
    showToast('error', 'No ads any more for today!');
    console.log('error', 'No ads any more for today!');
    return;
  }
  watchAddBtn.innerHTML = `<img src="./img/promiseGif.gif" alt="">`;
  await AdController.show()
    .then((result) => {
      showToast('success', `${adsgramReward} coin added`);
      adData.count += 1;
      //disable and countdown
      setTimeout (function(){
        watchAddBtn.disabled = null;
      },30000);

      var countdownNum = 30;
      incTimer();

      function incTimer(){
        watchAddBtn.disabled = true;
        setTimeout (function(){
          if(countdownNum != 0){
          countdownNum--;
          watchAddBtn.innerHTML = `00:${(countdownNum>=10)? countdownNum : `${"0"+countdownNum}`}`;
          incTimer();
          } else {
            watchAddBtn.innerHTML = `<span>Watch</span> <img src="./img/see.png" alt="">`;
            watchAddBtn.disabled = false;
          }
        },1000);
      };

      setAdData(adData);
      updateWatchCount();
    })
    .catch((result) => {
      showToast('error', result.description);
      watchAddBtn.innerHTML = `<span>Watch</span> <img src="./img/see.png" alt="">`;

    });
    
});
////////////////////////////////////////////////////////////
