import _ from 'lodash'
import { slidingPairs } from '../lib'

const ALPHABET = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
  'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
  'u', 'v', 'w', 'x', 'y', 'z'
] as const
type letter = typeof ALPHABET[number]
type Element = Uppercase<letter>
type Polymer = Element[]
type Pair = `${Element}${Element}`

export type Input = {
  template: Polymer
  insertionRules: Map<Pair, Element>
}

export function parseInput(s: string): Input {
  const TEMPLATE = /([A-Z]{3,})/
  const INSERTION_RULE = /([A-Z][A-Z]) -> ([A-Z])/

  const template = [] as Polymer
  const insertionRules = new Map() as Map<Pair, Element>

  for (const line of s.split(/\r?\n/)) {
    const insertionRuleMatch = INSERTION_RULE.exec(line)
    if (insertionRuleMatch) {
      const pair = insertionRuleMatch[1] as Pair
      const child = insertionRuleMatch[2] as Element
      insertionRules.set(pair, child)
      continue
    }

    const templateMatch = TEMPLATE.exec(line)
    if (templateMatch) {
      template.push(...templateMatch[1].split('') as Polymer)
      continue
    }
  }

  return {template, insertionRules}
}


function polymerize(template: Polymer, rules: Input['insertionRules'], steps: number): Polymer {
  if (steps === 0) return template

  const polymer = [...template]
  let i = 0
  let insertedOffset = 0
  for (const [e1, e2] of slidingPairs(template)) {
    const child = rules.get(`${e1}${e2}`)
    if (child) {
      polymer.splice(i + insertedOffset + 1, 0, child)
      insertedOffset++
    }
    i++
  }

  return polymerize(polymer, rules, steps - 1)
}

export function part1({template, insertionRules}: Input, steps = 10) {
  const polymer = polymerize(template, insertionRules, steps)

  const elementCountsDesc = _.chain(polymer)
    .countBy(_.identity)
    .entries()
    .map(([element, count]) => ({element, count}))
    .orderBy('count', 'desc')
    .value()

  return _.first(elementCountsDesc)!.count - _.last(elementCountsDesc)!.count
}

export function part2(input: Input) {
  return part1(input, 40)
}
