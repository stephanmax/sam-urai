import Phaser from 'phaser'

export default class extends Phaser.State {
  init() {
    this.totalGroundWidth = 0
    this.scaleFactor = (game.width * .2) / 80
    this.VELOCITY_X = game.width * -.6

    this.jumps = 1
    this.attacking = false
    this.dead = false

    this.fireballSpawnY = game.height * .3

    this.timers = []
    this.level = 1

    this.score = 0
  }

  makeGround() {
    const width = this.ground.length === 0 ? game.width * 2 : game.width * game.rnd.pick([.2, .4, .6, .6, 1, 1, 1, 1.2, 1.2, 1.4])
    const gap = this.ground.length === 0 ? 0 : game.width * game.rnd.pick([.1, .2, .3])
    this.totalGroundWidth += gap
    const height = this.ground.length === 0 ? game.height * .3 : game.height * game.rnd.pick([.3, .35, .4, .45])
    const bmd = game.add.bitmapData(width, height)
    bmd.ctx.beginPath()
    bmd.ctx.rect(0, 0, width, height)
    bmd.ctx.fillStyle = game.rnd.pick(['#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#34495e', '#1abc9c'])
    bmd.ctx.fill()

    const ground = this.ground.create(this.totalGroundWidth, 1.1 * game.height - height, bmd)
    this.totalGroundWidth += width
    ground.body.velocity.x = this.VELOCITY_X
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

    ground.events.onEnterBounds.add((ground) => {
      this.fireballSpawnY = ground.y - this.samurai.height * .5
    }, this)
  }

  makeFireball() {
    const fireball = this.fireballs.getFirstExists(false)
    if (fireball && !this.dead) {
      fireball.reset(game.width, game.height * game.rnd.pick([.7, .65, .6, .55, .5, .45]))
      if (game.rnd.realInRange(0, Math.max(.6, 1.6 - this.game.time.totalElapsedSeconds() / 100)) < .3) {
        fireball.scale.setTo(this.scaleFactor * 1.2, this.scaleFactor * 1.2)
        fireball.tint = 0xff6666
        fireball.__notouching = true
      }
      else {
        fireball.scale.setTo(this.scaleFactor, this.scaleFactor)
        fireball.tint = 0xffffff
        fireball.__notouching = false
      }
      fireball.body.velocity.x = this.VELOCITY_X * game.rnd.realInRange(1.2, 1.5)
      fireball.checkWorldBounds = true
      fireball.events.onOutOfBounds.add((fireball) => {
        if (fireball.x < 0 || (fireball.x > game.width && fireball.__hit)) {
          fireball.kill()
          fireball.__hit = false
        }
      }, this)
    }
  }

  create () {
    this.ground = game.add.group()
    this.ground.enableBody = true
    this.ground.physicsBodyType = Phaser.Physics.ARCADE

    this.fireballs = game.add.group()
    this.fireballs.enableBody = true
    this.fireballs.physicsBodyType = Phaser.Physics.ARCADE
    this.fireballs.createMultiple(10, 'fireball')

    this.samurai = game.add.sprite(game.width * .1, 0, 'samurai')
    this.samurai.scale.setTo(this.scaleFactor, this.scaleFactor)
    this.samurai.smoothed = false

    this.samurai.animations.add('run', [0, 1, 2, 3, 4, 5], 18, true)
    this.samurai.animations.add('attack', [7, 10, 11, 12, 13], 32)

    game.physics.enable(this.samurai, Phaser.Physics.ARCADE)

    this.samurai.body.gravity.y = game.height * 2
    this.samurai.body.setSize(22, 36, 20, 14)

    this.attackBtn = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.attackBtn.onDown.add(this.attack, this)

    this.jumpBtn = game.input.keyboard.addKey(Phaser.Keyboard.UP)
    this.jumpBtn.onDown.add(this.jump, this)

    const textStyle = {
      font: '10vw -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      fille: '#333',
      align: 'center'
    }

    this.scoreText = game.add.text(game.world.centerX, game.height * .1, this.score, textStyle)
    this.scoreText.anchor.set(.5)

    game.input.onDown.add(() => {
      if (game.input.x <= game.width / 2) {
        this.jump()
      }
      else {
        this.attack()
      }
    }, this)

    this.startTime = game.time.now
    this.timers.push(game.time.events.loop(Phaser.Timer.SECOND * 3, this.makeFireball, this))
  }

