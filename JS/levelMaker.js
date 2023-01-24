const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function resize(){
    canvas.width = window.document.defaultView.innerWidth-20
    canvas.height = window.document.defaultView.innerHeight-20
}
resize()

class Button{
    constructor(x,y,w,h,color,txt,fn){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.txt = txt
        this.fn = fn
        this.color = color
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x,this.y,this.w,this.h)
    }
    wasClicked(e){
        const x = e.pageX-10
        const y = e.pageY-10
        if(x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h){
            this.fn()
            return true
        }
    }
}

class Block{
    constructor(x,y,w,h,type){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.type = type
    }
    draw(){
        if(this.type == 'grass'){
            ctx.fillStyle = '#006900'
        }
        ctx.fillRect(this.x,this.y,this.w,this.h)
    }
}
const blocks = []
let selectedBlock = 'grass'
const buttons = []
for(let row=0; row<40; row++){
    for(let col=0; col<70; col++){
        buttons.push(new Button(col*20,row*20,20,20,'#ffffff','',function(){
            blocks.push(new Block(col*20,row*20,20,20,selectedBlock))
            const index = buttons.findIndex(b => b.x == col*20 && b.y == row*20)
            buttons.splice(index,1)
        }))
    }
}
buttons.push(new Button(10,10,50,50,'#006900','Grass',function(){
    selectedBlock = 'grass'
}))

let showBlockOptions = true

function mainLoop(){
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0,0,canvas.width,canvas.height)
    buttons.forEach(b => {if(b.txt != '' && showBlockOptions == true){b.draw()}})
    blocks.forEach(b => b.draw())
    requestAnimationFrame(mainLoop)
}
mainLoop()

window.addEventListener('resize',resize)
window.addEventListener('mousedown', function(e){
    if(e.which == 1){
        if(showBlockOptions == true){
            buttons.find(b => b.txt != '' && b.wasClicked(e))
        }
        else{
            buttons.find(b => b.txt == '' && b.wasClicked(e))
        }
    }
    if(e.which == 3){
        const x = e.pageX-10
        const y = e.pageY-10
        blocks.forEach(b => {
            if(x>=b.x && x<=b.x+b.w && y>=b.y && y<=b.y+b.h){
                const index = blocks.findIndex(b1 => b1.x == b.x && b1.y == b.y)
                buttons.push(new Button(b.x,b.y,b.w,b.h,'#ffffff','',function(){
                    blocks.push(new Block(b.x,b.y,20,20,selectedBlock))
                    const index = buttons.findIndex(b => b.x == col*20 && b.y == row*20)
                    buttons.splice(index,1)
                }))
                blocks.splice(index,1)
            }
        })
    }
})
window.addEventListener('keydown',function(e){
    if(e.key == 's'){
        if(showBlockOptions == true){
            showBlockOptions = false
        }
        else{
            showBlockOptions = true
        }
    }
})