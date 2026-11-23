"""
Génère sept chansons de démonstration pour la playlist d'Ayaan
(theme/musique/playlist/piste-01.mp3 à piste-07.mp3), environ 40 secondes chacune.

Ce sont des maquettes instrumentales, pour que le lecteur marche tout de suite.
Remplace-les par tes vraies chansons en gardant les mêmes noms de fichiers.

Usage :  python3 outils/generer-playlist.py
Attention : écrase les fichiers piste-01.mp3 à piste-07.mp3 existants.
"""
from synthe import *

PL = os.path.join(DOSSIER, 'playlist')
os.makedirs(PL, exist_ok=True)

def t_(d): return np.arange(int(d * SR)) / SR

def epiano(f, d, v=.2):
    t = t_(d); env = np.exp(-t * 2.2) * np.minimum(1, t * 200)
    return v * env * (np.sin(2*np.pi*f*t) + .25*np.sin(2*np.pi*2*f*t)*np.exp(-t*4)) * (1 + .15*np.sin(2*np.pi*5*t))

def pluck(f, d, v=.25, clair=.5):
    """Corde pincée (Karplus-Strong), calcul par blocs."""
    n = int(d * SR); P = max(2, int(SR / f)); y = np.zeros(n + P)
    y[:P] = rng.uniform(-1, 1, P)
    amort = 0.996 - (1 - clair) * 0.006
    for i in range(P, n + P, P):
        seg = y[i - P:i]; nxt = 0.5 * (seg + np.roll(seg, -1)) * amort
        y[i:i + P] = nxt[:len(y[i:i + P])]
    return v * y[P:] * np.minimum(1, t_(d) * 400)

def carre(f, d, v=.12, decl=6):
    t = t_(d); s = sum(np.sin(2*np.pi*f*k*t) / k for k in (1, 3, 5, 7))
    return v * s * np.exp(-t * decl) * np.minimum(1, t * 300)

def cordes(fs, d, v=.06):
    t = t_(d); env = np.minimum(1, t / 1.5) * np.minimum(1, (d - t) / 1.2)
    s = 0
    for f in fs:
        for det in (-.004, 0, .005):
            ff = f * (1 + det); s = s + sum(np.sin(2*np.pi*ff*k*t) / k * (.7 ** k) for k in range(1, 6))
    return v * env * s / (len(fs) * 3)

def kick(v=.5):
    t = t_(.35); f = 50 + 90 * np.exp(-t * 30)
    return v * np.sin(2*np.pi*np.cumsum(f)/SR) * np.exp(-t * 9)

def caisse(v=.18, d=.18):
    t = t_(d); return v * rng.standard_normal(len(t)) * np.exp(-t * 22)

def charley(v=.05):
    t = t_(.06); b = rng.standard_normal(len(t)); b = np.diff(b, prepend=0)
    return v * b * np.exp(-t * 70)

def timbale(f=55, v=.4):
    t = t_(1.5); return v * np.sin(2*np.pi*f*t) * np.exp(-t * 2.5) + caisse(.05, .3)[:len(t)].sum() * 0

def piste(duree): return np.zeros(int((duree + 3) * SR))

def finir(x, duree, fondu=3.0):
    x = x[:int((duree + 2.5) * SR)]
    n = int(fondu * SR); x[-n:] *= np.linspace(1, 0, n)
    return x

def accord(n0, type_='maj'):
    return [n0, n0 + (4 if type_ == 'maj' else 3), n0 + 7] + ([n0 + 11] if type_ == 'maj7' else [n0 + 10] if type_ == 'm7' else [])

# 1. Minuit à Silom : lofi tranquille, 78 bpm
D = 40; b = 60 / 78; x = piste(D)
prog = [(53, 'maj7'), (52, 'm7'), (50, 'm7'), (48, 'maj7')]
for m in range(int(D / (4 * b))):
    r, ty = prog[m % 4]; t0 = m * 4 * b
    for k, n in enumerate(accord(r, ty)):
        poser(x, epiano(hz(n + 12), 3.6 * b, .09), t0 + k * .03)
    poser(x, epiano(hz(r - 12), 3.6 * b, .16), t0)
    for q in range(8):
        poser(x, charley(.035 if q % 2 else .05), t0 + q * b / 2 + (0.03 if q % 2 else 0))
    poser(x, kick(.38), t0); poser(x, kick(.3), t0 + 2.5 * b)
    poser(x, caisse(.07, .25), t0 + b); poser(x, caisse(.07, .25), t0 + 3 * b)
    if m >= 2:
        mel = [72, 74, 76, 79, 77, 76, 74, 72][m % 8]
        poser(x, epiano(hz(mel + 5), 1.2 * b, .07), t0 + 1.5 * b)
