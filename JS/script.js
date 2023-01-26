import { grabImage } from "./images.js"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

class Obj{
    constructor(x,y,w,h,type){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.type = type
    }
    draw(){
        ctx.drawImage(grabImage(this.type),this.x,this.y,this.w,this.h)
    }
    update(scale){
        this.x *= scale
        this.y *= scale
        this.w *= scale
        this.h *= scale
    }
}
class Trampoline extends Obj{
    constructor(x,y,w,h,type,power){
        super(x,y,w,h,type)
        this.power = power
        this.animationTimer = 0
    }
    animate(){
        this.animationTimer += 1
        const animationFrame = 1+Math.floor(this.animationTimer/30)
        if(animationFrame == 1){
            this.type = 'tp2'
            setTimeout(() => {this.animate()})
            if(this.animationTimer == 1){
                this.y-=this.h*0.3
                this.h*=1.3
            }
        }
        else{
            this.animationTimer = 0
            this.type = 'tp1'
            this.h *= (1/1.3)
            this.y+=this.h*0.3
        }
    }
    update(scale){
        super.update(scale)
        this.power *= scale
    }
}
class Portal extends Obj{
    constructor(x,y,w,h,type,link){
        super(x,y,w,h,type)
        this.linkX = link.x
        this.linkY = link.y
    }
    teleport(player){
        player.x = this.linkX
        player.y = this.linkY
    }
    update(scale){
        super.update(scale)
        this.linkX *= scale
        this.linkY *= scale
    }
}
const TrampolinePowers = {
    20:10,
    19:9,
    18.5:8,
    17:7,
    16:6,
    15:5,
    13:4,
    11:3,
    10:2,
    7:1
}
const objects = [new Obj(480,740,20,20,'GrassAndDirt'),new Obj(500,740,20,20,'GrassAndDirt'),new Obj(520,740,20,20,'GrassAndDirt'),new Obj(540,740,20,20,'GrassAndDirt'),new Obj(580,740,20,20,'GrassAndDirt'),new Obj(580,740,20,20,'GrassAndDirt'),new Obj(600,740,20,20,'GrassAndDirt'),new Obj(600,740,20,20,'GrassAndDirt'),new Obj(620,740,20,20,'GrassAndDirt'),new Obj(640,740,20,20,'GrassAndDirt'),new Obj(660,740,20,20,'GrassAndDirt'),new Obj(680,740,20,20,'GrassAndDirt'),new Obj(680,740,20,20,'GrassAndDirt'),new Obj(700,740,20,20,'GrassAndDirt'),new Obj(700,740,20,20,'GrassAndDirt'),new Trampoline(700,720,20,20,'tp1',10),new Portal(700,600,20,20,'portal1',{x:900,y:600}),new Portal(900,600,20,20,'portal1',{x:700,y:600}),new Obj(880,620,20,20,'GrassAndDirt'),new Obj(900,620,20,20,'GrassAndDirt'),new Obj(920,620,20,20,'GrassAndDirt')]
class Player{
    constructor(){
        this.size = 20
        this.x = 690
        this.y = 780
        this.speed = 5
        this.isJumping = false
        this.gravity = 1
        this.jumpSpeed = 0
        this.time = 0
        this.startJumpSpeed = 15
    }
    draw(){
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(this.x,this.y,this.size,this.size)
        this.move()
        const blockHeight = Math.floor((780*(canvas.width/1400)-this.y)/(20*(canvas.width/1400)))
        ctx.font = '24px Arial'
        ctx.fillText(blockHeight,50,50)
    }
    keyPress(e,bln){
        const keys = {
            'w':'up',
            'a':'left',
            'd':'right',
            ' ':'up',
            'ArrowRight':'right',
            'ArrowLeft':'left',
            'ArrowUp':'up'
        }
        if(keys[e.key] != undefined){
            this[keys[e.key]] = bln
        }
    }
    move(){
        this.y -= this.jumpSpeed
        if(this.right == true){
            this.x+=this.speed
            if(this.x>canvas.width-this.size){
                this.x=canvas.width-this.size
            }
        }
        if(this.left == true){
            this.x-=this.speed
            if(this.x<0){
                this.x=0
            }
        }
        this.detectCollisionX()
        const isResting = this.detectCollisionY()
        if(!isResting && this.y != canvas.height-this.size && this.isJumping == false){
            this.jumpSpeed -= this.gravity
        }
        if(this.up == true && this.isJumping == false){
            this.jumpSpeed = this.startJumpSpeed
            this.isJumping = true
        }
        if(this.isJumping == true){
            this.jumpSpeed -= this.gravity
        }
        if(this.y>canvas.height-this.size){
            this.y = canvas.height-this.size
            this.isJumping = false
        }
    }
    detectCollisionX(){
        for(let i=0; i<objects.length; i++){
            const {x:x, y:y, w:w, h:h, type:type} = objects[i]
            if(this.x<x+w && this.x+this.size>x && this.y-Math.abs(this.jumpSpeed)<y+h && this.y+this.size+Math.abs(this.jumpSpeed)>y){
                if(type == 'GrassAndDirt' || type == 'Grass' || type == 'Dirt' || type == 'tp1'){
                    const x_dist = ((this.x+this.size/2)-(x+w/2))/(w/(w+h))
                    const y_dist = ((this.y+this.size/2)-(y+h/2))/(h/(w+h))
                    if(Math.abs(x_dist)>=Math.abs(y_dist)){
                        if(x_dist<0){
                            this.x = x-this.size
                        }
                        else{
                            this.x = x+w
                        }
                    }
                }
                else if(type == 'Lava'){
                    player  = new Player()
                    player.update(canvas.width/1400)
                }
                else if(type == 'portal1'){
                    objects[i].teleport(this)
                }
            }
        }
    }
    detectCollisionY(){
        for(let i=0; i<objects.length; i++){
            const {x:x, y:y, w:w, h:h, type:type} = objects[i]
            if(this.x<x+w && this.x+this.size>x && this.y-Math.abs(this.jumpSpeed)<y+h && this.y+this.size+Math.abs(this.jumpSpeed)>y){
                if(type == 'GrassAndDirt' || type == 'Grass' || type == 'Dirt' || type == 'stone' || type == 'grassyStone'){
                    const x_dist = ((this.x+this.size/2)-(x+w/2))/(w/(w+h))
                    const y_dist = ((this.y+this.size/2)-(y+h/2))/(h/(w+h))
                    if(Math.abs(x_dist)<Math.abs(y_dist)){
                        if(y_dist<0){
                            if(this.jumpSpeed<=0){
                                this.y = y-this.size
                                this.jumpSpeed = 0
                                this.isJumping = false
                                return true
                            }
                            
                        }
                        else{
                            this.y = y+h
                            this.jumpSpeed = 0
                        }
                    }
                }
                else if(type == 'Lava'){
                    player  = new Player()
                    player.update(canvas.width/1400)
                }
                else if(type == 'tp1'){
                    const y_dist = ((this.y+this.size/2)-(y+h/2))/(h/(w+h))
                    if(y_dist<0){
                        this.y = y-this.size-h*0.3
                        this.isJumping = false
                        this.jumpSpeed = objects[i].power
                        if(objects[i].animationTimer == 0){
                            objects[i].animate()
                        }
                    }
                    else{
                        this.y = y+h
                        this.jumpSpeed = 0
                    }
                }
                else if(type == 'portal1'){
                    objects[i].teleport(this)
                }
            }
        }
    }
    update(scale){
        this.size *= scale
        this.x *= scale
        this.y *= scale
        this.speed *= scale
        this.gravity *= scale
        this.startJumpSpeed *= scale
    }
}
let player = new Player()

function mainLoop(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    player.draw()
    objects.forEach(o => o.draw())
    requestAnimationFrame(mainLoop)
}
mainLoop()

function resize(){
    const currentWidth = canvas.width
    const w2 = window.document.defaultView.innerWidth-20
    const h2 = window.document.defaultView.innerHeight-20
    const ratio = (h2*14/8)/w2
    if(ratio>1){
        canvas.height = w2/(14/8)
        canvas.width = w2
    }
    else{
        canvas.width = h2*(14/8)
        canvas.height = h2
    }
    const scale = canvas.width/currentWidth
    player.update(scale)
    objects.forEach(o => o.update(scale))
}
resize()

window.addEventListener('resize',resize)
window.addEventListener('keydown',function(e){
    player.keyPress(e,true)
})
window.addEventListener('keyup',function(e){
    player.keyPress(e,false)
})
