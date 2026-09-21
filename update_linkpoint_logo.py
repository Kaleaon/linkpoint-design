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


top_base, top_faces = pyramid(+H, TOP_Y)
bot_base, bot_faces = pyramid(-H, BOT_Y)

DOCS = pathlib.Path(__file__).resolve().parent / "docs"

# gradient assignment kept from the original artwork so colours are unchanged
TOP_GRAD = ["face1Grad", "face2Grad", "face3Grad", "face4Grad"]
BOT_GRAD = ["face4Grad", "face3Grad", "face1Grad", "face2Grad"]

DUR = "4s"


def join(seq):
    return "; ".join(seq)


def anim_face(grad, face, indent, suffix=""):
    i = " " * indent
    return (
        f'{i}<polygon fill="url(#{grad}{suffix})" stroke="var(--ink, rgba(255,255,255,0.5))" stroke-width="1.5"\n'
        f'{i}         stroke-linejoin="round" stroke-linecap="round">\n'
        f'{i}  <animate attributeName="points" dur="{DUR}" repeatCount="indefinite" calcMode="linear"\n'
        f'{i}           values="{face["points"]}"/>\n'
        f'{i}  <animate attributeName="opacity" dur="{DUR}" repeatCount="indefinite" calcMode="linear"\n'
        f'{i}           values="{face["opacity"]}"/>\n'
        f'{i}</polygon>\n'
    )


def anim_base(kf, stroke, indent):
    i = " " * indent
    return (
        f'{i}<polygon fill="var(--surf, rgba(15, 23, 42, 0.9))" stroke="{stroke}" stroke-opacity="0.6"\n'
        f'{i}         stroke-width="1.5" stroke-linejoin="round">\n'
        f'{i}  <animate attributeName="points" dur="{DUR}" repeatCount="indefinite" calcMode="linear"\n'
        f'{i}           values="{kf}"/>\n'
        f'{i}</polygon>\n'
    )


# --------------------------------------------------------------- particles
# path fraction 0 -> 0.5 sweeps the NEAR (front) half of the ellipse,
# 0.5 -> 1 the FAR (back) half.  Each mote is drawn twice, once in each
# depth layer, and the two copies cross-fade at the left/right extremes
# where they sit well clear of the crystal.
KEYTIMES = "0; 0.44; 0.56; 0.94; 1"
NEAR_OPA = "1; 1; 0; 0; 1"
FAR_OPA = "0; 0; 1; 1; 0"

MOTES = [  # (near radius, far radius, colour var, begin)
    (4, 3, "var(--pri, #2dd4bf)", "0s"),
    (5, 3.5, "var(--sec2, #a5b4fc)", "-1.33s"),
    (3, 2.25, "var(--sec, #d946ef)", "-2.66s"),
]


def motes(layer, indent, track="orbitTrack", filt="glow"):
    i = " " * indent
    out = []
    for near_r, far_r, fill, begin in MOTES:
        r = near_r if layer == "near" else far_r
        opa = NEAR_OPA if layer == "near" else FAR_OPA
        out.append(
            f'{i}<circle r="{fmt(float(r))}" fill="{fill}" filter="url(#{filt})">\n'
            f'{i}  <animateMotion dur="{DUR}" repeatCount="indefinite" begin="{begin}">\n'
            f'{i}    <mpath href="#{track}"/>\n'
            f'{i}  </animateMotion>\n'
            f'{i}  <animate attributeName="opacity" dur="{DUR}" repeatCount="indefinite" begin="{begin}"\n'
            f'{i}           calcMode="linear" keyTimes="{KEYTIMES}" values="{opa}"/>\n'
            f'{i}</circle>\n'
        )
    return "".join(out)