ecrire('piste-01.mp3', finir(reverb(x), D), .4, '96k', PL)

# 2. Mon ex est mon voisin : pop entraînante, 118 bpm
D = 40; b = 60 / 118; x = piste(D)
prog = [60, 55, 57, 53]; types = ['maj', 'maj', 'min', 'maj']
mel = [76, 76, 74, 72, 74, 76, 79, 76, 74, 72, 71, 72, 74, 72, 71, 67]
for m in range(int(D / (4 * b))):
    r = prog[m % 4]; t0 = m * 4 * b
    for q in range(4):
        poser(x, kick(.45), t0 + q * b)
        for k, n in enumerate(accord(r, types[m % 4])):
            poser(x, pluck(hz(n + 12), b * .9, .07, .8), t0 + q * b + b / 2)
    poser(x, caisse(.16), t0 + b); poser(x, caisse(.16), t0 + 3 * b)
    for q in range(8): poser(x, pluck(hz(r - 12 + (7 if q % 4 == 2 else 0)), b * .5, .16, .3), t0 + q * b / 2)
    if m >= 4:
        for q in range(4): poser(x, carre(hz(mel[(m * 4 + q) % 16]), b * .9, .05, 3), t0 + q * b)
ecrire('piste-02.mp3', finir(reverb(x, dec=.25), D), .35, '96k', PL)

# 3. Bruit du riz qui cuit (version longue) : frémissements, bulles, couvercle, et le « ding »
D = 32; x = piste(D)
n = len(x); bruit = rng.standard_normal(n)
spec = np.fft.rfft(bruit); f = np.fft.rfftfreq(n, 1 / SR)
x += .12 * np.fft.irfft(spec * np.exp(-((np.log(f + 1) - np.log(500)) ** 2) / 1.2), n) / 1.0
x *= np.linspace(.2, 1, n) ** .5
for _ in range(900):
    d = rng.uniform(1, D) ** 1.0; fr = rng.uniform(250, 900) * (1 + d / D)
    t = t_(.05); poser(x, rng.uniform(.03, .1) * (d / D + .2) * np.sin(2*np.pi*fr*t*(1 + t*30)) * np.exp(-t * 90), d)
for k in range(40):
    d = 14 + k * .42 + rng.uniform(0, .1); poser(x, caisse(.04 + .002 * k, .05), d)
t = t_(2.5)
poser(x, .25 * (np.sin(2*np.pi*1318*t) + .4*np.sin(2*np.pi*2637*t)) * np.exp(-t * 2), D - 1.5)
ecrire('piste-03.mp3', finir(x, D, 1.0), .5, '96k', PL)

# 4. Drame sur Sukhumvit : la mineur, cordes et timbales, 66 bpm
D = 42; b = 60 / 66; x = piste(D)
prog = [(57, 'min'), (53, 'maj'), (48, 'maj'), (52, 'maj')]
mel = [76, 77, 76, 74, 72, 71, 72, 69]
for m in range(int(D / (4 * b))):
    r, ty = prog[m % 4]; t0 = m * 4 * b
    poser(x, cordes([hz(n) for n in accord(r, ty)] + [hz(r - 12)], 4.4 * b, .09), t0)
    poser(x, timbale(hz(r - 24 if r - 24 > 30 else r - 12), .32), t0)
    if m % 2 == 1: poser(x, timbale(hz(r - 24 if r - 24 > 30 else r - 12), .22), t0 + 3.5 * b)
    if m >= 1:
        for q in range(2): poser(x, epiano(hz(mel[(m * 2 + q) % 8]), 2 * b, .13), t0 + q * 2 * b)
