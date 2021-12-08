import _ from 'lodash'

type Bit = '0' | '1'
type BitIndex = 0|1|2|3|4|5|6|7|8|9|10|11
type BitCounter = Record<Bit, number>

export type Input = readonly [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]

export function parseInput(s: string): Input[] {
  const INPUT_PATTERN = /([01]{12})/

  return s.split(/\r?\n/)
    .flatMap(x => {
      const match = INPUT_PATTERN.exec(x)
      if (!match) return []
      return [match[1].split('') as unknown as Input]
    })
}

export function part1(data: Input[]) {
  const counters = data.reduce((
    [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12],
    [b1, b2, b3, b4, b5, b6, b7, b8, b9, b10, b11, b12]
    ) => {
    c1[b1] += 1
    c2[b2] += 1
    c3[b3] += 1
    c4[b4] += 1
    c5[b5] += 1
    c6[b6] += 1
    c7[b7] += 1
    c8[b8] += 1
    c9[b9] += 1
    c10[b10] += 1
    c11[b11] += 1
    c12[b12] += 1
    return [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12] as const
  }, [
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
    {'0': 0, '1': 0},
  ] as readonly [BitCounter, BitCounter, BitCounter, BitCounter, BitCounter, BitCounter,
      BitCounter, BitCounter, BitCounter, BitCounter, BitCounter, BitCounter])

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

export function part2(data: Input[]) {
  const o2genStep = (data: Input[], bitIndex: BitIndex): Input => {
    if (data.length === 1 || bitIndex > 11) return data[0]

    const [zeroes, ones] = _.partition(data, (input) => input[bitIndex] === '0')
    if (ones.length >= zeroes.length) {
      return o2genStep(ones, bitIndex + 1 as BitIndex)
    } else {
      return o2genStep(zeroes, bitIndex + 1 as BitIndex)
    }
  }
  
  const co2scrubStep = (data: Input[], bitIndex: BitIndex): Input => {
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
