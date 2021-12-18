import _ from 'lodash'
import { slidingPairs } from '../lib'

type Element = string
type Polymer = Element[]
type Pair = `${Element}${Element}`

type Input = {
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

type ElementCounters = Record<Element, number>

function polymerize(template: Polymer, rules: Input['insertionRules'], steps: number): ElementCounters {
  const pairChildren = {} as Record<Pair, {
    child: Element
    pairs: [Pair, Pair]
  }>

  for (const [pair, child] of rules) {
    const pairArr = pair.split('')
    pairArr.splice(1, 0, child)
    pairChildren[pair] = {
      child: child,
      pairs: [pairArr.slice(0, 2).join(''), pairArr.slice(1).join('')]
    }
  }

  const elementCounts = _.countBy(template, _.identity) as Record<Element, number>
  const pairCounts = {} as Record<Pair, number>

  for (const [e1, e2] of slidingPairs(template)) {
    const pair = `${e1}${e2}`
    pairCounts[pair] = (pairCounts[pair] ?? 0) + 1
  }

  for (const __ of _.range(steps)) {
    const childPairCounts = {} as Record<Pair, number>

    for (const [pair, count] of Object.entries(pairCounts)) {
      const {
        child,
        pairs: [childPair1, childPair2],
      } = pairChildren[pair]

      elementCounts[child] = (elementCounts[child] ?? 0) + count
      childPairCounts[childPair1] = (childPairCounts[childPair1] ?? 0) + count
      childPairCounts[childPair2] = (childPairCounts[childPair2] ?? 0) + count

      pairCounts[pair] = pairCounts[pair] - count
    }

    for (const [pair, count] of Object.entries(childPairCounts)) {
      pairCounts[pair] = (pairCounts[pair] ?? 0) + count
    }
  }

  return elementCounts
}

export function part1({template, insertionRules}: Input, debug = true) {
  const elementCounts = polymerize(template, insertionRules, 10)
  const elementCountsAsc = Object.values(elementCounts)
    .sort(_.subtract)
  return _.last(elementCountsAsc)! - _.first(elementCountsAsc)!
}

export function part2({template, insertionRules}: Input, debug = true) {
  const elementCounts = polymerize(template, insertionRules, 40)
  const elementCountsAsc = Object.values(elementCounts)
    .sort(_.subtract)
  return _.last(elementCountsAsc)! - _.first(elementCountsAsc)!
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
