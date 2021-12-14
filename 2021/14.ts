import _ from 'lodash'

const ALPHABET = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
] as const
type letter = typeof ALPHABET[number]

type Element = Uppercase<letter>
type Polymer = Element[]
type PairInsertionRule = readonly [`${Element}${Element}`, Element]

export type Input = Polymer | PairInsertionRule

export function parseInput(s: string): Input[] {
  const INPUT1 = /([A-Z][A-Z]) -> ([A-Z])/
  const INPUT2 = /([A-Z]+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT1.exec(line) ?? INPUT2.exec(line)
      if (!match) return []
      return [
        INPUT1.test(line)
          ? [match[1], match[2]] as PairInsertionRule
          : match[1].split('') as Polymer
      ]
    })
}

const _slidingWindow = <T>(_xs: T[], windowSize = 2, slidingOffset = 1): T[][] => {
  const xs = [..._xs]
  return [...function*() {
    let i = 0
    while (true) {
      const window = xs.slice(i, i + windowSize)
      if (window.length !== windowSize) {
        break
      }
      yield window
      i += slidingOffset
    }
  }()]
}

function polymerize(template: Polymer, rules: PairInsertionRules, steps: number): Polymer {
  if (steps === 0) return template

  const polymer = [...template]
  let insertedOffset = 0
  for (const [i, _pair] of _slidingWindow(template).entries()) {
    const pair = _pair.join('') as `${Element}${Element}`
    const insert = rules[pair]
    if (insert) {
      polymer.splice(i + insertedOffset + 1, 0, insert)
      insertedOffset++
    }
  }

  return polymerize(polymer, rules, steps - 1)
}

type PairInsertionRules = Partial<Record<`${Element}${Element}`, Element>>

const isPolymer = (x: Input): x is Polymer => x.length > 2

export function part1(data: Input[], steps = 10) {
  const [[polymerTemplate], _pairInsertionRules] = _.partition(data, isPolymer)
  const pairInsertionRules = Object.fromEntries(_pairInsertionRules) as PairInsertionRules

  const polymer = polymerize(polymerTemplate, pairInsertionRules, steps)

  const elementCountsDesc = _.chain(polymer)
    .countBy(_.identity)
    .entries()
    .map(([element, count]) => ({element, count}))
    .orderBy('count', 'desc')
    .value()

  return _.first(elementCountsDesc)!.count - _.last(elementCountsDesc)!.count
}

export function part2(data: Input[]) {
  return part1(data, 40)
}
