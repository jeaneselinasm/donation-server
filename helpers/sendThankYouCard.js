const Jimp = require('jimp')
const path = require('path')

async function createThankYouCard(name) {
    try {
        // Create image from file
        const image = await new Jimp('template.png');
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK)

        // DRAW NAME ON THE IMAGE
        image.print(font, 100, 200, `Thank you, ${name}`)
        const outputPath = path.join(__dirname, `thankyou-${name}`)
        await image.writeAsync(outputPath)
        return outputPath

    } catch (error) {
        console.log(error, 'error jimp')
    }


}

module.exports = createThankYouCard