STYLE = """  <style>
    /* The two halves close into a perfect octahedron: the base centres sit
       172px apart, so each half travels exactly 86px to meet at the waist. */
    .top-crystal {
      animation: topCloseSequence 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .bot-crystal {
      animation: botCloseSequence 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
    .core-anim {
      transform-origin: 256px 256px;
      animation: corePulse 6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    /* Y-axis closing sequence */
    @keyframes topCloseSequence {
      0%, 15% { transform: translateY(0); }
      35%, 65% { transform: translateY(86px); }
      85%, 100% { transform: translateY(0); }
    }

    @keyframes botCloseSequence {
      0%, 15% { transform: translateY(0); }
      35%, 65% { transform: translateY(-86px); }
      85%, 100% { transform: translateY(0); }
    }

    @keyframes corePulse {
      0%, 25% { transform: scale(1); opacity: 0.8; }
      35%, 65% { transform: scale(0.6) rotate(180deg); opacity: 1; filter: drop-shadow(0 0 20px var(--pri, #2dd4bf)); }
      75%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
    }

    .logo-title {
      font-family: var(--dfont, 'JetBrains Mono', 'Open Sans', sans-serif);
      font-weight: 800;
      font-size: 38px;
      letter-spacing: 0.28em;
      fill: var(--pri, #2dd4bf);
    }
    .logo-subtitle {
      font-family: var(--font, 'JetBrains Mono', 'Open Sans', sans-serif);
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.38em;
      fill: var(--ink2, #a5b4fc);
    }
  </style>
"""

STYLE_STATIC = """  <style>
    .logo-title {
      font-family: var(--dfont, 'JetBrains Mono', 'Open Sans', sans-serif);
      font-weight: 800;
      font-size: 38px;
      letter-spacing: 0.28em;
      fill: var(--pri, #2dd4bf);
    }
    .logo-subtitle {
      font-family: var(--font, 'JetBrains Mono', 'Open Sans', sans-serif);
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.38em;
      fill: var(--ink2, #a5b4fc);
    }
  </style>
"""


def defs(suffix="", track=True):
    t = f'''
    <!-- Orbit track.  Fraction 0 - 0.5 is the near half, 0.5 - 1 the far half. -->
    <path id="orbitTrack" d="M 56 256 A 200 65 0 1 0 456 256 A 200 65 0 1 0 56 256"/>
''' if track else ""
    return f'''  <defs>
    <!-- Base Gradients using CSS Theme Variables with defaults -->
    <linearGradient id="face1Grad{suffix}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="var(--pri, #2dd4bf)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--priC, #0284c7)" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="face2Grad{suffix}" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="var(--sec2, #7c3aed)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--sec, #0369a1)" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="face3Grad{suffix}" x1="50%" y1="100%" x2="50%" y2="0%">
      <stop offset="0%" stop-color="var(--sec, #7c3aed)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--surf2, #312e81)" stop-opacity="1"/>
    </linearGradient>
    <linearGradient id="face4Grad{suffix}" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="var(--pri, #d946ef)" stop-opacity="1"/>
      <stop offset="100%" stop-color="var(--sec2, #a21caf)" stop-opacity="1"/>
    </linearGradient>

    <radialGradient id="coreGlow{suffix}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="30%" stop-color="var(--pri, #2dd4bf)" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="var(--sec, #0284c7)" stop-opacity="0"/>
    </radialGradient>

    <!-- Particle glow.  The region has to clear 3 sigma of blur on every side
         of a 3px mote, so it runs well outside the object bounding box. -->
    <filter id="glow{suffix}" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
{t}  </defs>
'''


GRID_FAR = '''  <!-- ===== FAR DEPTH LAYER - everything behind the crystal ===== -->
  <g stroke="var(--outv, rgba(255,255,255,0.08))" stroke-width="1.5" fill="none" opacity="0.6">
    <!-- far halves of the ground plane -->
    <polyline points="82,256 256,180 430,256"/>
    <polyline points="22,256 256,120 490,256"/>
    <line x1="256" y1="20" x2="256" y2="492" stroke-dasharray="4 6"/>
    <line x1="22" y1="256" x2="490" y2="256" stroke-dasharray="4 6"/>
  </g>

  <!-- far halves of the orbital rings -->
  <path d="M 56 256 A 200 65 0 0 1 456 256" fill="none" stroke="var(--sec2, #2dd4bf)"
        stroke-opacity="0.16" stroke-width="2" stroke-dasharray="4 12"/>
  <path d="M 41 256 A 215 72 0 0 1 471 256" fill="none" stroke="var(--outv, rgba(255, 255, 255, 0.1))"
        stroke-width="1" stroke-opacity="0.55"/>
'''

