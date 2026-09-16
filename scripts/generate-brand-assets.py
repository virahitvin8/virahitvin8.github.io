#!/usr/bin/env python3
"""
Generate professional vector SVG logos and signature assets for N. Akshit Vinay's portfolio.
Saves to both public/ and portfolio/assets/.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_LOGOS = ROOT / "public" / "logos"
CLASSIC_LOGOS = ROOT / "portfolio" / "assets" / "logos"
PUBLIC_SIG = ROOT / "public" / "signature"
CLASSIC_SIG = ROOT / "portfolio" / "assets" / "signature"

for d in (PUBLIC_LOGOS, CLASSIC_LOGOS, PUBLIC_SIG, CLASSIC_SIG):
    d.mkdir(parents=True, exist_ok=True)

LOGOS = {
    "csir-ngri.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="csirGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0052cc"/>
      <stop offset="100%" stop-color="#0747a6"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5cd47"/>
      <stop offset="100%" stop-color="#c9a84c"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#061826" stroke="#0052cc" stroke-width="2"/>
  <circle cx="50" cy="50" r="38" fill="none" stroke="url(#csirGrad)" stroke-width="3" stroke-dasharray="6 3"/>
  <circle cx="50" cy="50" r="30" fill="#091e33"/>
  <!-- Earth / Seismic Waves -->
  <path d="M 28 50 Q 39 36 50 50 T 72 50" fill="none" stroke="url(#goldGrad)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 32 58 Q 41 46 50 58 T 68 58" fill="none" stroke="#00ffcc" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="50" cy="36" r="4.5" fill="#f5cd47"/>
  <text x="50" y="78" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="12" fill="#ffffff" letter-spacing="1">CSIR-NGRI</text>
</svg>""",

    "sids-farm.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="sidsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2d6a4f"/>
      <stop offset="100%" stop-color="#52b788"/>
    </linearGradient>
    <linearGradient id="milkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#d8f3dc"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#081c15" stroke="#2d6a4f" stroke-width="2"/>
  <circle cx="50" cy="46" r="32" fill="url(#sidsGrad)" opacity="0.25"/>
  <!-- Milk Drop + Leaf Emblem -->
  <path d="M 50 20 C 38 35 34 47 34 54 C 34 64 41 72 50 72 C 59 72 66 64 66 54 C 66 47 62 35 50 20 Z" fill="url(#milkGrad)"/>
  <!-- Sprout inside drop -->
  <path d="M 50 62 C 50 50 43 45 40 45 C 40 52 46 59 50 62 Z" fill="#2d6a4f"/>
  <path d="M 50 62 C 50 48 57 43 61 44 C 61 51 55 58 50 62 Z" fill="#52b788"/>
  <text x="50" y="86" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#d8f3dc" letter-spacing="0.5">SID'S FARM</text>
</svg>""",

    "nsl-sugars.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="nslGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e76f51"/>
      <stop offset="100%" stop-color="#f4a261"/>
    </linearGradient>
    <linearGradient id="stalkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#52b788"/>
      <stop offset="100%" stop-color="#2d6a4f"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#1b120c" stroke="#e76f51" stroke-width="2"/>
  <!-- Sugarcane Stalks -->
  <rect x="46" y="22" width="8" height="48" rx="3" fill="url(#stalkGrad)"/>
  <line x1="44" y1="34" x2="56" y2="34" stroke="#d8f3dc" stroke-width="2"/>
  <line x1="44" y1="46" x2="56" y2="46" stroke="#d8f3dc" stroke-width="2"/>
  <line x1="44" y1="58" x2="56" y2="58" stroke="#d8f3dc" stroke-width="2"/>
  <!-- Leaves branching out -->
  <path d="M 46 34 Q 32 28 26 36 Q 36 38 46 38" fill="#74c69d"/>
  <path d="M 54 46 Q 68 40 74 48 Q 64 50 54 50" fill="#52b788"/>
  <circle cx="50" cy="18" r="4" fill="url(#nslGrad)"/>
  <text x="50" y="84" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#f4a261" letter-spacing="1">NSL SUGARS</text>
</svg>""",

    "agritech.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="droneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f5d4"/>
      <stop offset="100%" stop-color="#00bbf9"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#051923" stroke="#00bbf9" stroke-width="2"/>
  <!-- Drone Body -->
  <circle cx="50" cy="46" r="11" fill="url(#droneGrad)"/>
  <circle cx="50" cy="46" r="4.5" fill="#051923"/>
  <!-- Drone Arms -->
  <line x1="30" y1="30" x2="70" y2="62" stroke="#00f5d4" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="30" y1="62" x2="70" y2="30" stroke="#00f5d4" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Rotors -->
  <ellipse cx="30" cy="30" rx="11" ry="3.5" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <ellipse cx="70" cy="30" rx="11" ry="3.5" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <ellipse cx="30" cy="62" rx="11" ry="3.5" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <ellipse cx="70" cy="62" rx="11" ry="3.5" fill="none" stroke="#ffffff" stroke-width="1.8"/>
  <!-- Sensor Beam -->
  <polygon points="46,58 54,58 64,74 36,74" fill="#00f5d4" opacity="0.25"/>
  <text x="50" y="88" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#00f5d4" letter-spacing="0.5">AGRITECH UAV</text>
