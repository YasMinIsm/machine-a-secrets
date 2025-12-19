# Enigma - Simulateur de Chiffrement

Ce projet est une simulation de la machine Enigma. Il reproduit le fonctionnement mécanique et électrique utilisé pour sécuriser les communications durant la Seconde Guerre mondiale.

## Fonctionnalités principales

* Choix des rotors : Utilisation de 3 rotors parmi les 5 modèles historiques (I à V).
* Double-stepping : Reproduction du mouvement mécanique réel du rotor central.
* Ring Settings : Configuration du décalage des bagues internes.
* Plugboard : Système de connexion par câbles pour augmenter la complexité.
* Réflecteur B : Système permettant la réversibilité du message (chiffrer et déchiffrer avec les mêmes réglages).

## Mode d'emploi

1. Configuration : Choisir l'ordre des rotors et régler la valeur des anneaux (Ring).
2. Initialisation : Choisir la lettre de départ pour chaque rotor (ex: A-B-C).
3. Connexions : Ajouter des paires de lettres dans le Plugboard (ex: AZ BK).
4. Utilisation : Saisir le texte. Les rotors tournent visuellement à chaque lettre tapée.
5. Décodage : Pour retrouver le texte original, utiliser la machine avec les réglages strictement identiques à ceux utilisés pour le chiffrement.

## Organisation du code

Le projet se compose de trois fichiers :

* index.html : Interface utilisateur simplifiée.
* style.css : Mise en page et animation des tambours.
* enigma.js : Logique de chiffrement.
    * advance() : Gère la rotation mécanique des rotors.
    * signalPath() : Calcule le trajet du signal électrique et les substitutions.
    * crypt() : Fonction principale traitant le texte caractère par caractère.

## Contexte

La sécurité d'Enigma reposait sur son nombre de combinaisons (environ 158 trillions). Sa complexité a mené à la création des premiers calculateurs électromécaniques par Alan Turing et son équipe à Bletchley Park.

**Réalisé par :** Yasmin Ismayil
**Formation :** MIAGE M2 - Université Paris Cité
**Note :** Ce projet est réalisé dans un cadre pédagogique pour comprendre les bases de la cryptographie symétrique.
Note : Ce projet est réalisé dans un cadre pédagogique pour comprendre les bases de la cryptographie symétrique.