GRID_NEAR_HEAD = '''  <!-- ===== NEAR DEPTH LAYER - everything in front of the crystal ===== -->
  <!-- near halves of the orbital rings -->
  <path d="M 56 256 A 200 65 0 0 0 456 256" fill="none" stroke="var(--sec2, #2dd4bf)"
        stroke-opacity="0.38" stroke-width="2" stroke-dasharray="4 12"/>
  <path d="M 41 256 A 215 72 0 0 0 471 256" fill="none" stroke="var(--outv, rgba(255, 255, 255, 0.1))"
        stroke-width="1"/>
'''

GRID_NEAR_TAIL = '''  <g stroke="var(--outv, rgba(255,255,255,0.08))" stroke-width="1.5" fill="none" opacity="0.6">
    <!-- near halves of the ground plane -->
    <polyline points="430,256 256,332 82,256"/>
    <polyline points="490,256 256,392 22,256"/>
  </g>
'''

CORE = '''  <!-- CORE NODE -->
  <g class="{cls}">
    <circle cx="256" cy="256" r="45" fill="url(#coreGlow{sfx})"/>
    <polygon points="256,242 270,256 256,270 242,256" fill="var(--ink, #ffffff)"/>
  </g>

  <!-- TITLE TYPOGRAPHY BENEATH -->
  <g transform="translate(0, 522)">
    <text x="256" y="0" text-anchor="middle" class="logo-title">LINKPOINT</text>
    <text x="256" y="28" text-anchor="middle" class="logo-subtitle">SECONDLIFE COMMUNICATOR</text>
  </g>

</svg>
'''

# ============================================================== animated SVG
a = ['<?xml version="1.0" standalone="no"?>\n',
     '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
     'id="linkpoint-logo-animated" viewBox="0 0 512 580" width="100%" height="100%">\n',
     STYLE, "\n", defs(), "\n", GRID_FAR, "\n",
     "  <!-- orbiting motes, far half -->\n  <g opacity=\"0.6\">\n", motes("far", 4), "  </g>\n\n",
     "  <!-- BOTTOM PYRAMID - drawn first: it sits below the waist, so the camera\n"
     "       (which looks down on the scene) always sees it behind the top half. -->\n"
     '  <g class="bot-crystal">\n',
     anim_base(bot_base_kf := "; ".join(bot_base), "var(--sec, #d946ef)", 4)]
for i in range(4):
    a.append(anim_face(BOT_GRAD[i], {"points": "; ".join(bot_faces[i]["points"]),
                                     "opacity": "; ".join(fmt(v) for v in bot_faces[i]["opacity"])}, 4))
a.append("  </g>\n\n")
a.append('  <!-- TOP PYRAMID -->\n  <g class="top-crystal">\n')
a.append(anim_base("; ".join(top_base), "var(--pri, #2dd4bf)", 4))
for i in range(4):
    a.append(anim_face(TOP_GRAD[i], {"points": "; ".join(top_faces[i]["points"]),
                                     "opacity": "; ".join(fmt(v) for v in top_faces[i]["opacity"])}, 4))
a.append("  </g>\n\n")
a.append(GRID_NEAR_HEAD)
a.append("\n  <!-- orbiting motes, near half -->\n  <g>\n")
a.append(motes("near", 4))
a.append("  </g>\n\n")
a.append(GRID_NEAR_TAIL)
a.append("\n")
a.append(CORE.format(cls="core-anim", sfx=""))
(DOCS / "linkpoint-logo-animated.svg").write_text("".join(a))

