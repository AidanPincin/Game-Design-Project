import { grabImage } from "./images.js"

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
let isRunning = true

class Button{
    constructor(x,y,w,h,type,fn){
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.type = type
        this.fn = fn
    }
    draw(){
        ctx.drawImage(grabImage(this.type),this.x,this.y,this.w,this.h)
    }
    wasClicked(e){
        const x = e.pageX-10
        const y = e.pageY-10
        if(x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h){
            this.fn()
            return true
        }
    }
    update(scale){
        this.x *= scale
        this.y *= scale
        this.w *= scale
        this.h *= scale
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
        ctx.drawImage(grabImage(this.type),this.x,this.y,this.w,this.h)
    }
    update(scale){
        this.x *= scale
        this.y *= scale
        this.w *= scale
        this.h *= scale
    }
}
class Trampoline extends Block{
    constructor(x,y,w,h,type,power){
        super(x,y,w,h,type)
        this.power = power
    }
    update(scale){
        super.update(scale)
        this.power *= scale
    }
}
class Portal extends Block{
    constructor(x,y,w,h,type,link){
        super(x,y,w,h,type)
        this.link = link
    }
    update(scale){
        super.update(scale)
        this.link.x *= scale
        this.link.y *= scale
    }
}
let blockSize = 20
const blocks = []
let selectedBlock = 'GrassAndDirt'
const buttons = [new Button(10,10,50,50,'GrassAndDirt',function(){
    selectedBlock = 'GrassAndDirt'
}),new Button(70,10,50,50,'Grass',function(){
    selectedBlock = 'Grass'
}),new Button(130,10,50,50,'Dirt',function(){
    selectedBlock = 'Dirt'
}),new Button(190,10,50,50,'Lava',function(){
    selectedBlock = 'Lava'
}),new Button(250,10,50,50,'tp1',function(){
    selectedBlock = 'tp1'
}),new Button(370,10,50,50,'stone',function(){
    selectedBlock = 'stone'
}),new Button(430,10,50,50,'grassyStone',function(){
    selectedBlock = 'grassyStone'
}),new Button(310,10,50,75,'portal1',function(){
    selectedBlock = 'portal1'
}),new Button(10,70,50,50,'plus',function(){
    if(blockSize != 100){
        blockSize += 20
    }
}),new Button(10,130,50,50,'minus',function(){
    if(blockSize != 20){
        blockSize -= 20
    }
})]

let showBlockOptions = true
let mouseX = 0
let mouseY = 0
let mouseSize = 20
let isDeleting = false
let isLinkingPortals = false

function mainLoop(){
    if(isRunning == true){
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0,0,canvas.width,canvas.height)
        if(isDeleting == false){
            ctx.fillStyle = '#00ff00'
            ctx.fillRect(mouseX,mouseY,mouseSize,mouseSize)
        }
        else{
            ctx.fillStyle = '#ff0000'
        }
        buttons.forEach(b => {if(b.txt != '' && showBlockOptions == true){b.draw()}})
        blocks.forEach(b => b.draw())
        if(isDeleting == true){
            ctx.fillRect(mouseX,mouseY,mouseSize,mouseSize)
        }
        ctx.fillStyle = '#000000'
        ctx.font = '12px Arial'
        ctx.fillText('block size -- '+blockSize,10,220*(canvas.width/1400))
    }
    requestAnimationFrame(mainLoop)
}
mainLoop()

window.addEventListener('resize',resize)
window.addEventListener('mousedown', function(e){
    if(isRunning == true){
        if(showBlockOptions == true){
            buttons.find(b => b.wasClicked(e))
        }
        else{
            if(isDeleting == true){
                const foundBlock = blocks.find(b => mouseX==b.x && mouseY==b.y)
                if(foundBlock != undefined){
                    const index = blocks.findIndex(b => b.x == foundBlock.x && b.y == foundBlock.y)
                    blocks.splice(index,1)
                }
            }
            else{
                const foundBlock = blocks.find(b => mouseX>b.x && mouseX<b.x+b.w && mouseY>b.y && mouseY<b.y+b.h)
                if(foundBlock == undefined){
                    if(selectedBlock == 'tp1'){
                        let power = prompt('What is the power of this trampoline?')
                        if(power>0){
                            blocks.push(new Trampoline(mouseX,mouseY,mouseSize,mouseSize,selectedBlock,JSON.parse(power)*(canvas.width/1400)))
                        }
                        else{
                            alert('Invalid Input')
                        }
                    }
                    else if(selectedBlock == 'portal1'){
                        const newPortal = new Portal(mouseX,mouseY,mouseSize,mouseSize*1.5,selectedBlock,undefined)
                        if(isLinkingPortals == true){
                            const linkedPortal = blocks.find(b => b.type == 'portal1' && b.link == undefined)
                            newPortal.link = {x:linkedPortal.x,y:linkedPortal.y}
                            linkedPortal.link = {x:newPortal.x,y:newPortal.y}
                            isLinkingPortals = false
                        }
                        else{
                            isLinkingPortals = true
                        }
                        blocks.push(newPortal)
                    }
                    else{
                        blocks.push(new Block(mouseX,mouseY,mouseSize,mouseSize,selectedBlock))
                    }
                }
            }
        }
    }
})
window.addEventListener('mousemove',function(e){
    if(showBlockOptions == false && isRunning == true){
        const x = e.pageX-10
        const y = e.pageY-10
        const scale = canvas.width/1400
        const col = Math.floor((x/scale)/blockSize)
        const row = Math.floor((y/scale)/blockSize)
        mouseX = col*blockSize*scale
        mouseY = row*blockSize*scale
        mouseSize = blockSize*scale
    }
})
window.addEventListener('keydown',function(e){
    if(isRunning == true){
        if(e.key == 's'){
            if(showBlockOptions == true){
                showBlockOptions = false
            }
            else{
                showBlockOptions = true
            }
        }
        if(e.key == 'd'){
            if(isDeleting == false){
                isDeleting = true
            }
            else{
                isDeleting = false
            }
        }
        if(e.key == 'p'){
            printCode()
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
function printCode(){
    let code = '['
    const scale = 1400/canvas.width
    for(let i=0; i<blocks.length; i++){
        const {x:x,y:y,w:w,h:h,type:type} = blocks[i]
        if(type == 'tp1'){
            code += 'new Trampoline('
        }
        else if(type == 'portal1'){
            code += 'new Portal('
        }
        else{
            code += 'new Obj('
        }
        code += JSON.stringify(Math.round(x*scale))+','+JSON.stringify(Math.round(y*scale))+','+JSON.stringify(Math.round(w*scale))+','+JSON.stringify(Math.round(h*scale))+','+"'"+type+"'"
        if(type == 'tp1'){
            code += ','+JSON.stringify(Math.round(blocks[i].power*scale))
        }
        else if(type == 'portal1'){
            code += ','+JSON.stringify({x:Math.round(blocks[i].link.x*scale),y:Math.round(blocks[i].link.y*scale)})
        }
        if(i != blocks.length-1){
            code += '),'
        }
        else{
            code +=')'
        }
    }
    code += ']'
    console.log(code)
}
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
    buttons.forEach(b => b.update(scale))
    blocks.forEach(b => b.update(scale))

}
resize()