  update() {
    if (game.time.now - this.startTime > this.level * 30 * Phaser.Timer.SECOND) {
      this.level++
      this.timers.push(game.time.events.loop(Phaser.Timer.SECOND * game.rnd.realInRange(1, 2), this.makeFireball, this))
    }
    if (this.ground.length < 5) {
      this.makeGround()
    }

    game.physics.arcade.collide(this.samurai, this.ground, () => {
      if (this.samurai.x >= game.width * .1) {
        this.samurai.body.velocity.x = this.VELOCITY_X * -1
      }

      if (this.samurai.body.velocity.y !== 0) {
        this.lose()
      }

      if (this.jumps > 0 && !this.dead) {
        this.samurai.body.velocity.x = this.VELOCITY_X * -1.05
        this.samurai.animations.play('run')
        this.jumps = 0
        this.samurai.body.gravity.y = game.height * 2
        if (this.samurai.__jumpAttack) {
          this.samurai.__jumpAttack = false
          game.camera.shake(.02, 200)
        }
      }
    })

    game.physics.arcade.overlap(this.samurai, this.fireballs, (samurai, fireball) => {
      if ((!this.attacking && !fireball.__hit) || (this.attacking && !fireball.__hit && fireball.__notouching)) {
        fireball.visible = false
        const explosion = game.add.sprite(fireball.x, fireball.y + fireball.height * .5, 'explosion')
        explosion.anchor.setTo(.5, .5)
        if (fireball.__notouching) {
          explosion.scale.setTo(this.scaleFactor * 1.2, this.scaleFactor * 1.2)
          explosion.tint = 0xff6666
        }
        else {
          explosion.scale.setTo(this.scaleFactor, this.scaleFactor)
          explosion.tint = 0xffffff
        }
        const explode = explosion.animations.add('explode')
        explode.play(30)
        explode.onComplete.add(() => {
          explosion.visible = false
        })
        this.lose()
      }
      if (this.attacking && !fireball.__hit) {
        fireball.body.velocity.x *= -2
        fireball.scale.x *= -1
        fireball.__hit = true
        this.score++
        this.scoreText.text = this.score
      }
    })

    if (this.samurai.body.velocity.y > 0 && !this.dead) {
      if (this.samurai.animations.currentAnim.name != 'attack') {
        this.samurai.frame = 15
      }
      this.samurai.body.velocity.x = 0
    }

    if (this.samurai.y > game.height) {
      game.state.start('End', true, false, this.score)
    }

    if (process.env.NODE_ENV === 'development') {
      document.getElementById('fps').innerHTML = game.time.fps
    }
  }

  attack() {
    if (this.dead) {
      return
    }
    this.attacking = true
    this.samurai.body.setSize(70, 45, 0, 5)
    this.samurai.animations.play('attack')
    this.samurai.animations.currentAnim.onComplete.add(() => {
      this.samurai.body.setSize(22, 36, 20, 14)
      this.attacking = false
      this.samurai.animations.play('run')
    })
    if (this.jumps > 0) {
      this.samurai.body.gravity.y = game.height * 24
      this.samurai.__jumpAttack = true
    }
  }

  jump() {
    if (this.dead) {
      return
    }
    if (this.jumps > 1) {
      return
    }
    this.samurai.frame = 17
    if (this.jumps > 0) {
      this.samurai.frame = 14
    }
    this.jumps++
    this.samurai.body.velocity.y = -game.height * .8
    this.samurai.body.velocity.x = 0
    this.samurai.animations.stop()
    if (this.attacking) {
      this.samurai.body.setSize(22, 36, 20, 14)
      this.attacking = false
    }
  }

  lose() {
    this.dead = true

    this.ground.forEach((ground) => {
      ground.body.velocity.x = 0
      ground.body.enable = false
    })

    this.samurai.body.velocity.x = this.VELOCITY_X * .5
    this.samurai.body.velocity.y = game.height * -.25
    this.samurai.animations.stop()
    this.samurai.frame = 18
    
    game.camera.shake(.05, 500)
  }

  render() {
    if (process.env.NODE_ENV === 'development') {
      game.debug.body(this.samurai)
    }
  }
}
