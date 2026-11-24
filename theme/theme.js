/* ==========================================================================
   THÈME DU JEU
   Tout ce qui se voit et s'entend est réglé ici. L'histoire et les énigmes
   sont dans le dossier jeu/ et ne dépendent pas de ce fichier.

   Changer une image :
     - le plus simple : remplace le fichier par le tien, avec le même nom ;
     - ou écris ici le chemin de ton fichier (.png, .jpg, .webp, .gif ou .svg).
   Changer une musique ou un son : même principe, avec un fichier .mp3.
   Mettre null : aucun fichier (pour les sons, le jeu joue alors un son de secours).

   Les chemins partent du dossier où se trouve index.html.
   Les couleurs et les polices de l'interface sont dans theme/couleurs.css.
   ========================================================================== */
window.THEME = {

  /* ---------- Personnages ----------
     Six expressions par personnage. Une image portrait (en hauteur) avec un fond
     transparent rend le mieux, par exemple 600 × 720 px en PNG.
     « couleur » colore l'étiquette du prénom et les messages du téléphone. */
  personnages: {
    kinnat: {
      couleur: '#9fd3e6',
      expressions: {
        neutre:  'theme/personnages/kinnat/neutre.png',
        rire:    'theme/personnages/kinnat/rire.png',
        surpris: 'theme/personnages/kinnat/surpris.png',
        timide:  'theme/personnages/kinnat/timide.png',
        agace:   'theme/personnages/kinnat/agace.png',
        emu:     'theme/personnages/kinnat/emu.png'
      }
    },
    rayn: {
      couleur: '#f4c430',
      expressions: {
        neutre:  'theme/personnages/rayn/neutre.png',
        rire:    'theme/personnages/rayn/rire.png',
        surpris: 'theme/personnages/rayn/surpris.png',
        timide:  'theme/personnages/rayn/timide.png',
        agace:   'theme/personnages/rayn/agace.png',
        emu:     'theme/personnages/rayn/emu.png'
      }
    },
    vega: {
      couleur: '#c3b4e8',
      expressions: {
        neutre:  'theme/personnages/vega/neutre.png',
        rire:    'theme/personnages/vega/rire.png',
        surpris: 'theme/personnages/vega/surpris.png',
        timide:  'theme/personnages/vega/timide.png',
        agace:   'theme/personnages/vega/agace.png',
        emu:     'theme/personnages/vega/emu.png'
      }
    },
    ayaan: {
      couleur: '#f3a6a2',
      expressions: {
        neutre:  'theme/personnages/ayaan/neutre.png',
        rire:    'theme/personnages/ayaan/rire.png',
        surpris: 'theme/personnages/ayaan/surpris.png',
        timide:  'theme/personnages/ayaan/timide.png',
        agace:   'theme/personnages/ayaan/agace.png',
        emu:     'theme/personnages/ayaan/emu.png'
      }
    },
    sarawin: {
      couleur: '#86b86b',
      expressions: {
        neutre:  'theme/personnages/sarawin/neutre.png',
        rire:    'theme/personnages/sarawin/rire.png',
        surpris: 'theme/personnages/sarawin/surpris.png',
        timide:  'theme/personnages/sarawin/timide.png',
        agace:   'theme/personnages/sarawin/agace.png',
        emu:     'theme/personnages/sarawin/emu.png'
      }
    },
    tinn: {
      couleur: '#f2b77a',
      expressions: {
        neutre:  'theme/personnages/tinn/neutre.png',
        rire:    'theme/personnages/tinn/rire.png',
        surpris: 'theme/personnages/tinn/surpris.png',
        timide:  'theme/personnages/tinn/timide.png',
        agace:   'theme/personnages/tinn/agace.png',
        emu:     'theme/personnages/tinn/emu.png'
      }
    }
  },

  /* ---------- Décors ----------
     Images plein écran, recadrées automatiquement pour remplir l'écran.
     Format conseillé : paysage 16:9, par exemple 1920 × 1080 px.
     Garde le sujet important vers le centre : sur téléphone, les côtés sont coupés. */
  decors: {
    ville:          'theme/decors/ville.svg',          // écran titre
    salon:          'theme/decors/salon.png',          // la soirée, de nuit
    salon_jour:     'theme/decors/salon-jour.png',     // le lendemain
    cuisine:        'theme/decors/cuisine.png',
    entree:         'theme/decors/entree.svg',
    escalier:       'theme/decors/escalier.svg',
    escalier_orage: 'theme/decors/escalier-orage.svg', // le souvenir de juillet
    magasin:        'theme/decors/magasin.svg'
  },

  /* ---------- Pluie animée ---------- */
  pluie: { couleur: 'rgba(150,112,196,.36)', gouttes: 340 },

  /* ---------- Fouilles ----------
     L'image à fouiller et les zones où l'on peut toucher.
     Chaque zone est un rectangle en pourcentage de l'image :
     x et y = coin en haut à gauche, l = largeur, h = hauteur.
     Si tu changes l'image, ajuste les zones pour qu'elles tombent sur les poches et les objets. */
  fouilles: {
    manteau: {
      image: 'theme/fouilles/impermeable.svg',
      zones: {
        gauche:    { x: 26.5,  y: 57.5,  l: 20.75, h: 26.1 },
        droite:    { x: 52.75, y: 57.5,  l: 20.75, h: 26.1 },
        interieur: { x: 51.5,  y: 25.4,  l: 14,    h: 15.4 }
      }
    },
    marches: {
      image: 'theme/fouilles/escalier.svg',
      zones: {
        seau:    { x: 6.25,  y: 75.8, l: 13.25, h: 21.2 },
        carton:  { x: 75,    y: 71.9, l: 19.25, h: 23.5 },
        gamelle: { x: 41.25, y: 86.9, l: 17.5,  h: 10.8 }
      }
    }
  },

  /* ---------- Illustrations des cartes de la révélation ---------- */
  illustrations: {
    chaton: 'theme/illustrations/chaton.svg',       // la photo de Khao Niao
    carnet: 'theme/illustrations/carnet-ayaan.svg'  // la page des paris d'Ayaan
  },

  /* ---------- Vidéo de KN-01 et scène du baiser ----------
     Par défaut, chaque scène est faite de quatre calques de même taille (16:9) :
     le fond, la silhouette de gauche, celle de droite, et la main posée sur la joue.
     Les deux silhouettes glissent l'une vers l'autre, puis la main apparaît.
     Tu peux aussi remplacer la scène par une vraie vidéo : indique un fichier .mp4 dans « fichier ». */
  video: {
    nuit: {
      fichier: 'theme/video/BaiserVole.mp4',
      fond:   'theme/video/nuit-fond.svg',
      gauche: 'theme/video/nuit-gauche.svg',
      droite: 'theme/video/nuit-droite.svg',
      main:   'theme/video/nuit-main.svg'
    },
    baiser: {
      fichier: 'theme/video/BaiserVole.mp4',
      fond:   'theme/video/baiser-fond.svg',
      gauche: 'theme/video/baiser-gauche.svg',
      droite: 'theme/video/baiser-droite.svg',
      main:   'theme/video/baiser-main.svg'
    }
  },

  /* ---------- Playlist d'Ayaan (le lecteur de musique du jeu) ----------
     Dépose tes chansons dans le dossier ci-dessous, avec des noms numérotés :
       piste-01.mp3  Day Dreaming
       piste-02.mp3  Take this moment
       piste-03.mp3  Bruit du riz qui cuit (version longue)
       piste-04.mp3  Drame sur Sukhumvit
       piste-05.mp3  Je ne te regarde pas (je te regarde)
       piste-06.mp3  Tuk-tuk de mon cœur
       piste-07.mp3  Sous mon parapluie
     Tu peux en ajouter d'autres à la suite (piste-08.mp3, piste-09.mp3…) :
     elles apparaissent toutes seules dans le lecteur, sans rien modifier ici.
     Pour leur donner un titre, remplis « titres » (sinon elles s'appellent « Piste 8 »…).
     Les titres des sept premières viennent de l'histoire (énigme 1). */
  playlist: {
    dossier: 'theme/musique/playlist/',
    prefixe: 'piste-',
    extension: '.mp3',
    volume: 0.85,
    titres: {
      // 8: 'Ma chanson préférée',
    }
  },

  /* ---------- Musique et sons ----------
     Le son démarre quand on clique sur « Ouvrir l'enquête » (les navigateurs
     interdisent le son avant un premier geste). */
  musique: {
    volumes: { general: 1, fond: 0.5, pluie: 0.45, chanson: 0.9, effets: 0.8 },

    // Musique de fond en boucle. « defaut » sert partout ; tu peux en mettre
    // une différente par décor (mêmes noms que dans « decors »), par exemple :
    // escalier: 'theme/musique/escalier.mp3'
    fond: {
      defaut: 'theme/musique/fond.mp3'
    },

    // Bruit de pluie en boucle. Son volume suit l'intensité de la pluie à l'écran.
    pluie: 'theme/musique/pluie.mp3',

    // « Sous mon parapluie », la chanson qu'on entend dans la vidéo et au moment du baiser.
    // La musique de fond baisse pendant qu'elle joue.
    chanson: 'theme/musique/sous-mon-parapluie.mp3',

    // Bruitages courts
    sons: {
      bonneReponse:    'theme/musique/bonne-reponse.mp3',
      mauvaiseReponse: 'theme/musique/mauvaise-reponse.mp3',
      message:         'theme/musique/message.mp3',   // message reçu sur le téléphone
      fouille:         'theme/musique/fouille.mp3',   // objet trouvé
      trait:           'theme/musique/trait.mp3',     // prénom barré
      victoire:        'theme/musique/victoire.mp3'   // énigme résolue, fin du jeu
    }
  }
};