</svg>""",

    "angrau.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="angrauGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1b4332"/>
      <stop offset="50%" stop-color="#2d6a4f"/>
      <stop offset="100%" stop-color="#40916c"/>
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#fb8500"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#081c15" stroke="#40916c" stroke-width="2"/>
  <circle cx="50" cy="45" r="34" fill="none" stroke="url(#sunGrad)" stroke-width="2.5"/>
  <!-- Rising Sun over Fields -->
  <path d="M 30 46 A 20 20 0 0 1 70 46 Z" fill="url(#sunGrad)" opacity="0.85"/>
  <!-- Wheat / Rice Ears -->
  <path d="M 50 68 L 50 30" stroke="#d8f3dc" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="43" cy="38" rx="6" ry="3" transform="rotate(-30 43 38)" fill="#ffb703"/>
  <ellipse cx="57" cy="38" rx="6" ry="3" transform="rotate(30 57 38)" fill="#ffb703"/>
  <ellipse cx="43" cy="48" rx="6" ry="3" transform="rotate(-30 43 48)" fill="#ffb703"/>
  <ellipse cx="57" cy="48" rx="6" ry="3" transform="rotate(30 57 48)" fill="#ffb703"/>
  <text x="50" y="85" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="12" fill="#d8f3dc" letter-spacing="1">ANGRAU</text>
</svg>""",

    "itm-university.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="itmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0077b6"/>
      <stop offset="100%" stop-color="#023e8a"/>
    </linearGradient>
    <linearGradient id="goldStar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd166"/>
      <stop offset="100%" stop-color="#f77f00"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#03071e" stroke="#0077b6" stroke-width="2"/>
  <!-- University Shield -->
  <path d="M 50 18 L 74 26 C 74 54 50 68 50 72 C 50 68 26 54 26 26 Z" fill="url(#itmGrad)" stroke="url(#goldStar)" stroke-width="2"/>
  <!-- Book / Knowledge -->
  <path d="M 36 44 Q 50 40 50 48 Q 50 40 64 44 L 64 54 Q 50 50 50 58 Q 50 50 36 54 Z" fill="#ffffff"/>
  <!-- Star on top -->
  <polygon points="50,23 52,28 57,28 53,31 55,36 50,33 45,36 47,31 43,28 48,28" fill="#ffd166"/>
  <text x="50" y="86" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#ffd166" letter-spacing="1">ITM GWALIOR</text>