ecrire('piste-04.mp3', finir(reverb(x, (0.05, 0.09, 0.13, 0.21), .45), D), .5, '96k', PL)

# 5. Je ne te regarde pas (je te regarde) : guitare timide, sol majeur, 96 bpm
D = 40; b = 60 / 96; x = piste(D)
prog = [(55, 'maj'), (52, 'min'), (48, 'maj'), (50, 'maj')]
mel = [79, None, 78, 76, None, 74, 76, None, 71, 72, 74, None, 76, None, 74, None]
for m in range(int(D / (4 * b))):
    r, ty = prog[m % 4]; t0 = m * 4 * b; nn = accord(r, ty)
    motif = [nn[0] - 12, nn[1], nn[2], nn[1] + 12, nn[2], nn[1], nn[2], nn[0] + 12]
    for q, n in enumerate(motif): poser(x, pluck(hz(n), 1.6, .16, .55), t0 + q * b / 2)
    if m >= 2:
        for q in range(4):
            v = mel[(m * 4 + q) % 16]
            if v: poser(x, epiano(hz(v), b * 1.4, .08), t0 + q * b)
ecrire('piste-05.mp3', finir(reverb(x), D), .45, '96k', PL)

# 6. Tuk-tuk de mon cœur : rebondissant, ré majeur, 132 bpm, klaxons de tuk-tuk
D = 38; b = 60 / 132; x = piste(D)
prog = [62, 67, 69, 62]
for m in range(int(D / (4 * b))):
    r = prog[m % 4]; t0 = m * 4 * b
    for q in range(8):
        poser(x, carre(hz(r - 24 + (12 if q % 2 else 0)), b * .45, .1, 9), t0 + q * b / 2)
        poser(x, charley(.04), t0 + q * b / 2)
    for q in range(4): poser(x, kick(.4), t0 + q * b)
    poser(x, caisse(.15), t0 + b); poser(x, caisse(.15), t0 + 3 * b)
    for q in (1.5, 3.5):
        for n in accord(r, 'maj'): poser(x, carre(hz(n), b * .4, .045, 12), t0 + q * b)
    if m % 4 == 3:
        for k in range(2): poser(x, carre(hz(81), .14, .09, 4) + carre(hz(85), .14, .05, 4), t0 + 2 * b + k * .2)
ecrire('piste-06.mp3', finir(reverb(x, dec=.2), D), .35, '96k', PL)

# 7. Sous mon parapluie : la chanson de la vidéo, boîte à musique et pluie
D = 45; x = piste(D)
n = len(x); bruit = rng.standard_normal(n)
spec = np.fft.rfft(bruit); f = np.fft.rfftfreq(n, 1 / SR)
pl = np.fft.irfft(spec * np.exp(-((np.log(f + 1) - np.log(2000)) ** 2) / 1.4), n)
x += .05 * pl / np.max(np.abs(pl))
mel = [72, 76, 79, 76, 74, 72, 69, 67]; b = 0.42
basses = [48, 45, 41, 43]
pos = 0.5
for rep in range(5):
    for i, nn in enumerate(mel):
        h = nn + (12 if rep == 3 else 0)
        poser(x, boite_a_musique(hz(h), 2.5 if i == 7 else 1.3, .26), pos + i * b)
        if i % 2 == 0: poser(x, boite_a_musique(hz(basses[(i // 2) % 4] + (rep % 2) * 0), 2.2, .12), pos + i * b)
    if rep >= 1: poser(x, nappe([hz(n) for n in (60, 64, 67)], 8 * b + 1, .05), pos)
    pos += 8 * b + (1.4 if rep % 2 else .6)
poser(x, boite_a_musique(hz(67), 5, .28), pos + .2)
ecrire('piste-07.mp3', finir(reverb(x), D), .4, '96k', PL)

# Même volume perçu pour toutes les pistes
for i in range(1, 8):
    f = os.path.join(PL, f'piste-{i:02d}.mp3'); tmp = f + '.tmp.mp3'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', f, '-af', 'loudnorm=I=-17:TP=-1.5:LRA=11', '-ar', '44100', '-codec:a', 'libmp3lame', '-b:a', '96k', tmp], check=True)
    os.replace(tmp, f)
print('Volumes harmonisés.')
