// Amazon Prime Video Enhanced Script for TizenBrew
console.log("%cPrime Video Enhanced", "color: #00aeef;font-size: 2em;");

// Configuration
const settings = {
  Amazon: {
    skipIntro: true,
    skipCredits: true,
    skipAd: true,
    selfAd: true,
    speedSlider: true,
    filterPaid: true,
    xray: true,
    continuePosition: true,
    watchCredits: false
  },
  Video: {
    doubleClick: true,
    scrollVolume: true,
    userAgent: false
  },
  General: {
    sliderSteps: 5,
    sliderMax: 30
  },
  Statistics: {
    AmazonAdTimeSkipped: 0,
    IntroTimeSkipped: 0,
    RecapTimeSkipped: 0,
    SegmentsSkipped: 0
  }
};

// Global Variables
const ua = navigator.userAgent;
const isMobile = /mobile|streamingEnhanced/i.test(ua);
let lastAdTimeText = 0;
let videoSpeed = 1;
const url = window.location.href;
const hostname = window.location.hostname;
const title = document.title;
const isPrimeVideo = /amazon|primevideo/i.test(hostname) && (/video/i.test(title) || /video/i.test(url));

// Utility Functions
function parseAdTime(timeText) {
  if (!timeText) return null;
  const match = timeText.match(/(\d+):(\d+)/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  const secondsMatch = timeText.match(/(\d+)/);
  return secondsMatch ? parseInt(secondsMatch[1]) : null;
}

function createSlider(video, position) {
  const sliderContainer = document.createElement('div');
  sliderContainer.style.cssText = 'display: none; position: absolute; z-index: 999; background: rgba(0,0,0,0.7); padding: 10px; border-radius: 5px;';
  
  const speedDisplay = document.createElement('span');
  speedDisplay.id = 'videoSpeed';
  speedDisplay.textContent = '1.0x';
  speedDisplay.style.cssText = 'color: white; margin-right: 10px; cursor: pointer;';
  
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.id = 'videoSpeedSlider';
  slider.min = '6';
  slider.max = '30';
  slider.value = '10';
  slider.style.cssText = 'width: 200px; height: 1em; background: rgb(221, 221, 221);';
  
  sliderContainer.appendChild(speedDisplay);
  sliderContainer.appendChild(slider);
  
  if (position) {
    position.appendChild(sliderContainer);
  }
  
  speedDisplay.onclick = function() {
    sliderContainer.style.display = sliderContainer.style.display === 'block' ? 'none' : 'block';
  };
  
  slider.oninput = function() {
    const speed = parseFloat(slider.value) / 10;
    video.playbackRate = speed;
    speedDisplay.textContent = speed.toFixed(1) + 'x';
    videoSpeed = speed;
  };
}

function addSkippedTime(startTime, endTime, key) {
  if (typeof startTime === 'number' && typeof endTime === 'number' && endTime > startTime) {
    console.log(key, endTime - startTime);
    settings.Statistics[key] += endTime - startTime;
  }
}

// Main Amazon Functions
const AmazonVideoClass = ".dv-player-fullscreen video";
const config = { attributes: true, childList: true, subtree: true };

// Observer for main Amazon functions
const AmazonObserver = new MutationObserver(function() {
  if (settings.Amazon?.filterPaid) Amazon_FilterPaid();
  const video = document.querySelector(AmazonVideoClass);
  if (settings.Amazon?.skipCredits) Amazon_Credits();
  if (settings.Amazon?.watchCredits) Amazon_Watch_Credits();
  if (settings.Amazon?.speedSlider) Amazon_SpeedSlider(video);
  if (settings.Amazon?.xray) Amazon_xray();
  if (settings.Video?.scrollVolume) Amazon_scrollVolume();
});

// Skip Intro Observer
const AmazonSkipIntroConfig = {
  attributes: true,
  attributeFilter: [".skipelement"],
  subtree: true,
  childList: true,
  attributeOldValue: false,
};

let lastIntroTime = -1;
function resetLastIntroTime() {
  setTimeout(() => {
    lastIntroTime = -1;
  }, 5000);
}

const AmazonSkipIntroObserver = new MutationObserver(function() {
  if (settings.Amazon?.skipIntro) {
    const button = document.querySelector("[class*=skipelement]");
    if (button?.checkVisibility && button.checkVisibility()) {
      const video = document.querySelector(AmazonVideoClass);
      const time = Math.floor(video?.currentTime ?? 0);
      if (typeof time === 'number' && lastIntroTime != time) {
        lastIntroTime = time;
        resetLastIntroTime();
        button.click();
        console.log('Intro skipped', button);
        setTimeout(function() {
          addSkippedTime(time, video.currentTime, 'IntroTimeSkipped');
        }, 50);
      }
    }
  }
});

// Amazon Functions
async function Amazon_scrollVolume() {
  const volumeControl = document.querySelector('[aria-label="Volume"]:not(.enhanced)');
  if (volumeControl) {
    volumeControl.classList.add('enhanced');
    volumeControl?.addEventListener('wheel', (event) => {
      const video = document.querySelector(AmazonVideoClass);
      if (!video) return;
      let volume = video.volume;
      if (event.deltaY < 0) volume = Math.min(1, volume + 0.1);
      else volume = Math.max(0, volume - 0.1);
      video.volume = volume;
    });
  }
}

async function Amazon_Credits() {
  const button = document.querySelector("[class*=nextupcard-button]");
  if (button) {
    const newEpNumber = document.querySelector("[class*=nextupcard-episode]");
    if (newEpNumber?.textContent && 
        !/(?<!\S)1(?!\S)/.exec(newEpNumber.textContent) && 
        lastAdTimeText != newEpNumber.textContent) {
      lastAdTimeText = newEpNumber.textContent ?? '';
      setTimeout(() => { lastAdTimeText = 0; }, 1000);
      button.click();
      settings.Statistics.SegmentsSkipped++;
      console.log('skipped Credits', button);
    }
  }
}

async function Amazon_Watch_Credits() {
  const button = document.querySelector("[class*=nextupcardhide-button]");
  if (button) {
    button.click();
    settings.Statistics.SegmentsSkipped++;
    console.log('Watched Credits', button);
  }
}

async function Amazon_SpeedSlider(video) {
  if (video) {
    const alreadySlider = document.querySelector('.dv-player-fullscreen #videoSpeedSlider');
    if (!alreadySlider) {
      const position = document.querySelector('.dv-player-fullscreen [class*=infobar-container]')?.firstChild?.lastChild;
      if (position) createSlider(video, position);
    }
  }
}

async function Amazon_FilterPaid() {
  if (url.includes('storefront') || url.includes('genre') || url.includes('movie') || url.includes('Amazon-Video')) {
    document.querySelectorAll("section[data-testid='standard-carousel'] ul:has(svg.NbhXwl)").forEach((a) => {
      deletePaidCategory(a);
    });
  }
}

async function deletePaidCategory(a) {
  if (a.children.length - a.querySelectorAll('[data-hidden="true"]').length - 2 <= 
      a.querySelectorAll("[data-testid='card-overlay'] svg.NbhXwl").length) {
    const section = a.closest('[class*="+OSZzQ"]');
    console.log('Filtered paid category', section);
    section?.remove();
    settings.Statistics.SegmentsSkipped++;
  } else {
    a.querySelectorAll('li:has(svg.NbhXwl)').forEach((b) => {
      console.log('Filtered paid Element', b);
      b.remove();
      settings.Statistics.SegmentsSkipped++;
    });
  }
}

// Ad Blocking Functions  
function Amazon_FreeveeTimeout() {
  const AdInterval = setInterval(function() {
    if (!settings.Amazon.skipAd) {
      console.log('stopped observing| FreeVee Ad');
      clearInterval(AdInterval);
      return;
    }
    const video = document.querySelector(AmazonVideoClass);
    if (video && !video.paused && video.currentTime > 0) {
      skipAd(video);
    }
  }, 100);
}

async function skipAd(video) {
  const adTimeText = document.querySelector('.dv-player-fullscreen .atvwebplayersdk-ad-timer-text');
  if (adTimeText?.checkVisibility && adTimeText.checkVisibility()) {
    let adTime = parseAdTime(adTimeText?.childNodes?.[0]?.textContent) || 
                 parseAdTime(adTimeText?.childNodes?.[1]?.textContent);
    
    if (!document.querySelector('.fu4rd6c.f1cw2swo') && typeof adTime == 'number' && adTime > 1 && !lastAdTimeText) {
      lastAdTimeText = adTime;
      const bigTime = 90;
      setTimeout(() => { lastAdTimeText = 0; }, adTime > bigTime ? 3000 : 1000);
      const skipTime = adTime > bigTime ? bigTime : adTime - 1;
      video.currentTime += skipTime;
      console.log('FreeVee Ad skipped, length:', skipTime, 's');
      settings.Statistics.AmazonAdTimeSkipped += skipTime;
      settings.Statistics.SegmentsSkipped++;
    }
  }
}

async function Amazon_selfAdTimeout() {
  const AdInterval = setInterval(function() {
    if (!settings.Amazon.selfAd) {
      console.log('stopped observing| Self Ad');
      clearInterval(AdInterval);
      return;
    }
    const video = document.querySelector(AmazonVideoClass);
    if (video) {
      video.onplay = function() {
        const dvWebPlayer = document.querySelector('#dv-web-player');
        if (dvWebPlayer && getComputedStyle(dvWebPlayer).display != 'none') {
          const button = document.querySelector('.fu4rd6c.f1cw2swo');
          if (button) {
            const adTime = parseInt(/:\d+/.exec(document.querySelector('.atvwebplayersdk-adtimeindicator-text')?.innerHTML ?? '')?.[0]?.substring(1) ?? '');
            setTimeout(() => {
              button.click();
              if (typeof adTime === 'number') settings.Statistics.AmazonAdTimeSkipped += adTime;
              settings.Statistics.SegmentsSkipped++;
              console.log('Self Ad skipped, length:', adTime, button);
            }, 150);
          }
        }
      };
    }
  }, 100);
}

async function Amazon_xray() {
  document.querySelector('.xrayQuickViewList')?.remove();
  const b = document.querySelector('.fkpovp9.f8hspre:not(.enhanced)');
  if (b) {
    b.classList.add('enhanced');
    b.style.backgroundColor = 'transparent';
    b.style.background = 'transparent';
  }
}

async function Amazon_doubleClick() {
  if (settings.Video?.doubleClick) {
    document.ondblclick = function() {
      const button = document.querySelector('.dv-player-fullscreen button[class*=fullscreen-button]');
      button?.click();
    };
  } else {
    document.ondblclick = null;
  }
}

// Keyboard Controls for Tizen TV
document.addEventListener('keydown', (event) => {
  const video = document.querySelector(AmazonVideoClass);
  if (!video) return;
  
  const steps = settings.General.sliderSteps / 10;
  
  switch(event.key) {
    case 'ArrowUp':
    case 'd':
      event.preventDefault();
      video.playbackRate = Math.min(video.playbackRate + steps * 2, settings.General.sliderMax / 10);
      videoSpeed = video.playbackRate;
      console.log('Speed increased to:', video.playbackRate);
      break;
    case 'ArrowDown':
    case 's':
      event.preventDefault();
      video.playbackRate = Math.max(video.playbackRate - steps * 2, 0.6);
      videoSpeed = video.playbackRate;
      console.log('Speed decreased to:', video.playbackRate);
      break;
    case 'Escape':
      window.history.back();
      break;
  }
});

// TV Remote Control Support
document.addEventListener('back', (event) => {
  if (event.key === 'Escape') {
    window.history.back();
  }
});

// Initialize when Prime Video is detected
if (isPrimeVideo) {
  console.log('Prime Video detected, initializing...');
  
  // Wait for page to load
  setTimeout(() => {
    // Start observers
    AmazonSkipIntroObserver.observe(document, AmazonSkipIntroConfig);
    AmazonObserver.observe(document, config);
    
    // Initialize features
    if (settings.Video?.doubleClick) Amazon_doubleClick();
    if (settings.Amazon?.selfAd) Amazon_selfAdTimeout();
    if (settings.Amazon?.skipAd) {
      setTimeout(() => Amazon_FreeveeTimeout(), 1000);
    }
    
    console.log('Prime Video Enhanced initialized successfully');
  }, 1000);
}

// Export settings for debugging
window.primeVideoSettings = settings;