"""Outils de synthèse audio partagés par generer-musique.py et generer-playlist.py."""
import os, subprocess, tempfile, wave
import numpy as np

SR = 44100
ICI = os.path.dirname(os.path.abspath(__file__))
DOSSIER = os.path.join(ICI, '..', 'theme', 'musique')
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

def ecrire(nom, x, stereo_largeur=0.0, debit='112k', dossier=None):
    x = x / max(1e-9, np.max(np.abs(x))) * 0.89 if np.max(np.abs(x)) > 0.89 else x
    if stereo_largeur:
        d = int(0.012 * SR); r = np.concatenate([np.zeros(d), x[:-d]])
        st = np.stack([x, (1 - stereo_largeur) * x + stereo_largeur * r], 1)
    else:
        st = np.stack([x, x], 1)
    with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
        w = wave.open(tmp.name, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes()); w.close()
        dest = os.path.join(dossier or DOSSIER, nom); os.makedirs(os.path.dirname(dest), exist_ok=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', tmp.name, '-codec:a', 'libmp3lame', '-b:a', debit, dest], check=True)
    os.unlink(tmp.name)
    print(f'{nom:28s} {len(x)/SR:5.1f} s  {os.path.getsize(dest)//1024} Ko')

