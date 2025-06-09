# SpiderClip Set-Up

*A modular hardware-+-software showcase for physiological sensing in VR.*

![Hero](public/images/VR-Wearable-TeaserPic.png)

SpiderClip Set-Up bringt eine flexible **Sensor-Plattform** (mit Arduino Nano 33 IoT + Tracker-Clip) und ein **VR-Wearable** zusammen.  
Diese Website dient als **öffentliche Ressource-Drehscheibe**:

* interaktive 3D-Modelle (GLB / STL)  
* Code-Snippets (C++ / Arduino)  
* Artikellinks, Bilder, Videos  
* Live-Demo (Three.js + Vite)

Die Seite läuft auf **GitHub Pages** unter  
<https://d-queck.github.io/SpiderClip_SetUp/>.

---

## Features

| Modul | Highlights |
|-------|------------|
| **Hardware Sensor Platform 🔧** | 3 Prototyp-Clips, Controller-Integration, vollständige STL- und GLB-Dateien |
| **Communication Interface 🔌** | zentraler & peripherer Arduino-Sketch, I²C-Sensoranbindung, Unity-Bridge |
| **VR-Wearable 🕶** | 3D-Wearable-Modelle, SteamVR-Integration, SDK-Download |
| **Interactive Viewer** | Three.js r175, OrbitControls, Auto-Rotate, Part-Selection |
| **Parallax UI** | Vite, Sass, Bootstrap 5, Parallax-Hero & Section-Scroller |

---

## Live Demo

| Abschnitt | Direktlink |
|-----------|------------|
| Hardware-Canvas | <https://d-queck.github.io/SpiderClip_SetUp/#hardware> |
| VR-Wearable-Canvas | <https://d-queck.github.io/SpiderClip_SetUp/#vr> |
| Ressourcenübersicht | <https://d-queck.github.io/SpiderClip_SetUp/#resources> |

---

## Quick Start (Local Dev)

```bash
# 1. Repository klonen
git clone https://github.com/D-Queck/SpiderClip_SetUp.git
cd SpiderClip_SetUp

# 2. Abhängigkeiten
npm install        # Node ≥ 18 empfohlen

# 3. Entwicklungsserver (Hot Reload)
npm run dev        # http://localhost:5173/
