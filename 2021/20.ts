import _ from 'lodash'
import chalk from 'chalk'

type Pixel = 0 | 1

interface Input {
  enhancementAlgorithm: Pixel[]
  image: Pixel[][]
}

export function parseInput(s: string): Input {
  const PIXELS = /([.#]+)/

  const enhancementAlgorithm = [] as Pixel[]
  const image = [] as Pixel[][]

  for (const line of  s.split(/\r?\n/)) {
    const match = PIXELS.exec(line)
    if (!match) continue
    const pixels = match[1].split('').map(c => c === '.' ? 0 : 1)
    if (enhancementAlgorithm.length < 512) {
      enhancementAlgorithm.push(...pixels)
    } else {
      image.push(pixels)
    }
  }

  return {enhancementAlgorithm, image}
}

function format(image: Pixel[][], padding = 2) {
  const darkPixel = chalk.dim('.')
  const lightPixel = chalk.whiteBright('#')

  const width = image[0].length

  const topPadding = _.range(padding)
    .map(() => '')
    .fill(_.range(width + 2*padding)
      .map(() => '')
      .fill(darkPixel)
      .join('')
    )
    .join('\n')
  const bottomPadding = topPadding

  let out = topPadding + '\n'

  const margin = Array(padding).fill(darkPixel).join('')

  out += image
    .map(row => 
      row.map(p => p === 0
        ? darkPixel
        : lightPixel
      )
      .join('')
    )
    .map(row => `${margin}${row}${margin}`)
    .join('\n')

  return out + '\n' + bottomPadding
}

function enhance(image: Pixel[][], algo: Pixel[]): Pixel[][] {
  // identify infinity border, and infinity value (light or dark)
  // infinity can either be light/dark depending on enhancement algorithm
  // in the example, infinity is always dark (all neighbors dark -> dark)
  // in the actual input, infinity flips between light and dark on every enhance step:
  // - all neighbors dark -> light up
  // - all neighbors lit -> darken

  let enhancedImage = image // pad 1 pixel on all sides
  return enhancedImage
}

export function part1(data: Input, debug = true) {
  const {image, enhancementAlgorithm} = data
  if (debug) {
    console.info(format(image))
  }

  let enhancedImage = image
  for (const __ of _.range(2)) {
    enhancedImage = enhance(enhancedImage, enhancementAlgorithm)
    if (debug) {
      console.info(format(enhancedImage))
    }
  }

  const numLit = enhancedImage.flat().filter(p => p > 0).length

  return numLit
}

export function part2(data: Input, debug = true) {
  if (debug) {
    console.info(format(data.image))
  }
  return data
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
