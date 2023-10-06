const ntc = require('./ntc.js');
var convert = require('color-convert');
 
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const calculateColor = (c) => {
      const color = c <= 1 ? c : c / 360;
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const r = Math.round(hue2rgb(p, q, color + 1 / 3) * 255);
      const g = Math.round(hue2rgb(p, q, color) * 255);
      const b = Math.round(hue2rgb(p, q, color - 1 / 3) * 255);
      return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    return calculateColor(h / 360);
}

function hsbToHex(h, s, b) {
    s /= 100;
    b /= 100;
    let i = Math.floor((h / 60) % 6);
    let f = (h / 60) - i;
    let p = b * (1 - s);
    let q = b * (1 - f * s);
    let t = b * (1 - (1 - f) * s);
    let r, g, bl;
    switch(i) {
        case 0:
            r = b; g = t; bl = p; break;
        case 1:
            r = q; g = b; bl = p; break;
        case 2:
            r = p; g = b; bl = t; break;
        case 3:
            r = p; g = q; bl = b; break;
        case 4:
            r = t; g = p; bl = b; break;
        case 5:
            r = b; g = p; bl = q; break;
    }
    let rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(bl * 255)];
    return rgb.map(val => val.toString(16).padStart(2, '0')).join('');
}


function generateIntervalNormal(initial, end, count){
  const counter = count - 1
  const res = []
  if(initial === end){
      for(let i = 0 ; i<counter ; i++){
          res.push(initial)
      }
      res.push(initial)

  }else if(initial < end){
      const middle = end - initial
      let first = initial
      const interval = Math.floor(middle/counter)

      for(let i = 0 ; i<counter ; i++){
          res.push(first)
          first += interval
      }
      res.push(first)

  }else if(initial > end){
      const middle = initial - end
      let first = initial
      const interval = Math.floor(middle/counter)

      for(let i = 0 ; i<counter ; i++){
          res.push(first)
          first -= interval
      }
      res.push(first)
  }
  return res
}

function generate1({
  hueInitial =0,
  hueEnd = 350, 
  lightInitial = 50, 
  lightEnd = 50, 
  saturationInitial = 100, 
  saturtionEnd = 100,
  count = 5
} = {}) {
      let resHue = generateIntervalNormal(hueInitial, hueEnd, count)
      let resSaturation = generateIntervalNormal(saturationInitial, saturtionEnd, count)
      let resLight = generateIntervalNormal(lightInitial, lightEnd, count)

      let resHsl = []
      let resHex = []

      for(let i = 0; i<count ; i++){
          let color = []
          color.push(resHue[i])
          color.push(resSaturation[i])
          color.push(resLight[i])
          resHsl.push(color)
      }

      for(let i = 0; i<count ; i++){
          let hex = hslToHex(resHsl[i][0], resHsl[i][1], resHsl[i][2])
          resHex.push(hex)
      }
      return resHex
}

function color(hex, count){
    let res = []

    for(let i = 0 ; i<count ; i++){

        let realName = ntc.name(hex[i])[1]
        let hexName = `#${hex[i]}`
        let colorCode = hex[i]
        let rgbName = convert.hex.rgb(hex[i])
        let hslName = convert.hex.hsl(hex[i])
        let cmykName = convert.hex.cmyk(hex[i])
        let labName = convert.hex.lab(hex[i])
        let hsvName = convert.hex.hsv(hex[i])
        let color = {
            color:colorCode, 
            hexName:hexName, 
            realName:realName,
            rgb:`(${rgbName[0]}, ${rgbName[1]}, ${rgbName[2]})`,
            hsl:`(${hslName[0]}, ${hslName[1]}, ${hslName[2]})`,
            cmyk:`(${cmykName[0]}, ${cmykName[1]}, ${cmykName[2]}, ${cmykName[3]})`,
            lab:`(${labName[0]}, ${labName[1]}, ${labName[2]})`,
            hsv:`(${hsvName[0]}, ${hsvName[1]}, ${hsvName[2]})`

        }
        res.push(color)
    
    }
    return res
}



function generateMonochromatic(count, hueInitial, hueEnd, lightInitial, lightEnd, saturationInitial, saturtionEnd){
    const hex = generate1({
        count:count, 
        hueInitial:hueInitial, 
        hueEnd:hueEnd, 
        lightInitial:lightInitial, 
        lightEnd:lightEnd,
        saturationInitial:saturationInitial,
        saturtionEnd:saturtionEnd
    })

    return color(hex, count)
}

function generatePrimary(){
    return Math.floor(Math.random()*361)
}

function generateSet(start, end){
    return Math.floor(Math.random()*(end-start+1)) + start
}

