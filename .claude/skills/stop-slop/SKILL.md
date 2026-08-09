---
name: stop-slop
description: >-
  Anti-slop / anti-tics IA. À invoquer pour tout texte destiné à être lu par un
  humain — rédaction en français (posts, mails, docs, README, messages) ET
  artefacts de code (messages de commit, descriptions de PR, commentaires).
  Bannit les formules creuses typiques des IA, la ponctuation-tic et les
  structures rhétoriques automatiques, pour un rendu naturel et direct.
  Utiliser quand on demande d'écrire, réécrire, « humaniser », « rendre moins
  IA », dé-sloper, ou nettoyer un texte, un commit ou une PR.
---

# Stop Slop — écriture sans tics IA

Objectif : produire du texte qui **dit quelque chose**, sans les réflexes
d'écriture des modèles. Un lecteur ne doit pas pouvoir pointer une phrase et
dire « ça, c'est de l'IA ». On ne cache rien de malhonnête — on écrit juste
mieux : concis, concret, assumé.

## Règle d'or

Chaque phrase doit apporter une information ou une opinion. Si une phrase peut
être supprimée sans perte de sens, elle est du slop → supprime-la.

## À bannir — rédaction (FR)

**Formules d'ouverture / de liaison creuses**
- « En effet, … », « Il est essentiel/important/crucial de … »
- « Il convient de noter que … », « Force est de constater que … »
- « Dans un monde où … », « À l'ère du numérique … »
- « joue un rôle crucial/central/clé », « est un pilier de … »
- « que ce soit … ou … », « à la croisée de … »

**Conclusions vides**
- « En conclusion / Pour résumer / En somme, … » suivi d'un résumé sans idée neuve
- « N'hésitez pas à … », « En espérant que … »
- La phrase finale qui « ouvre des perspectives » sans rien dire

**Structures rhétoriques automatiques**
- « Ce n'est pas seulement X, c'est Y. » (antithèse creuse)
- « Non pas parce que… mais parce que… » à répétition
- Triades systématiques : « rapide, efficace et intuitif »
- Rhétorique en questions : « Alors, comment faire ? La réponse est simple. »

**Sur-qualification / hedging**
- « il est important de souligner », « on peut raisonnablement penser »
- « globalement », « dans une certaine mesure », « pour ainsi dire »

**Ponctuation-tic**
- Tiret cadratin `—` utilisé comme respiration dramatique → préférer virgule,
  parenthèse, point, ou deux-points. (Le `—` reste OK dans une vraie incise.)
- Emojis décoratifs en début de puce, gras sur chaque mot-clé, « ✨/🚀/🔥 » de remplissage.

## À bannir — anglais (si le texte est en anglais)

- « It's not just X, it's Y », « In today's fast-paced world »
- « delve », « leverage », « seamless », « robust », « game-changer »
- « It's important to note that », « Let's dive in », « In conclusion »
- « Whether you're a … or a … », « the world of … »

## À bannir — code, commits, PR

- Commits : pas de « This commit … », pas de « In this change we … ».
  → Impératif, direct : « Add retry on push », « Fix null hand parsing ».
- Pas de résumé qui paraphrase le diff ligne à ligne. Dire le **pourquoi** si
  non évident, sinon rester bref.
- Commentaires de code : expliquer l'intention non évidente, pas re-décrire ce
  que le code fait déjà. Supprimer « // On incrémente i » et compagnie.
- Descriptions de PR : ce qui change, pourquoi, comment le vérifier. Pas de
  paragraphe d'intro cérémonieux.

## À faire à la place

- **Verbes forts, sujets concrets.** « Ça plante quand X » > « une erreur peut
  survenir dans certaines situations ».
- **Chiffres et exemples** plutôt qu'adjectifs. « 8 min » > « bien plus rapide ».
- **Assume une position.** Une recommandation claire > un survol équilibré.
- **Varie la longueur des phrases.** Une courte après deux longues. Du rythme.
- **Coupe.** Vise -30 % de mots à la relecture.

## Passe de contrôle (obligatoire avant de rendre)

Relis le texte produit et vérifie, ligne par ligne :
1. Zéro formule de la liste « À bannir » (FR/EN selon la langue). Si présente → réécris.
2. Chaque paragraphe a une idée. Sinon → fusionne ou supprime.
3. Aucun `—` dramatique ; ponctuation justifiée.
4. La dernière phrase apporte quelque chose (pas un résumé creux).
5. Si c'est un commit/PR : ton impératif, factuel, pas de remplissage.

Si un point échoue, corrige avant de livrer — ne rends jamais un texte qui n'a
pas passé cette relecture.

## Note d'honnêteté

Ce skill améliore le style ; il ne rend rien « garanti indétectable » et ne sert
pas à faire passer un texte pour ce qu'il n'est pas. C'est un guide de qualité
d'écriture, pas un outil de tromperie.
