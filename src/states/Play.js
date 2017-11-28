import Phaser from 'phaser'

export default class extends Phaser.State {
  init() {
    this.totalGroundWidth = 0
  }

  makeGround() {
    const width = this.ground.length === 0 ? game.width * 2 : game.width * game.rnd.realInRange(.3, .7)
    const gap = this.ground.length === 0 ? 0 : game.width * game.rnd.realInRange(.2, .4)
    this.totalGroundWidth += gap
    const height = game.height * game.rnd.realInRange(.2, .4)
    const bmd = game.add.bitmapData(width, height)
    bmd.ctx.beginPath()
    bmd.ctx.rect(0, 0, width, height)
    bmd.ctx.fillStyle = game.rnd.pick(['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e', '#1abc9c'])
    bmd.ctx.fill()

    const ground = this.ground.create(this.totalGroundWidth, game.height - height, bmd)
    this.totalGroundWidth += width
    ground.body.velocity.x = -game.width * .5
    ground.body.immovable = true
    ground.checkWorldBounds = true
    ground.__gap = gap
    
    ground.events.onOutOfBounds.add((ground) => {
      if (ground.x < 0) {
        this.totalGroundWidth -= ground.width
        this.totalGroundWidth -= ground.__gap
        ground.destroy()
      }
    }, this)
  }

  create () {
    this.ground = game.add.group()
    this.ground.enableBody = true
    this.ground.physicsBodyType = Phaser.Physics.ARCADE

    this.ground

    const scaleFactor = (game.width * .2) / 80

    this.samurai = game.add.sprite(game.width * .1, game.height * .2, 'samurai')
    console.log(this.samurai.x)
    this.samurai.scale.setTo(scaleFactor, scaleFactor)
    this.samurai.smoothed = false

    this.jumping = true
    this.doublejump = true
    this.canAttack = true
    this.dead = false

    this.samurai.animations.add('run', [0, 1, 2, 3, 4, 5], 18, true)
    this.samurai.animations.add('attack', [7, 10, 11, 12, 13], 32)
    this.samurai.animations.add('doublejump', [16, 14], 10)

    game.physics.enable(this.samurai, Phaser.Physics.ARCADE)
    this.samurai.body.gravity.y = game.height * 2
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
    if (this.ground.length < 5) {
      this.makeGround()
    }

    game.physics.arcade.collide(this.samurai, this.ground, () => {
      if (this.samurai.x >= game.width * .1) {
        this.samurai.body.velocity.x = game.width * .5
      }

      if (this.samurai.body.velocity.y !== 0) {
        this.dead = true
        this.samurai.frame = 18
        game.input.onTap.removeAll()
        game.input.keyboard.stop()
        game.paused = true
      }

      if (this.jumping && !this.dead) {
        this.samurai.body.velocity.x = game.width * .52
        this.samurai.animations.play('run')
        this.jumping = false
        this.doublejump = true
        this.canAttack = true
      }
    })

    if (this.samurai.body.velocity.y > 0 && !this.dead) {
      this.samurai.frame = 15
      this.samurai.body.velocity.x = 0
    }

    if (this.samurai.y > game.height) {
      this.dead = true
      game.paused = true
    }

    document.getElementById('fps').innerHTML = game.time.fps
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
    this.samurai.body.velocity.y = -game.height * .7
    this.samurai.body.velocity.x = 0
    this.samurai.animations.stop()
  }
}
