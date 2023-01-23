const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function resize(){
    canvas.width = window.document.defaultView.innerWidth-20
    canvas.height = window.document.defaultView.innerHeight-20
}
resize()

class Obj{
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }
    draw(){
        ctx.fillStyle = '#006900'
        ctx.fillRect(this.x,this.y,this.w,this.h)
    }
}
const objects = [new Obj(300,canvas.height-80,20,20),new Obj(300,canvas.height-100,20,20),new Obj(300,canvas.height-120,20,20),new Obj(300,canvas.height-140,20,20),new Obj(300,canvas.height-160,20,20),
new Obj(320,canvas.height-80,20,20),new Obj(340,canvas.height-80,20,20),new Obj(360,canvas.height-80,20,20),
new Obj(320,canvas.height-160,20,20),new Obj(340,canvas.height-160,20,20),new Obj(280,canvas.height-160,20,20)]
class Player{
    constructor(size){
        this.size = size
        this.x = canvas.width/2-size/2
        this.y = canvas.height-size
        this.speed = 5
        this.isJumping = false
        this.gravity = 1
        this.jumpSpeed = 0
        this.time = 0
    }
    draw(){
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(this.x,this.y,this.size,this.size)
        this.move()
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
            this.jumpSpeed = 15
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
            const {x:x, y:y, w:w, h:h} = objects[i]
            if(this.x<x+w && this.x+this.size>x && this.y-Math.abs(this.jumpSpeed)<y+h && this.y+this.size+Math.abs(this.jumpSpeed)>y){
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
        }
    }
    detectCollisionY(){
        for(let i=0; i<objects.length; i++){
            const {x:x, y:y, w:w, h:h} = objects[i]
            if(this.x<x+w && this.x+this.size>x && this.y-Math.abs(this.jumpSpeed)<y+h && this.y+this.size+Math.abs(this.jumpSpeed)>y){
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
        }
    }
}
const player = new Player(20)

function mainLoop(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    player.draw()
    objects.forEach(o => o.draw())
    requestAnimationFrame(mainLoop)
}
mainLoop()
window.addEventListener('resize',resize)
window.addEventListener('keydown',function(e){
    player.keyPress(e,true)
})
window.addEventListener('keyup',function(e){
    player.keyPress(e,false)
})