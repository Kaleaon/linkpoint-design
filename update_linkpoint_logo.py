#!/usr/bin/env python3
"""Regenerate the Linkpoint crystal logo (both SVGs + the React geometry data).

The mark is a pair of square pyramids spinning about a shared vertical axis.
Hand-authored keyframes could not keep that honest: faces that had turned away
from the camera were still painted over the visible ones, the two halves
interpenetrated as they closed, and the orbit always ran behind the solid.  So
the geometry is computed here instead.

  * The projection is recovered from the original artwork (base half-diagonal
    136px, apex 130px above the base, ~20.2 deg camera elevation), so the
    silhouette at rest is identical to the drawing it replaces.
  * Every face is back-face culled, which for a convex solid is all the depth
    sorting needed: the visible faces tile the silhouette and never overlap.
  * The halves travel 86px each to close - exactly half the 172px between their
    base centres - so they meet as a true octahedron at any rotation instead of
    shearing through one another.
  * The ground plane, the orbit rings and the orbiting motes are each split into
    a far half (drawn behind the solid) and a near half (drawn in front of it).

Faces are opaque and carry no blend mode: `mix-blend-mode: screen` collapses to
white over the light palettes (aero, paper, nouveau, calm, solarpunk), where the
body plate `--surf` is itself near-white.

Run from the repo root:  python3 update_linkpoint_logo.py
"""

import json
import re
import math
import pathlib

CX      = 256.0
R       = 136.0            # base half-diagonal (screen x units)
DEPTH   = 50.0 / 136.0     # world z -> screen y
H       = 130.0            # apex height above base plane
TOP_Y   = 170.0            # screen y of the top pyramid's base centre
BOT_Y   = 342.0            # screen y of the bottom pyramid's base centre
STEP    = 7.5              # degrees between keyframes
STEPS   = int(360 / STEP)

VIEW = (0.0, DEPTH, 1.0)                       # direction pointing at the camera
VLEN = math.sqrt(VIEW[1] ** 2 + VIEW[2] ** 2)
VHAT = (0.0, VIEW[1] / VLEN, VIEW[2] / VLEN)


def sub(a, b):   return (a[0] - b[0], a[1] - b[1], a[2] - b[2])
def cross(a, b): return (a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0])
def dot(a, b):   return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]
def norm(a):
    l = math.sqrt(dot(a, a))
    return (a[0]/l, a[1]/l, a[2]/l)


def project(p, base_y):
    """world (x up-y toward-viewer-z) -> screen"""
    return (CX + p[0], base_y - p[1] + DEPTH * p[2])


