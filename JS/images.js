function image(src){const img = new Image(); img.src = 'Images/'+src; return img}
const images = {
    GrassAndDirt: image('GrassAndDirt.png'),
    Dirt: image('Dirt.png'),
    Grass: image('Grass.png')
}
export function grabImage(name){
    return images[name]
}