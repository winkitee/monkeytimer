const colors = {
    "PRIMARY_COLOR": 'rgb(255, 214, 10)',
    "BACKGROUND_COLOR": "rgb(40, 44, 52)",
}

function rangeRandom(start=0, end=100) {
    return Math.floor(Math.random() * (end - start + 1) + start)
}

function getRandomRGB(start=0, end=255) {
    const R = rangeRandom(start, end)
    const G = rangeRandom(start, end)
    const B = rangeRandom(start, end)
    return [R, G, B]
}

function createRGBStyleAttr(rgb, opacity=1) {
    const [R, G, B] = rgb;
    if (opacity < 1 && opacity >= 0) {
        return `rgba(${R}, ${G}, ${B}, ${opacity})`
    }
    return `rgb(${R}, ${G}, ${B})`
}

const isRandom = false;
if (isRandom) {
    colors.PRIMARY_COLOR = createRGBStyleAttr(getRandomRGB(100, 255))
    colors.BACKGROUND_COLOR = createRGBStyleAttr(getRandomRGB(0, 100))
}

export { colors };