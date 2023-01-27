import { grabImage } from "./images.js"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let isRunning = false

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
        this.cooldown = 0
    }
    teleport(player){
        const linkedPortal = objects.find(b => b.x == this.linkX && b.y == this.linkY)
        linkedPortal.cooldown = 180
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
let objects = [new Obj(320,660,20,20,'GrassAndDirt'),new Obj(340,660,20,20,'GrassAndDirt'),new Obj(360,660,20,20,'GrassAndDirt'),new Obj(380,660,20,20,'GrassAndDirt'),new Obj(400,660,20,20,'GrassAndDirt'),new Obj(440,660,20,20,'GrassAndDirt'),new Obj(420,660,20,20,'GrassAndDirt'),new Obj(220,720,20,20,'GrassAndDirt'),new Obj(180,720,20,20,'GrassAndDirt'),new Obj(160,720,20,20,'GrassAndDirt'),new Obj(200,720,20,20,'GrassAndDirt'),new Obj(460,660,20,20,'Lava'),new Obj(480,660,20,20,'Lava'),new Obj(500,660,20,20,'Lava'),new Obj(520,660,20,20,'GrassAndDirt'),new Obj(540,660,20,20,'GrassAndDirt'),new Obj(560,660,20,20,'GrassAndDirt'),new Trampoline(620,660,20,20,'tp1',20),new Obj(660,460,20,20,'GrassAndDirt'),new Obj(680,460,20,20,'GrassAndDirt'),new Obj(700,460,20,20,'GrassAndDirt'),new Obj(720,460,20,20,'GrassAndDirt'),new Obj(740,460,20,20,'GrassAndDirt'),new Portal(760,440,20,30,'portal1',{"x":1000,"y":440}),new Portal(1000,440,20,30,'portal1',{"x":760,"y":440}),new Obj(980,480,20,20,'GrassAndDirt'),new Obj(1000,480,20,20,'GrassAndDirt'),new Obj(1020,480,20,20,'GrassAndDirt'),new Obj(1060,480,20,20,'GrassAndDirt'),new Obj(1040,480,20,20,'GrassAndDirt'),new Obj(1080,480,20,20,'GrassAndDirt')]
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
                    if(objects[i].cooldown == 0){
                        objects[i].teleport(this)
                    }
                    else{
                        objects[i].cooldown -= 1
                    }
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
                    if(objects[i].cooldown == 0){
                        objects[i].teleport(this)
                    }
                    else{
                        objects[i].cooldown -= 1
                    }
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
    if(isRunning == true){
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0,0,canvas.width,canvas.height)
        player.draw()
        objects.forEach(o => o.draw())
    }   
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
    if(isRunning == true){
        player.keyPress(e,true)
        if(e.key == 'i'){
            const code = window.prompt('Insert code')
        }
    }
    if(e.key == 't'){
        if(isRunning == false){
            isRunning = true
        }
        else{
            isRunning = false
        }
    }
})
window.addEventListener('keyup',function(e){
    if(isRunning == true){
        player.keyPress(e,false)
    }
})