</svg>""",

    "vn-organics.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="vnGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#386641"/>
      <stop offset="100%" stop-color="#6a994e"/>
    </linearGradient>
    <linearGradient id="shroomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f2e8cf"/>
      <stop offset="100%" stop-color="#bc4749"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#132a13" stroke="#6a994e" stroke-width="2"/>
  <circle cx="50" cy="46" r="32" fill="url(#vnGrad)" opacity="0.3"/>
  <!-- Mushroom Cap & Stem -->
  <path d="M 28 44 C 28 26 72 26 72 44 C 72 47 28 47 28 44 Z" fill="url(#shroomGrad)"/>
  <path d="M 44 47 L 42 66 C 42 69 58 69 58 66 L 56 47 Z" fill="#f2e8cf"/>
  <!-- Organic Spores / Dots -->
  <circle cx="40" cy="36" r="2.8" fill="#ffffff" opacity="0.9"/>
  <circle cx="52" cy="32" r="3.2" fill="#ffffff" opacity="0.9"/>
  <circle cx="62" cy="38" r="2.5" fill="#ffffff" opacity="0.9"/>
  <!-- Bio Ring -->
  <circle cx="50" cy="46" r="36" fill="none" stroke="#a7c957" stroke-width="2" stroke-dasharray="4 3"/>
  <text x="50" y="85" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#a7c957" letter-spacing="0.5">VN ORGANICS</text>
</svg>""",

    "shuats.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="shuatsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14213d"/>
      <stop offset="100%" stop-color="#003566"/>
    </linearGradient>
    <linearGradient id="gisGlobe" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00b4d8"/>
      <stop offset="100%" stop-color="#0077b6"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#0a1128" stroke="#00b4d8" stroke-width="2"/>
  <!-- Globe with Latitude/Longitude Grids -->
  <circle cx="50" cy="46" r="28" fill="url(#gisGlobe)" opacity="0.4"/>
  <circle cx="50" cy="46" r="28" fill="none" stroke="#00b4d8" stroke-width="2.5"/>
  <ellipse cx="50" cy="46" rx="28" ry="11" fill="none" stroke="#90e0ef" stroke-width="1.8"/>
  <ellipse cx="50" cy="46" rx="14" ry="28" fill="none" stroke="#90e0ef" stroke-width="1.8"/>
  <line x1="50" y1="18" x2="50" y2="74" stroke="#caf0f8" stroke-width="2"/>
  <!-- Satellite Orbiting -->
  <path d="M 22 46 A 34 16 35 0 1 78 46" fill="none" stroke="#ffb703" stroke-width="2.5" stroke-dasharray="4 2"/>
  <circle cx="74" cy="38" r="4" fill="#ffb703"/>
  <text x="50" y="88" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="12" fill="#90e0ef" letter-spacing="1">SHUATS</text>
</svg>""",

    "nit-patna.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="nitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#9b2226"/>
      <stop offset="100%" stop-color="#ae2012"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#1b0000" stroke="#ae2012" stroke-width="2"/>
  <!-- Gear + Technology Emblem -->
  <circle cx="50" cy="44" r="24" fill="url(#nitGrad)"/>
  <circle cx="50" cy="44" r="10" fill="#1b0000"/>
  <!-- Satellite Dish / Waves -->
  <path d="M 38 44 Q 50 32 62 44" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <path d="M 32 44 Q 50 24 68 44" fill="none" stroke="#ee9b00" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="50,20 54,28 46,28" fill="#e9d8a6"/>
  <text x="50" y="85" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11.5" fill="#ee9b00" letter-spacing="1">NIT PATNA</text>
</svg>""",

    "agri-express.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="agriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a9d8f"/>
      <stop offset="100%" stop-color="#264653"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#0d1b1e" stroke="#2a9d8f" stroke-width="2"/>
  <!-- Research Article / Journal Document -->
  <rect x="30" y="20" width="40" height="50" rx="5" fill="#e9ecef"/>
  <rect x="34" y="24" width="32" height="42" fill="#ffffff"/>
  <!-- Journal Lines -->
  <line x1="38" y1="32" x2="62" y2="32" stroke="#264653" stroke-width="3.5"/>
  <line x1="38" y1="40" x2="58" y2="40" stroke="#2a9d8f" stroke-width="2"/>
  <line x1="38" y1="46" x2="62" y2="46" stroke="#6c757d" stroke-width="2"/>
  <line x1="38" y1="52" x2="52" y2="52" stroke="#6c757d" stroke-width="2"/>
  <!-- Green Sprout seal -->
  <circle cx="58" cy="56" r="8" fill="#2a9d8f"/>
  <path d="M 58 60 C 58 54 54 52 52 52 C 52 56 56 60 58 60 Z" fill="#ffffff"/>
  <text x="50" y="86" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#2a9d8f" letter-spacing="0.5">AGRI EXPRESS</text>
</svg>""",

    "shefuture.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="sheGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f72585"/>
      <stop offset="100%" stop-color="#7209b7"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#190028" stroke="#f72585" stroke-width="2"/>
  <!-- Flame of Innovation / Bioethanol Flask -->
  <path d="M 45 22 L 55 22 L 55 34 L 68 56 C 72 63 67 72 58 72 L 42 72 C 33 72 28 63 32 56 L 45 34 Z" fill="url(#sheGrad)" opacity="0.3"/>
  <path d="M 45 22 L 55 22 L 55 34 L 68 56 C 72 63 67 72 58 72 L 42 72 C 33 72 28 63 32 56 L 45 34 Z" fill="none" stroke="#f72585" stroke-width="2.5"/>
  <!-- Biofuel Leaf inside flask -->
  <path d="M 50 66 C 44 60 42 50 50 44 C 58 50 56 60 50 66 Z" fill="#4cc9f0"/>
  <text x="50" y="86" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#f72585" letter-spacing="0.5">SHEFUTURE</text>
</svg>""",

    "sri-chaitanya.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="scGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffb703"/>
      <stop offset="100%" stop-color="#fb8500"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#140b00" stroke="#ffb703" stroke-width="2"/>
  <!-- Torch of Learning -->
  <polygon points="46,42 54,42 52,66 48,66" fill="#8d99ae"/>
  <path d="M 50 20 C 42 28 40 34 50 42 C 60 34 58 28 50 20 Z" fill="url(#scGrad)"/>
  <circle cx="50" cy="33" r="4" fill="#ffd166"/>
  <text x="50" y="82" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#ffb703" letter-spacing="0.5">SRI CHAITANYA</text>
