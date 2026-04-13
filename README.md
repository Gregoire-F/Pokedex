# Pokedex
Pokedex Front-End.

Créer une application web Pokedex permettant aux utilisateurs de parcourir, rechercher et consulter les détails des Pokémon, en utilisant l’API REST publique PokéAPI. 

Technologies utilisées : HTML, CSS, JavaScript. Figma pour les maquettes. Éditeur de code : VSCode

Lancement de l'application : Se rendre dans la barre de recherche et y intégrer l'URL : [pagegithubici.io](https://gregoire-f.github.io/Pokedex/)

Le déploiement du site s'est fait par GitHub Pages qui permet de visualiser et de se servir le site avec toutes ses fonctionnalités. 

Les fonctionnalités sont les suivantes : 

- Rechercher un pokemon dans la barre de recherche du site. Même partiellement tapé la recherche permettra de visualiser les Pokemons contenant les caractères tapés dans la barre de recherche. 
(Pas de "#" dans la recherche ni le numéro de pokémon associé ni un nom partiellement tapé).
- Pouvoir consulter en détails les Pokemons en cliquant sur la carte du Pokemon. 
- Naviguer au clavier si nécessaire est possible.

Dans les détails du Pokemon, on retrouve :

- le nom 
- l'image de face et de dos
- son type 
- ses statististiques 
- ses capacités spéciales 
- sa chaîne d'évolution. 

Le clic sur une évolution emmène vers la carte du pokemon évolué.

*** Déroulement du projet ***

Les difficultés rencontrées : 

1) Savoir où démarrer en JS
Après avoir construit les fichiers de base html css et js, il fallait démarrer à structurer le JS. J'ai donc démarré avec la déclaration de l'API de base et réfléchi aux fonctions nécessaires pour le chargement des Pokemons. 

-> Solution : 

S'aider en regardant ce qui était demandé dans les consignes et commencer à savoir quelles seraient mes functions futures tel que charger la page d'accueil avec la grille des cards de Pokemon. Puis les Pokemons au detail grâce au système de card. J'ai aussi fait des recherches pour connaître les meilleurs façons de présenter la grid 

2) Savoir rendre le site accessible 
Grâce à mon expérience en entreprise très axé accessibilité sur les sites développés j'avais des outils comme Wave en extension de mon navigateur qui m'a permis d'ajuster les contrastes de mes textes et background-color. J'ai également cherché à rendre mon site navigable au clavier avec TAB et Entrée lorsque c'était nécessaire.