def fmt(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def pts(poly, base_y):
    return " ".join(f"{fmt(x)},{fmt(y)}" for x, y in (project(p, base_y) for p in poly))


def base_vertices(rot_deg, i_offset=0):
    out = []
    for i in range(4):
        a = math.radians(rot_deg + (i + i_offset) * 90.0)
        out.append((R * math.cos(a), 0.0, R * math.sin(a)))
    return out


def facing(poly, centroid):
    """Outward unit normal dotted with the view direction.

    >0 means the face points at the camera (front facing)."""
    n = cross(sub(poly[1], poly[0]), sub(poly[2], poly[0]))
    c = (sum(p[0] for p in poly) / len(poly),
         sum(p[1] for p in poly) / len(poly),
         sum(p[2] for p in poly) / len(poly))
    if dot(n, sub(c, centroid)) < 0:       # make sure it points away from the solid
        n = (-n[0], -n[1], -n[2])
    return dot(norm(n), VHAT)


# ---------------------------------------------------------------- shading
FACE_MAX = 1.0
def shade(f):
    """Lambert-ish brightness ramp; 0 once the face turns away from the camera.

    The floor is kept high: `opacity` also decides how much of the body plate
    reads through a facet, and on the light palettes that plate is near white,
    so a wide ramp would wash the crystal out."""
    if f <= 0:
        return 0.0
    return round(FACE_MAX * (0.88 + 0.12 * min(f, 1.0)), 3)


def pyramid(apex_y, base_y):
    """Returns (base_points[], faces[]) keyframe lists for one pyramid.

    faces[i] = {"points": [...], "opacity": [...]} for side face i, where
    face i spans base vertices i and i+1 at rotation `rot`.
    """
    apex = (0.0, apex_y, 0.0)
    centroid = (0.0, apex_y / 4.0, 0.0)          # centroid of a pyramid
    base_kf, faces = [], [{"points": [], "opacity": []} for _ in range(4)]

    for s in range(STEPS + 1):                   # +1 so the loop closes cleanly
        rot = (s % STEPS) * STEP
        B = base_vertices(rot)
        base_kf.append(pts(B, base_y))
        for i in range(4):
            tri = (apex, B[i], B[(i + 1) % 4])
            faces[i]["points"].append(pts(tri, base_y))
            faces[i]["opacity"].append(shade(facing(tri, centroid)))
    return base_kf, faces


def series(vals):
    return "; ".join(fmt(v) if isinstance(v, float) else str(v) for v in vals)



top_base, top_faces = pyramid(+H, TOP_Y)
bot_base, bot_faces = pyramid(-H, BOT_Y)

ROOT = pathlib.Path(__file__).resolve().parent
DOCS = ROOT / "docs"

# Everything the mark defines is namespaced, because the two SVGs are also
# inlined into index.html, where their ids and class names land in the page's
# global scope alongside the rest of the mockup.
NS = "lp-"

# gradient assignment kept from the original artwork so colours are unchanged
TOP_GRAD = ["face1Grad", "face2Grad", "face3Grad", "face4Grad"]
BOT_GRAD = ["face4Grad", "face3Grad", "face1Grad", "face2Grad"]

DUR = "4s"
INK = "var(--ink, rgba(255,255,255,0.5))"
SURF = "var(--surf, rgba(15, 23, 42, 0.9))"
GRID = "var(--outv, rgba(255,255,255,0.08))"
RING = "var(--sec2, #2dd4bf)"
RING2 = "var(--outv, rgba(255, 255, 255, 0.1))"

# path fraction 0 -> 0.5 sweeps the NEAR (front) half of the ellipse, 0.5 -> 1
# the FAR (back) half.  Each mote is drawn twice, once per depth layer, and the
# copies cross-fade at the left/right extremes where they are clear of the solid.
KEYTIMES = "0; 0.44; 0.56; 0.94; 1"
NEAR_OPA = "1; 1; 0; 0; 1"
FAR_OPA = "0; 0; 1; 1; 0"

# Motes are keyed by theme token so the React port, which substitutes token
# values directly rather than going through CSS variables, can reuse the data.
TOKEN = {"pri": "var(--pri, #2dd4bf)",
         "sec": "var(--sec, #d946ef)",
         "sec2": "var(--sec2, #a5b4fc)"}

MOTES = [  # (near radius, far radius, token, begin)
    (4, 3, "pri", "0s"),
    (5, 3.5, "sec2", "-1.33s"),
    (3, 2.25, "sec", "-2.66s"),
]

# Resting mote placements for the static mark: one parked on the far arc well
# clear of the crystal, two on the near arc.  (x, y, radius, token)
STATIC_MOTES = {"far": [(150, 201, 3.5, "sec2")],
                "near": [(56, 256, 4, "pri"), (430, 280, 3, "sec")]}


def ind(text, n):
    pad = " " * n
    return "".join(pad + line if line.strip() else line for line in text.splitlines(True))


# ----------------------------------------------------------------- <style>
KEYFRAMES = """    /* The halves close into a perfect octahedron: their base centres sit
       172px apart, so each travels exactly 86px to meet at the waist. */
    .%(ns)stop-crystal {
      animation: %(ns)stopClose 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .%(ns)sbot-crystal {
      animation: %(ns)sbotClose 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .%(ns)score-anim {
      transform-origin: 256px 256px;
      animation: %(ns)scorePulse 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes %(ns)stopClose {
      0%%, 15%% { transform: translateY(0); }
      35%%, 65%% { transform: translateY(86px); }
      85%%, 100%% { transform: translateY(0); }
    }

    @keyframes %(ns)sbotClose {
      0%%, 15%% { transform: translateY(0); }
      35%%, 65%% { transform: translateY(-86px); }
      85%%, 100%% { transform: translateY(0); }
    }

    @keyframes %(ns)scorePulse {
      0%%, 25%% { transform: scale(1); opacity: 0.8; }
      35%%, 65%% { transform: scale(0.6) rotate(180deg); opacity: 1; filter: drop-shadow(0 0 20px var(--pri, #2dd4bf)); }
      75%%, 100%% { transform: scale(1) rotate(0deg); opacity: 0.8; }
    }

"""

TYPE_STYLE = """    .%(ns)slogo-title {
      font-family: var(--dfont, 'JetBrains Mono', 'Open Sans', sans-serif);
      font-weight: 800;
      font-size: 38px;
      letter-spacing: 0.28em;
      fill: var(--pri, #2dd4bf);
    }
    .%(ns)slogo-subtitle {
      font-family: var(--font, 'JetBrains Mono', 'Open Sans', sans-serif);
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.38em;
      fill: var(--ink2, #a5b4fc);
    }
"""


def style_block(animated):
    body = (KEYFRAMES if animated else "") + TYPE_STYLE
    return "  <style>\n" + (body % {"ns": NS}) + "  </style>\n"


# ------------------------------------------------------------------ <defs>
def defs(sfx, track):
    t = (f'\n    <!-- Orbit track.  Fraction 0 - 0.5 is the near half, 0.5 - 1 the far half. -->\n'
         f'    <path id="{NS}orbitTrack" d="M 56 256 A 200 65 0 1 0 456 256 A 200 65 0 1 0 56 256"/>\n') if track else ""
    return f'''  <defs>
    <!-- Base gradients, driven by the theme's CSS variables with defaults -->
    <linearGradient id="{NS}face1Grad{sfx}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--pri, #2dd4bf)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--priC, #0284c7)" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="{NS}face2Grad{sfx}" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="var(--sec2, #7c3aed)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--sec, #0369a1)" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="{NS}face3Grad{sfx}" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="var(--sec, #7c3aed)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--surf2, #312e81)" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="{NS}face4Grad{sfx}" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="var(--pri, #d946ef)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--sec2, #a21caf)" stop-opacity="1"/>
    </linearGradient>

    <radialGradient id="{NS}coreGlow{sfx}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="30%" stop-color="var(--pri, #2dd4bf)" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="var(--sec, #0284c7)" stop-opacity="0"/>
    </radialGradient>

    <!-- Particle glow.  The region has to clear 3 sigma of blur on every side
         of a 3px mote, so it runs well outside the object bounding box. -->
    <filter id="{NS}glow{sfx}" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
{t}  </defs>
'''


# ----------------------------------------------------------- depth layers
FAR_LAYER = f'''  <!-- ===== FAR DEPTH LAYER - everything behind the crystal ===== -->
  <g stroke="{GRID}" stroke-width="1.5" fill="none" opacity="0.6">
    <!-- far halves of the ground plane -->
    <polyline points="82,256 256,180 430,256"/>
    <polyline points="22,256 256,120 490,256"/>
    <line x1="256" y1="20" x2="256" y2="492" stroke-dasharray="4 6"/>
    <line x1="22" y1="256" x2="490" y2="256" stroke-dasharray="4 6"/>
  </g>

  <!-- far halves of the orbital rings -->
  <path d="M 56 256 A 200 65 0 0 1 456 256" fill="none" stroke="{RING}"
        stroke-opacity="0.16" stroke-width="2" stroke-dasharray="4 12"/>
  <path d="M 41 256 A 215 72 0 0 1 471 256" fill="none" stroke="{RING2}"
        stroke-width="1" stroke-opacity="0.55"/>
'''

NEAR_RINGS = f'''  <!-- ===== NEAR DEPTH LAYER - everything in front of the crystal ===== -->
  <!-- near halves of the orbital rings -->
  <path d="M 56 256 A 200 65 0 0 0 456 256" fill="none" stroke="{RING}"
        stroke-opacity="0.38" stroke-width="2" stroke-dasharray="4 12"/>
  <path d="M 41 256 A 215 72 0 0 0 471 256" fill="none" stroke="{RING2}"
        stroke-width="1"/>
'''

NEAR_GRID = f'''  <g stroke="{GRID}" stroke-width="1.5" fill="none" opacity="0.6">
    <!-- near halves of the ground plane -->
    <polyline points="430,256 256,332 82,256"/>
    <polyline points="490,256 256,392 22,256"/>
  </g>
'''


def core_and_type(sfx, animated):
    cls = f' class="{NS}core-anim"' if animated else ""
    return f'''  <!-- CORE NODE -->
  <g{cls}>
    <circle cx="256" cy="256" r="45" fill="url(#{NS}coreGlow{sfx})"/>
    <polygon points="256,242 270,256 256,270 242,256" fill="var(--ink, #ffffff)"/>
  </g>

  <!-- TITLE TYPOGRAPHY BENEATH -->
  <g transform="translate(0, 522)">
    <text x="256" y="0" text-anchor="middle" class="{NS}logo-title">LINKPOINT</text>
    <text x="256" y="28" text-anchor="middle" class="{NS}logo-subtitle">SECONDLIFE COMMUNICATOR</text>
  </g>
'''


# ----------------------------------------------------------- animated body
def anim_face(grad, points, opacity):
    return (f'    <polygon fill="url(#{NS}{grad})" stroke="{INK}" stroke-width="1.5"\n'
            f'             stroke-linejoin="round" stroke-linecap="round">\n'
            f'      <animate attributeName="points" dur="{DUR}" repeatCount="indefinite" calcMode="linear"\n'
            f'               values="{points}"/>\n'
            f'      <animate attributeName="opacity" dur="{DUR}" repeatCount="indefinite" calcMode="linear"\n'
            f'               values="{opacity}"/>\n'
            f'    </polygon>\n')


def anim_base(kf, stroke):
    return (f'    <polygon fill="{SURF}" stroke="{stroke}" stroke-opacity="0.6"\n'
            f'             stroke-width="1.5" stroke-linejoin="round">\n'
            f'      <animate attributeName="points" dur="{DUR}" repeatCount="indefinite" calcMode="linear"\n'
            f'               values="{kf}"/>\n'
            f'    </polygon>\n')


def anim_pyramid(cls, base_kf, faces, grads, rim):
    out = [f'  <g class="{NS}{cls}">\n', anim_base("; ".join(base_kf), rim)]
    for i in range(4):
        out.append(anim_face(grads[i], "; ".join(faces[i]["points"]), series(faces[i]["opacity"])))
    out.append("  </g>\n")
    return "".join(out)


def anim_motes(layer):
    opa = NEAR_OPA if layer == "near" else FAR_OPA
    out = []
    for near_r, far_r, fill, begin in MOTES:
        r = near_r if layer == "near" else far_r
        out.append(
            f'    <circle r="{fmt(float(r))}" fill="{fill}" filter="url(#{NS}glow)">\n'
            f'      <animateMotion dur="{DUR}" repeatCount="indefinite" begin="{begin}">\n'
            f'        <mpath href="#{NS}orbitTrack"/>\n'
            f'      </animateMotion>\n'
            f'      <animate attributeName="opacity" dur="{DUR}" repeatCount="indefinite" begin="{begin}"\n'
            f'               calcMode="linear" keyTimes="{KEYTIMES}" values="{opa}"/>\n'
            f'    </circle>\n')
    return "".join(out)


# ------------------------------------------------------------- static body
ROT = 0.0


def static_pyramid(apex_y, base_y, grads, rim):
    apex = (0.0, apex_y, 0.0)
    centroid = (0.0, apex_y / 4.0, 0.0)
    B = base_vertices(ROT)
    out = [f'    <polygon fill="{SURF}" stroke="{rim}" stroke-opacity="0.6"\n'
           f'             stroke-width="1.5" stroke-linejoin="round" points="{pts(B, base_y)}"/>\n']
    for i in range(4):
        tri = (apex, B[i], B[(i + 1) % 4])
        o = shade(facing(tri, centroid))
        if o <= 0:
            continue          # back facing - culled, never painted over a front face
        out.append(f'    <polygon fill="url(#{NS}{grads[i]}Static)" stroke="{INK}" stroke-width="1.5"\n'
                   f'             stroke-linejoin="round" stroke-linecap="round" opacity="{fmt(o)}"\n'
                   f'             points="{pts(tri, base_y)}"/>\n')
    return "  <g>\n" + "".join(out) + "  </g>\n"


def static_motes(layer):
    return "".join(f'    <circle cx="{x}" cy="{y}" r="{fmt(float(r))}" fill="{TOKEN[token]}"'
                   f' filter="url(#{NS}glowStatic)"/>\n'
                   for x, y, r, token in STATIC_MOTES[layer])


# ------------------------------------------------------------ assembly
def open_tag(name, inline, title):
    """Root <svg>.  The inline copy carries the sizing the <img> used to get
    from its style attribute, plus a <title> in place of the img's alt text."""
    if inline:
        return (f'<svg id="{NS}{name}" viewBox="0 0 512 580" role="img"\n'
                f'     style="width:100%;height:auto;max-height:220px;'
                f'filter:drop-shadow(0 4px 16px rgba(0,0,0,0.3))">\n'
                f'  <title>{title}</title>\n')
    return ('<?xml version="1.0" standalone="no"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'id="{NS}{name}" viewBox="0 0 512 580" width="100%" height="100%">\n'
            f'  <title>{title}</title>\n')


TITLE = "Linkpoint logo"


def build_animated(inline=False):
    return "".join([
        open_tag("logo-animated", inline, TITLE), style_block(True), "\n",
        defs("", track=True), "\n", FAR_LAYER, "\n",
        '  <!-- orbiting motes, far half -->\n  <g opacity="0.6">\n', anim_motes("far"), "  </g>\n\n",
        "  <!-- BOTTOM PYRAMID - drawn first: it sits below the waist, so the camera\n"
        "       (which looks down on the scene) always sees it behind the top half. -->\n",
        anim_pyramid("bot-crystal", bot_base, bot_faces, BOT_GRAD, "var(--sec, #d946ef)"), "\n",
        "  <!-- TOP PYRAMID -->\n",
        anim_pyramid("top-crystal", top_base, top_faces, TOP_GRAD, "var(--pri, #2dd4bf)"), "\n",
        NEAR_RINGS,
        "\n  <!-- orbiting motes, near half -->\n  <g>\n", anim_motes("near"), "  </g>\n\n",
        NEAR_GRID, "\n", core_and_type("", animated=True), "\n</svg>\n",
    ])


def build_static(inline=False):
    return "".join([
        open_tag("logo-static", inline, TITLE), style_block(False), "\n",
        defs("Static", track=False), "\n", FAR_LAYER, "\n",
        '  <!-- orbiting motes, far half -->\n  <g opacity="0.6">\n',
        static_motes("far"), "  </g>\n\n",
        "  <!-- BOTTOM PYRAMID (static solid gem) -->\n",
        static_pyramid(-H, BOT_Y, BOT_GRAD, "var(--sec, #d946ef)"), "\n",
        "  <!-- TOP PYRAMID (static solid gem) -->\n",
        static_pyramid(+H, TOP_Y, TOP_GRAD, "var(--pri, #2dd4bf)"), "\n",
        NEAR_RINGS,
        "\n  <!-- orbiting motes, near half -->\n  <g>\n",
        static_motes("near"), "  </g>\n\n",
        NEAR_GRID, "\n", core_and_type("Static", animated=False), "\n</svg>\n",
    ])


(DOCS / "linkpoint-logo-animated.svg").write_text(build_animated())
(DOCS / "linkpoint-logo-static.svg").write_text(build_static())


# ------------------------------------------------- inline copies in index.html
# index.html reaches the logo through CSS custom properties set on an ancestor
# div at runtime.  Those cannot cross into an <img>-referenced SVG - it is a
# separate document - so the mark is inlined here to pick the palette up.
BEGIN = "<!-- LINKPOINT-LOGO:BEGIN generated by update_linkpoint_logo.py - do not edit by hand -->"
END = "<!-- LINKPOINT-LOGO:END -->"
PAD = 18

inline_block = (
    f'{" " * PAD}{BEGIN}\n'
    f'{" " * PAD}<sc-if value="{{{{ logoAnim }}}}" hint-placeholder-val="{{{{ true }}}}">\n'
    + ind(build_animated(inline=True), PAD + 2)
    + f'{" " * PAD}</sc-if>\n'
    f'{" " * PAD}<sc-if value="{{{{ !logoAnim }}}}" hint-placeholder-val="{{{{ false }}}}">\n'
    + ind(build_static(inline=True), PAD + 2)
    + f'{" " * PAD}</sc-if>\n'
    f'{" " * PAD}{END}'
)

index = DOCS / "index.html"
html = index.read_text()
if BEGIN in html and END in html:
    head, rest = html.split(BEGIN, 1)
    html = head + inline_block.lstrip(" ") + rest.split(END, 1)[1]
else:
    # First run: swap out the two <img> branches.  Anchored on the img src so it
    # cannot catch the ANIMATED/STATIC toggle label, which is also an sc-if pair
    # on `logoAnim` and appears just above.
    marker = re.compile(
        r'[ \t]*<sc-if value="\{\{ logoAnim \}\}"[^>]*>\s*'
        r'<img src="linkpoint-logo-animated\.svg"[^>]*/>\s*</sc-if>\s*'
        r'<sc-if value="\{\{ !logoAnim \}\}"[^>]*>\s*'
        r'<img src="linkpoint-logo-static\.svg"[^>]*/>\s*</sc-if>')
    if len(marker.findall(html)) != 1:
        raise SystemExit("index.html: expected exactly one logo <img> block to replace")
    html = marker.sub(lambda _: inline_block, html, count=1)
index.write_text(html)


# ============================================================ React data file
def react_pyramid(base_kf, faces, grads):
    return {
        "base": "; ".join(base_kf),
        "faces": [{"grad": grads[i],
                   "points": "; ".join(faces[i]["points"]),
                   "opacity": series(faces[i]["opacity"])} for i in range(4)],
    }


def react_static(apex_y, base_y, grads):
    apex = (0.0, apex_y, 0.0)
    centroid = (0.0, apex_y / 4.0, 0.0)
    B = base_vertices(ROT)
    res = {"base": pts(B, base_y), "faces": []}
    for i in range(4):
        tri = (apex, B[i], B[(i + 1) % 4])
        o = shade(facing(tri, centroid))
        if o > 0:
            res["faces"].append({"grad": grads[i], "points": pts(tri, base_y), "opacity": float(fmt(o))})
    return res


react = {
    "dur": DUR,
    "motes": [{"near": m[0], "far": m[1], "token": m[2], "begin": m[3]} for m in MOTES],
    "keyTimes": KEYTIMES, "nearOpacity": NEAR_OPA, "farOpacity": FAR_OPA,
    "top": react_pyramid(top_base, top_faces, TOP_GRAD),
    "bot": react_pyramid(bot_base, bot_faces, BOT_GRAD),
    "topStatic": react_static(+H, TOP_Y, TOP_GRAD),
    "botStatic": react_static(-H, BOT_Y, BOT_GRAD),
    "staticMotes": {k: [{"cx": m[0], "cy": m[1], "r": m[2], "token": m[3]} for m in v]
                    for k, v in STATIC_MOTES.items()},
}

hdr = f"""// Generated by update_linkpoint_logo.py -- do not edit by hand.
//
// A square pyramid (base half-diagonal 136px, apex 130px above the base) is
// rotated about its vertical axis and projected with the same ~20.2 deg camera
// elevation as the rest of the mark.  Faces that turn away from the camera are
// culled, so the solid never shows its interior and never paints a hidden face
// over a visible one.
//
// `points` / `opacity` are SMIL value lists, one entry every {STEP} degrees.

"""
(DOCS / "react/src/components/linkpointCrystal.js").write_text(
    hdr + "export const CRYSTAL = " + json.dumps(react, indent=2) + ";\n")

for p in ("linkpoint-logo-animated.svg", "linkpoint-logo-static.svg", "index.html",
          "react/src/components/linkpointCrystal.js"):
    print(f"wrote docs/{p}  ({(DOCS / p).stat().st_size} bytes)")
