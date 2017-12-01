import Phaser from 'phaser'

export default class extends Phaser.State {
  create () {
    const bmd = game.add.bitmapData(game.width, game.height)
    bmd.ctx.beginPath()
    bmd.ctx.lineWidth = '1'
    bmd.ctx.strokeStyle = 'black'
    bmd.ctx.setLineDash([10, 15])
    bmd.ctx.moveTo(game.width / 2, 0)
    bmd.ctx.lineTo(game.width / 2, game.height)
    bmd.ctx.stroke()
    bmd.ctx.closePath()
    
    game.add.sprite(0, 0, bmd)

    const textStyle = {
      font: '20vw -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fille: '#333',
      align: 'center'
    }

    const title = game.add.text(game.world.centerX, game.world.centerY * .5, 'Sam-urai', textStyle)
    title.anchor.set(.5)

    textStyle.font = '8vw -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'

    const instructionsLeft = game.add.text(game.world.centerX * .5, game.world.centerY * 1.5, 'Tap left/press up\nto (double) jump', textStyle)
    instructionsLeft.anchor.set(.5)

    const instructionsRight = game.add.text(game.world.centerX * 1.5, game.world.centerY * 1.5, 'Tap right/press space\nto (stomp) attack', textStyle)
    instructionsRight.anchor.set(.5)

    game.input.onDown.add((pointer) => {
      game.state.start('Play')
    }, this)
  }
}