function Analogus(count){
    const ls = []
    const gap = Math.floor(Math.random()*(360/count)) + 10
    
    const hue = generatePrimary()
    const saturationPrimary = generateSet(60, 90)
    const dice = generateSet(0, 10)

    for(let i =0; i<count ; i++){
        let brightness;
        if(dice > 3 ){
            brightness = generateSet(85, 100)
        }else{
            brightness = generateSet(0, 85)
        }
        let color = hue + (i*gap)
        let saturation = saturationPrimary + Math.floor(Math.random()*10)
        if(color >= 360){
            color = color - 360
        }

        if(saturation >= 100){
            saturation = saturation - 100
        }

        const res = hsbToHex(color, saturation, brightness)
        ls.push(res)
    }
    return color(ls, count) 
}

function Monochromatic(count){
    const ls = []
    const hue = generatePrimary()

    for(let i = 0; i<count; i++){
        let saturation = generateSet(35,85)
        let brightness = generateSet(10, 95)

        const res = hsbToHex(hue, saturation, brightness)
        ls.push(res)
    }

    return color(ls, count)
}

function triadic(count){
    let ls =  []
    let lsHsb = []

    const huePrimary = generatePrimary()

    for(let i = 0; i<3; i++){
        let ls = []

        let hue = huePrimary + (120*i)
        if(hue > 360){
            hue = hue - 360
        }
        let saturation = generateSet(70, 95)
        let brightness = generateSet(50, 95)

        ls.push(hue)
        ls.push(brightness)
        ls.push(saturation)
        lsHsb.push(ls)

    }

    while(lsHsb.length < count){
        let ls = []

        let hue = lsHsb[generateSet(0,2)][0]
        let saturation = generateSet(30, 95)
        let brightness = generateSet(10, 95)

        ls.push(hue)
        ls.push(brightness)
        ls.push(saturation)
        lsHsb.push(ls)
    }

    for(let i = 0; i<lsHsb.length ; i++){
        const res = hsbToHex(lsHsb[i][0], lsHsb[i][2], lsHsb[i][1])
        ls.push(res)
    }
    console.log(lsHsb)

    return color(ls, count)

}

function Complimentary(count){
    let ls =  []
    let lsHsb = []

    const huePrimary = generatePrimary()

    for(let i = 0; i<2; i++){
        let ls = []

        let hue = huePrimary + (180*i)
        if(hue > 360){
            hue = hue - 360
        }
        let saturation = generateSet(70, 95)
        let brightness = generateSet(50, 95)

        ls.push(hue)
        ls.push(brightness)
        ls.push(saturation)
        lsHsb.push(ls)

    }

    while(lsHsb.length < count){
        let ls = []

        let hue = lsHsb[generateSet(0,1)][0]
        let saturation = generateSet(30, 95)
        let brightness = generateSet(10, 95)

        ls.push(hue)
        ls.push(brightness)
        ls.push(saturation)
        lsHsb.push(ls)
    }

    for(let i = 0; i<lsHsb.length ; i++){
        const res = hsbToHex(lsHsb[i][0], lsHsb[i][2], lsHsb[i][1])
        ls.push(res)
    }
    console.log(lsHsb)

    return color(ls, count)

}

function square(count){
    let ls =  []
    let lsHsb = []

    const huePrimary = generatePrimary()

    for(let i = 0; i<4; i++){
        let ls = []

        let hue = huePrimary + (90*i)
        if(hue > 360){
            hue = hue - 360
        }
        let saturation = generateSet(70, 95)
        let brightness = generateSet(50, 95)

        ls.push(hue)
        ls.push(brightness)
        ls.push(saturation)
        lsHsb.push(ls)

    }

    while(lsHsb.length < count){
        let ls = []

        let hue = lsHsb[generateSet(0,3)][0]
        let saturation = generateSet(30, 95)
        let brightness = generateSet(10, 95)

        ls.push(hue)
        ls.push(brightness)
        ls.push(saturation)
        lsHsb.push(ls)
    }

    for(let i = 0; i<lsHsb.length ; i++){
        const res = hsbToHex(lsHsb[i][0], lsHsb[i][2], lsHsb[i][1])
        ls.push(res)
    }
    console.log(lsHsb)

    return color(ls, count)

}




// ["#69d2e7","#a7dbd8","#e0e4cc","#f38630","#fa6900"]
// console.log(generateMonochromatic(10, 0, 360, 10, 80))

// console.log(Monochromatic(5))
// console.log("---------------------------------")
// console.log(generateMonochromatic(10, 0, 360, 10, 80))
console.log(triadic(5))





module.exports =  {Analogus,Monochromatic,square,triadic,Complimentary,generateMonochromatic};




