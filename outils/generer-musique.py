"""
Génère les musiques et bruitages par défaut du thème (theme/musique/*.mp3).

Usage :  python3 outils/generer-musique.py
Nécessite Python 3 avec numpy, et ffmpeg pour l'encodage en MP3.
Attention : cette commande écrase les .mp3 de theme/musique portant les mêmes noms.
"""
import os, subprocess, tempfile, wave
import numpy as np

SR = 44100
ICI = os.path.dirname(os.path.abspath(__file__))
DOSSIER = os.path.join(ICI, '..', 'theme', 'musique')
os.makedirs(DOSSIER, exist_ok=True)
rng = np.random.default_rng(7)

def hz(n):  # numéro MIDI -> fréquence
    return 440.0 * 2 ** ((n - 69) / 12)

def boite_a_musique(f, dur, vol=0.3):
    """Note de boîte à musique : sinus + harmoniques, attaque nette, extinction douce."""
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t * 3.2) * np.minimum(1, t * 400)
    s = (np.sin(2*np.pi*f*t) + .35*np.sin(2*np.pi*2*f*t)*np.exp(-t*6) + .12*np.sin(2*np.pi*3.01*f*t)*np.exp(-t*9))
    return vol * env * s

def nappe(freqs, dur, vol=0.05):
    """Accord tenu, doux (pour le fond)."""
    t = np.arange(int(dur * SR)) / SR
    env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
    s = sum(np.sin(2*np.pi*f*t + i) + .3*np.sin(2*np.pi*f*1.003*t) for i, f in enumerate(freqs))
    return vol * env * s / len(freqs)

def poser(piste, son, debut):
    i = int(debut * SR); j = min(len(piste), i + len(son))
    piste[i:j] += son[:j - i]

def boucle(piste, longueur):
    """Replie la fin sur le début pour une boucle sans coupure."""
    n = int(longueur * SR); res = piste[:n].copy(); reste = piste[n:]
    res[:len(reste)] += reste
    return res

def reverb(x, delais=(0.031, 0.047, 0.071, 0.113), dec=0.35):
    y = x.copy()
    for k, d in enumerate(delais):
        n = int(d * SR); g = dec ** (k + 1)
        y[n:] += g * x[:-n]
    return y

def ecrire(nom, x, stereo_largeur=0.0, debit='112k'):
    x = x / max(1e-9, np.max(np.abs(x))) * 0.89 if np.max(np.abs(x)) > 0.89 else x
    if stereo_largeur:
        d = int(0.012 * SR); r = np.concatenate([np.zeros(d), x[:-d]])
        st = np.stack([x, (1 - stereo_largeur) * x + stereo_largeur * r], 1)
    else:
        st = np.stack([x, x], 1)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        w = wave.open(tmp.name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()
        dest = os.path.join(DOSSIER, nom)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp.name, '-codec:a', 'libmp3lame', '-b:a', debit, dest], check=True)
    os.unlink(tmp.name)
    print(f'{nom:28s} {len(x)/SR:5.1f} s  {os.path.getsize(dest)//1024} Ko')

# 1. Musique de fond : boîte à musique tendre, Fa majeur (I - vi - IV - V), 32 s en boucle
tempo = 0.5  # une croche = 0,5 s / 2
progression = [(65, [53, 57, 60]), (62, [50, 53, 57]), (58, [46, 50, 53]), (60, [48, 52, 55])] * 2
motifs = [[0, 4, 7, 12, 7, 4, 7, 4], [0, 3, 7, 12, 10, 7, 3, 7], [0, 4, 7, 9, 12, 9, 7, 4], [0, 4, 7, 11, 12, 7, 4, 2]]
L = 32.0
fond = np.zeros(int((L + 4) * SR))
for m, (basse, accord) in enumerate(progression):
    t0 = m * 4.0
    poser(fond, nappe([hz(n) for n in accord], 4.6, 0.045), t0)
    poser(fond, boite_a_musique(hz(basse - 12), 3.5, 0.10), t0)
    racine_ = accord[0] + 12
    for k, iv in enumerate(motifs[m % 4]):
        if m >= 4 and k % 2 == 1:  # seconde moitié : un peu de mélodie au-dessus
            iv += 12
        poser(fond, boite_a_musique(hz(racine_ + iv), 1.6, 0.11 if k % 2 == 0 else 0.08), t0 + k * tempo)
fond = boucle(reverb(fond), L)
ecrire('fond.mp3', fond, stereo_largeur=0.35, debit='96k')

# 2. Pluie : bruit filtré + gouttes, 12 s en boucle
L = 12.0
n = int((L + 1) * SR)
bruit = rng.standard_normal(n)
spec = np.fft.rfft(bruit); f = np.fft.rfftfreq(n, 1 / SR)
forme = np.exp(-((np.log(f + 1) - np.log(1800)) ** 2) / 1.6) + 0.25 * np.exp(-((np.log(f + 1) - np.log(5200)) ** 2) / 0.6)
pluie = np.fft.irfft(spec * forme, n)
pluie /= np.max(np.abs(pluie)); pluie *= 0.35
for _ in range(260):
    d = rng.uniform(0, L + 0.8); fr = rng.uniform(2500, 6000); du = 0.025
    t = np.arange(int(du * SR)) / SR
    poser(pluie, rng.uniform(.04, .12) * np.sin(2*np.pi*fr*t*(1 - t*8)) * np.exp(-t * 160), d)
ecrire('pluie.mp3', boucle(pluie, L), stereo_largeur=0.6, debit='96k')

# 3. « Sous mon parapluie » : la chanson de la vidéo (son motif et sa dernière note)
mel = [72, 76, 79, 76, 74, 72, 69, 67]
ch = np.zeros(int(7 * SR))
for i, nn in enumerate(mel):
    poser(ch, boite_a_musique(hz(nn), 3.0 if i == 7 else 1.2, 0.3), 0.1 + i * 0.42)
    if i % 2 == 0:
        poser(ch, boite_a_musique(hz(nn - 24), 1.8, 0.12), 0.1 + i * 0.42)
ecrire('sous-mon-parapluie.mp3', reverb(ch), stereo_largeur=0.3)

# 4. Bruitages
def suite(notes, ecart, dur, vol, total):
    x = np.zeros(int(total * SR))
    for i, nn in enumerate(notes):
        poser(x, boite_a_musique(hz(nn), dur, vol), 0.01 + i * ecart)
    return reverb(x)
ecrire('bonne-reponse.mp3', suite([76, 81, 84], 0.11, 0.9, 0.3, 1.4))
x = np.zeros(int(0.8 * SR)); t = np.arange(int(0.5 * SR)) / SR
for i, fr in enumerate([233, 196]):
    poser(x, 0.25 * np.sin(2*np.pi*fr*t) * np.exp(-t * 7) * np.minimum(1, t * 300), i * 0.13)
ecrire('mauvaise-reponse.mp3', x)
ecrire('message.mp3', suite([93], 0, 0.25, 0.18, 0.4))
ecrire('fouille.mp3', suite([88, 91], 0.07, 0.4, 0.18, 0.6))
x = np.zeros(int(0.5 * SR)); t = np.arange(int(0.35 * SR)) / SR
gratte = rng.standard_normal(len(t)) * np.exp(-((t - .15) ** 2) / .004) * 0.12
poser(x, gratte, 0.02)
ecrire('trait.mp3', x)
ecrire('victoire.mp3', suite([72, 76, 79, 84, 88, 91], 0.09, 1.8, 0.22, 2.8), stereo_largeur=0.3)
