import Phaser from 'phaser'

export default class extends Phaser.State {
  create () {
    let title = game.add.sprite(game.world.centerX, game.world.centerY, 'title')
    title.anchor.set(0.5)

    game.input.onDown.add((pointer) => {
      if (pointer.x >= game.world.centerX / 2) {
        game.state.start('Play')
      }
      else {
        game.state.start('Tutorial')
      }
    }, this)
  }
}