# ================================================================ static SVG
ROT = 0.0
def static_pyramid(apex_y, base_y, grads, stroke_col):
    apex = (0.0, apex_y, 0.0)
    centroid = (0.0, apex_y / 4.0, 0.0)
    B = base_vertices(ROT)
    out = [f'    <polygon fill="var(--surf, rgba(15, 23, 42, 0.9))" stroke="{stroke_col}" stroke-opacity="0.6"\n'
           f'             stroke-width="1.5" stroke-linejoin="round" points="{pts(B, base_y)}"/>\n']
    for i in range(4):
        tri = (apex, B[i], B[(i + 1) % 4])
        o = shade(facing(tri, centroid))
        if o <= 0:
            continue          # back facing - culled instead of painted over the front
        out.append(
            f'    <polygon fill="url(#{grads[i]}Static)" stroke="var(--ink, rgba(255,255,255,0.5))" stroke-width="1.5"\n'
            f'             stroke-linejoin="round" stroke-linecap="round" opacity="{fmt(o)}"\n'
            f'             points="{pts(tri, base_y)}"/>\n')
    return "".join(out)

s = ['<?xml version="1.0" standalone="no"?>\n',
     '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
     'id="linkpoint-logo-static" viewBox="0 0 512 580" width="100%" height="100%">\n',
     STYLE_STATIC, "\n", defs(suffix="Static", track=False), "\n", GRID_FAR, "\n",
     '  <!-- orbiting motes, far half -->\n  <g opacity="0.6">\n'
     '    <circle cx="150" cy="201" r="3.5" fill="var(--sec2, #a5b4fc)" filter="url(#glowStatic)"/>\n'
     '  </g>\n\n',
     '  <!-- BOTTOM PYRAMID (Static Solid Gem) -->\n  <g style="isolation: isolate">\n',
     static_pyramid(-H, BOT_Y, BOT_GRAD, "var(--sec, #d946ef)"), "  </g>\n\n",
     '  <!-- TOP PYRAMID (Static Solid Gem) -->\n  <g style="isolation: isolate">\n',
     static_pyramid(+H, TOP_Y, TOP_GRAD, "var(--pri, #2dd4bf)"), "  </g>\n\n",
     GRID_NEAR_HEAD,
     '\n  <!-- orbiting motes, near half -->\n  <g>\n'
     '    <circle cx="56" cy="256" r="4" fill="var(--pri, #2dd4bf)" filter="url(#glowStatic)"/>\n'
     '    <circle cx="430" cy="280" r="3" fill="var(--sec, #d946ef)" filter="url(#glowStatic)"/>\n'
     '  </g>\n\n',
     GRID_NEAR_TAIL, "\n",
     CORE.format(cls="", sfx="Static").replace('<g class="">', "<g>")]
(DOCS / "linkpoint-logo-static.svg").write_text("".join(s))

# ============================================================ React data file
def react_pyramid(base_kf, faces, grads):
    return {
        "base": "; ".join(base_kf),
        "faces": [{"grad": grads[i],
                   "points": "; ".join(faces[i]["points"]),
                   "opacity": "; ".join(fmt(v) for v in faces[i]["opacity"])} for i in range(4)],
    }

def static_faces(apex_y, base_y, grads):
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
    "motes": [{"near": m[0], "far": m[1], "begin": m[3]} for m in MOTES],
    "keyTimes": KEYTIMES, "nearOpacity": NEAR_OPA, "farOpacity": FAR_OPA,
    "top": react_pyramid(top_base, top_faces, TOP_GRAD),
    "bot": react_pyramid(bot_base, bot_faces, BOT_GRAD),
    "topStatic": static_faces(+H, TOP_Y, TOP_GRAD),
    "botStatic": static_faces(-H, BOT_Y, BOT_GRAD),
}

hdr = """// Generated geometry for <LinkpointLogo>.  A square pyramid (base half
// diagonal 136px, apex 130px above the base) is rotated about its vertical
// axis and projected with the same 20.2deg camera elevation as the rest of
// the mark.  Faces that turn away from the camera are culled, so the solid
// never shows its interior and never paints a hidden face over a visible one.
//
// `points` / `opacity` are SMIL value lists, one entry every %g degrees.
"""
body = "export const CRYSTAL = " + json.dumps(react, indent=2) + ";\n"
(DOCS / "react/src/components/linkpointCrystal.js").write_text((hdr % STEP) + "\n" + body)

for p in ("linkpoint-logo-animated.svg", "linkpoint-logo-static.svg",
          "react/src/components/linkpointCrystal.js"):
    print(f"wrote docs/{p}  ({(DOCS / p).stat().st_size} bytes)")
