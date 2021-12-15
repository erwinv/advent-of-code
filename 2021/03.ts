import _ from 'lodash'
import { getInput } from '../api'

type Bit = '0' | '1'
type BitIndex = number
type BitCounter = Record<Bit, number>

type Word = Bit[]
type Input = Word[]

export function parseInput(s: string): Input {
  const INPUT_PATTERN = /([01]+)/

  return s.split(/\r?\n/)
    .flatMap(x => {
      const match = INPUT_PATTERN.exec(x)
      if (!match) return []
      return [match[1].split('') as unknown as Word]
    })
}

export function part1(data: Input) {
  const wordLength = data[0].length

  const counters = data.reduce((counters, word) => {
    for (const [i, bit] of word.entries()) {
      counters[i][bit] += 1
    }
    return counters
  }, Array(wordLength).fill({}).map(() => ({'0': 0, '1': 0})) as BitCounter[])

  let gammaRate = ''
  let epsilonRate = ''

  for (const counter of counters) {
    if (counter[0] > counter[1]) {
      gammaRate += '0'
      epsilonRate += '1'
    } else {
      gammaRate += '1'
      epsilonRate += '0'
    }
  }

  return parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)
}

export function part2(data: Input) {
  const o2genStep = (data: Input, bitIndex: BitIndex): Word => {
    if (data.length === 1 || bitIndex > 11) return data[0]

    const [zeroes, ones] = _.partition(data, (input) => input[bitIndex] === '0')
    if (ones.length >= zeroes.length) {
      return o2genStep(ones, bitIndex + 1 as BitIndex)
    } else {
      return o2genStep(zeroes, bitIndex + 1 as BitIndex)
    }
  }
  
  const co2scrubStep = (data: Input, bitIndex: BitIndex): Word => {
    if (data.length === 1 || bitIndex > 11) return data[0]

    const [zeroes, ones] = _.partition(data, (input) => input[bitIndex] == '0')
    if (zeroes.length <= ones.length) {
      return co2scrubStep(zeroes, bitIndex + 1 as BitIndex)
    } else {
      return co2scrubStep(ones, bitIndex + 1 as BitIndex)
    }
  }

  const o2genRating = o2genStep(data, 0).join('')
  const co2scrubRating = co2scrubStep(data, 0).join('')

  return parseInt(o2genRating, 2) * parseInt(co2scrubRating, 2)
}

async function solve() {
  const input = parseInput(await getInput('2021', __filename))
  console.info(part1(input))
  console.info(part2(input))
}

if (require.main === module) {
  solve()
}
