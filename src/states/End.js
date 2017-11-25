import Phaser from 'phaser'

export default class extends Phaser.State {
  init(score) {
    this.score = score
  }

  create () {
    let scoreText = game.add.text(game.world.centerX + 60, game.world.centerY, this.score, {font: "180px 'Helvetica Neue'", fill: "rgba(255, 255, 255, 1)", align: "center"})
    scoreText.anchor.set(0.5)

    let replayText = game.add.text(game.world.centerX - 180, game.world.centerY, "REPLAY", {font: "32px 'Helvetica Neue'", fill: "rgba(0, 255, 0, 1)", align: "center"})
    replayText.anchor.set(0.5)

    game.add.tween(scoreText).from({alpha: 0.15}, 2000, Phaser.Easing.Linear.In, true)
    game.add.tween(replayText).from({alpha: 0}, 1000, Phaser.Easing.Linear.In, true, 2000)

    replayText.inputEnabled = true
    replayText.events.onInputUp.add(() => {
      game.state.start('Play')
    }, this)
  }
}
