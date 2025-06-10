# PrimeVideoTB
Amazon Prime Video with enhanced features and ad-blocking for TizenBrew

## 🎯 Features

### **🚫 Ad-Blocking & Auto-Skip**
* **FreeVee Ad Blocking**: Automatically skips all FreeVee advertisements
* **Self-Ad Skipping**: Bypasses Amazon's promotional content
* **Intro Skip**: Automatically skips TV show intros and recaps
* **Credits Skip**: Auto-advance to next episode (configurable)
* **Smart Timing**: Prevents crashes with optimized skip timing

### **🎮 Enhanced Video Controls**
* **Speed Control Slider**: Adjustable playback speed (0.6x - 3.0x)
* **Keyboard Shortcuts**: 
  - `↑/D`: Increase speed
  - `↓/S`: Decrease speed
  - `ESC`: Go back
  - `Double-click`: Toggle fullscreen
* **TV Remote Support**: Full Samsung Tizen TV remote integration
* **Volume Scroll**: Mouse wheel volume control

### **🎨 UI Improvements**
* **X-Ray Enhancement**: Removes distracting background overlays
* **Paid Content Filter**: Hides premium/rental content from browsing
* **Continue Watching**: Repositions continue watching section
* **Mobile View**: Optimized mobile-friendly interface

### **📊 Statistics Tracking**
* **Ad Time Saved**: Tracks total advertisement time skipped
* **Episodes Skipped**: Counts intro/credits skips
* **Performance Metrics**: Built-in usage statistics


## **Prerequisites**
- Samsung Tizen Smart TV with TizenBrew installed
- Active Amazon Prime Video subscription


## 🎛️ Configuration

The module includes customizable settings that can be adjusted in the `userScript.js`:

```javascript
const settings = {
  Amazon: {
    skipIntro: true,        // Auto-skip intros
    skipCredits: true,      // Auto-skip to next episode
    skipAd: true,          // Block FreeVee ads
    selfAd: true,          // Skip Amazon promotional content
    speedSlider: true,     // Enable speed control
    filterPaid: true,      // Hide paid content
    xray: true,           // Enhance X-Ray interface
  },
  Video: {
    doubleClick: true,     // Double-click fullscreen
    scrollVolume: true,    // Scroll wheel volume
  }
};
```

## 🎮 TV Remote Controls

| Button | Action |
|--------|--------|
| `↑` Arrow Up | Increase playback speed |
| `↓` Arrow Down | Decrease playback speed |
| `Back/ESC` | Navigate back |
| `Play/Pause` | Toggle playback |
| `Fast Forward` | Skip forward |
| `Rewind` | Skip backward |

## 🌐 Supported URLs

The module works with these Amazon Prime Video URLs:
- `https://www.primevideo.com` (Global)
- `https://www.amazon.com/gp/video` (US)
- `https://www.amazon.de/gp/video` (Germany)
- `https://www.amazon.co.uk/gp/video` (UK)
- `https://www.amazon.co.jp/gp/video` (Japan)

**For Samsung Tizen TV Browser**: Use `https://www.primevideo.com` for the best compatibility.


## 📋 To Do

- [ ] Bring it to live

## 📞 Support

Something to report? Here are your options:
- 🐛 **Bug Reports**: [Open an issue](https://github.com/your-username/PrimeVideoTB/issues) on GitHub
- 💬 **TizenBrew Community**: Join the TizenBrew Discord server

## 📄 Credits & Attribution

This project is based on and inspired by:
- **[TwitchTB](https://github.com/owen-the-kid/TwitchTB)** by Owen The Kid - Base TizenBrew module structure and inspiration
- **[Netflix-Prime-Auto-Skip](https://github.com/Dreamlinerm/Netflix-Prime-Auto-Skip)** by Dreamlinerm - Core Amazon Prime Video enhancement functionality

Special thanks to the TizenBrew community for making Smart TV customization possible!
---

**⚠️ Disclaimer**: This tool is for educational purposes and personal use only. Please respect Amazon's Terms of Service and applicable laws in your region. The developers are not responsible for any misuse of this software.

## 📜 License

This project is licensed under the [GPL-3.0-only License](https://github.com/dchwilk/PrimeVideoTB/blob/master/LICENSE).



## License

This project is licensed under the [GPL-3.0-only License](https://github.com/owen-the-kid/TwitchTB/blob/master/LICENSE).