</svg>""",

    "gis-watershed.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00f5d4"/>
      <stop offset="100%" stop-color="#0077b6"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="22" fill="#031b26" stroke="#00f5d4" stroke-width="2"/>
  <!-- Terrain Contours & Watershed Drainage -->
  <path d="M 20 65 Q 40 30 50 48 T 80 35" fill="none" stroke="#2d6a4f" stroke-width="3"/>
  <path d="M 20 75 Q 35 48 50 62 T 80 50" fill="none" stroke="#52b788" stroke-width="2.5"/>
  <path d="M 50 20 L 50 48 Q 50 65 35 78" fill="none" stroke="url(#waterGrad)" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M 50 48 Q 62 62 70 76" fill="none" stroke="url(#waterGrad)" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="50" cy="20" r="4.5" fill="#00f5d4"/>
  <text x="50" y="90" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#00f5d4" letter-spacing="0.5">GIS TERRAIN</text>
</svg>"""
}

# Write all logos
for filename, content in LOGOS.items():
    (PUBLIC_LOGOS / filename).write_text(content, encoding="utf-8")
    (CLASSIC_LOGOS / filename).write_text(content, encoding="utf-8")
    print(f"Generated logo: {filename}")

# Generate the Official Signature SVG
SIGNATURE_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" width="360" height="120">
  <defs>
    <linearGradient id="sigGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00ffcc"/>
      <stop offset="40%" stop-color="#52b788"/>
      <stop offset="100%" stop-color="#c9a84c"/>
    </linearGradient>
    <filter id="sigGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Stylized Elegant Signature of N. Akshit Vinay -->
  <g fill="none" stroke="url(#sigGold)" stroke-linecap="round" stroke-linejoin="round" filter="url(#sigGlow)">
    <!-- 'N.' flourish -->
    <path d="M 28 82 C 30 50, 36 28, 42 22 C 46 18, 52 24, 56 46 L 70 78 C 74 86, 78 54, 82 40 C 85 30, 88 42, 90 62" stroke-width="3.2"/>
    <circle cx="98" cy="74" r="2.5" fill="#00ffcc"/>
    
    <!-- 'Akshit' dynamic script -->
    <path d="M 112 72 C 116 52, 126 32, 134 26 C 138 22, 142 30, 138 48 C 134 64, 126 76, 140 70 C 148 66, 156 50, 160 48 C 158 56, 156 68, 164 68 C 172 68, 180 52, 184 46 C 182 58, 182 68, 192 68 C 198 68, 204 56, 206 50 C 208 44, 210 58, 214 68" stroke-width="2.8"/>
    <!-- Crossbar for 't' and flourish -->
    <path d="M 200 46 Q 224 44 238 48" stroke-width="2.2"/>
    
    <!-- 'Vinay' soaring ligature -->
    <path d="M 242 42 L 254 74 L 268 36 C 274 54, 276 68, 284 68 C 292 68, 298 52, 302 46 C 302 56, 304 68, 312 68 C 322 68, 332 50, 340 38" stroke-width="2.8"/>
    
    <!-- Signature base underline flourish -->
    <path d="M 40 92 Q 180 106 338 78" stroke-width="2.2" stroke-dasharray="240 6 30 4"/>
    <circle cx="344" cy="76" r="2.2" fill="#c9a84c"/>
  </g>
  <!-- Verified Cryptographic Security Micro-Text -->
  <text x="180" y="114" text-anchor="middle" font-family="'Courier New', monospace" font-size="8.5" fill="#52b788" letter-spacing="2.5" opacity="0.85">VERIFIED ACADEMIC CREDENTIAL • 2080</text>
</svg>"""

(PUBLIC_SIG / "signature.svg").write_text(SIGNATURE_SVG, encoding="utf-8")
(CLASSIC_SIG / "signature.svg").write_text(SIGNATURE_SVG, encoding="utf-8")
print("Generated signature.svg successfully!")
