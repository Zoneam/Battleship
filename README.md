# <p align="center" style="font-weight:700;"> [Play Battleship Game](https://battle-ships2.netlify.app) </p>
---

## Description

Battleship (also known as Battleships or Sea Battle) is a strategy type guessing game for two players. It is played on ruled grids on which each player's fleet of warships are marked. The locations of the fleets are concealed from the other player. Ship sizes are 1, 2, 2, 3, 4, 5.

## Technologies

This application uses [JavaScript](https://developer.mozilla.org/), [JQuery](https://api.jquery.com/), [Bootstrap](https://getbootstrap.com/) and [Animista](https://animista.net/).

## Table of Contents:

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation:

To run locally:

- Just open index.html and enjoy the game.
---

## User stories:

- As a user I want to open the page and be presented with 2 game boards.
- As a user I want to generate random game boards with button clicks.
- As a user I want to be able to choose my ships to be more horizontal or vertical.
- As a user I want to click start the button and start the game.
- As a user I want to click on the opponent's board and make the shot.
- As a user I want to see the shot positions with different color cells.
- As a user I want to see the opponent's damaged ship in yellow color.
- As a user I want to see opponents destroyed ship in red color.
- As a user I want to view statistics about the game (Ships killed, shot count).
- As a user I want to click on the new game button at any given time to restart the game.
- As a user I want to see winner when all opponents ships are destroyed.
- As a user I want to see opponents (AI) hidden ship positions when I lose the game.
---

## Usage:

* On the page you can generate your battleships randomly and choose the orientation.
* Click Start The Battle button and game will begin.
* Click on the boart to make the first shot.
* AI will play randomly until it finds a ship.
* After damaging a ship AI will start hitting all possible (4 if available) directions to find ship orientation (vertical or horizontal).
* After second successful hit AI will determine ship orientation and follow ship direction to destroy it.
* After destroying ship it will start hitting randomly to find another ship.
* After destroying opponents ships (total of 6) Game Over message will show up and winner will be announced.
* You can reset the game by pressing New Game button.
* Game is optimazed for desktop and mobile.

![Screenshot Desktop](./images/screenshot-desktop.png)

<p align="center">
  <img width="230" src="./images/screenshot-mobile.png">
</p>

## License:

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contributing:

Feel free to contact me to contribute to this project. My contact information is listed below.

## Questions:

## Contact me:  [<img src="./images/email.png" width="40" >](mailto:zoneam@gmail.com)  [<img src="./images/github.png" width="40" >](https://github.com/zoneam)
