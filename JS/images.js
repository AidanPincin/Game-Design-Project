function image(src){const img = new Image(); img.src = 'Images/'+src+'.png'; return img}
const images = {
    GrassAndDirt: image('GrassAndDirt'),
    Dirt: image('Dirt'),
    Grass: image('Grass'),
    Lava: image('Lava'),
    tp1: image('Spring1'),
    tp2: image('Spring2'),
    portal1: image('Portal'),
    portal2: image('Portal2'),
    portal3: image('Portal3'),
    portal4: image('Portal4'),
    portal5: image('Portal5'),
    rock: image('Rock'),
    box: image('Box'),
    button1: image('BGButton1'),
    button2: image('BGButton2'),
    button3: image('BGButton3'),
    reverseGravity: image('Reverse_Gravity'),
    stone: image('Stone'),
    grassyStone: image('Stoney_Grass'),
    Tree: image('Tree'),
    Tree2: image('Tree2'),
    plus: image('plus'),
    minus: image('minus'),
    finishFlag: image('Finish_Flag'),
    background: image('Background')
}
export function grabImage(name){
    return images[name]
}
