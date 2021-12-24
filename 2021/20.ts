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

function format(image: Pixel[][], padding = 5) {
  const darkPixel = chalk.dim('.')
  const lightPixel = chalk.whiteBright('#')

  const length = image.length
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

  let out = topPadding
  // TODO left, right padding
  out += image.map(row => {
      row.map(p => p === 0
        ? darkPixel
        : lightPixel
      )
      .join('')
    })
    .join('\n')

  return out + bottomPadding
}

export function part1(data: Input, debug = true) {
  console.info(format(data.image))
  return data
}

export function part2(data: Input, debug = true) {
  console.info(format(data.image))
  return data
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
