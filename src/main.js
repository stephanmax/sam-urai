import 'pixi'
import 'p2'
import Phaser from 'phaser'

import Boot from './states/Boot'
import Title from './states/Title'
import Play from './states/Play'
import End from './states/End'

class MyGame extends Phaser.Game {
  constructor () {
    super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS)

    this.state.add('Boot', Boot, false)
    this.state.add('Title', Title, false)
    this.state.add('Play', Play, false)
    this.state.add('End', End, false)

    this.state.start('Boot')
  }
}

window.game = new MyGame()
