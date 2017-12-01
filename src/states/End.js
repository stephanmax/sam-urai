import Phaser from 'phaser'

export default class extends Phaser.State {
  init(score) {
    this.score = score
    this.best = localStorage.getItem('__highscore')

    if (this.score > this.best) {
      localStorage.setItem('__highscore', this.score)
      this.best = this.score
    }
  }
  
  create () {
    const textStyle = {
      font: '20vw -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fille: '#333',
      align: 'center'
    }

    const gameOver = game.add.text(game.world.centerX, game.world.centerY * .5, 'Game Over', textStyle)
    gameOver.anchor.set(.5)

    textStyle.font = '8vw -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
    
    const yourScore = game.add.text(game.world.centerX * .5, game.world.centerY * 1.2, `Your score: ${this.score}`, textStyle)
    yourScore.anchor.set(.5)

    const highScore = game.add.text(game.world.centerX * 1.5, game.world.centerY * 1.2, `Best score: ${this.best}`, textStyle)
    highScore.anchor.set(.5)

    textStyle.fill = game.rnd.pick(['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e', '#1abc9c'])

    const replay = game.add.text(game.world.centerX, game.world.centerY * 1.75, `REPLAY`, textStyle)
    replay.anchor.set(.5)

    replay.inputEnabled = true

    replay.events.onInputOver.add(() => {
      game.canvas.style.cursor = 'pointer'
    }, this)
      
    replay.events.onInputOut.add(() => {
      game.canvas.style.cursor = 'default'
    }, this)

    replay.events.onInputUp.add(() => {
      game.state.start('Play')
    }, this)
  }
}
