import Phaser from 'phaser'

export default class extends Phaser.State {
  init() {
    
  }

  create () {
    var bmd = game.add.bitmapData(game.width, game.height * .3)
    bmd.ctx.beginPath()
    bmd.ctx.rect(0, 0, game.width, game.height * .3)
    bmd.ctx.fillStyle = '#c88fe4'
    bmd.ctx.fill()
    
    this.ground = game.add.sprite(0, game.height * .7, bmd)
    
    game.physics.enable(this.ground, Phaser.Physics.ARCADE)
    this.ground.body.immovable = true    

    this.samurai = game.add.sprite(game.width * .1, game.height * .7 - 58, 'samurai')
    this.samurai.smoothed = false

    this.jumping = false
    this.doublejump = true
    this.canAttack = true

    this.samurai.animations.add('run', [0, 1, 2, 3, 4, 5], 18, true)
    this.samurai.animations.add('attack', [7, 10, 11, 12, 13], 32)
    this.samurai.animations.add('doublejump', [16, 14], 10)

    game.physics.enable(this.samurai, Phaser.Physics.ARCADE)
    this.samurai.body.gravity.y = 500
    this.samurai.body.setSize(50, 50, 0, 0)

    this.attackBtn = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.attackBtn.onDown.add(this.attack, this)

    this.jumpBtn = game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.jumpBtn.onDown.add(this.jump, this)

    game.input.onTap.add(() => {
      if (game.input.x <= game.width / 2) {
        this.jump()
      }
      else {
        this.attack()
      }
    }, this)

    this.samurai.animations.play('run')
  }

  update() {
    game.physics.arcade.collide(this.samurai, this.ground, () => {
      if (this.jumping) {
        this.samurai.animations.play('run')
        this.jumping = false
        this.doublejump = true
        this.canAttack = true
      }
    })

    if (this.samurai.body.velocity.y > 0) {
      this.samurai.frame = 15
    }
  }

  attack() {
    if (this.canAttack) {
      this.samurai.body.setSize(70, 50, 0, 0)
      this.samurai.animations.play('attack')
      this.samurai.animations.currentAnim.onComplete.add(() => {
        this.samurai.body.setSize(50, 50, 0, 0)
        this.samurai.animations.play('run')
      })
    }
  }

  jump() {
    if (!this.doublejump) {
      return
    }
    if (this.jumping) {
      this.samurai.frame = 14
      this.doublejump = false
    }
    if (!this.jumping) {
      this.samurai.frame = 17
      this.canAttack = false
    }
    this.jumping = true
    this.samurai.body.velocity.y = -250
    this.samurai.animations.stop()
  }

  render() {
    game.debug.text(game.time.fps, game.width-25, 15, '#00ff00')
  }
}
