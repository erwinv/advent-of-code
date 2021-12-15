import _ from 'lodash'
import { getInput } from '../api'
import { pairPermutations, slidingPairs } from '../lib'

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

const polymerize10 = _.memoize((ancestorPair: Pair, rules: Input['insertionRules']) => {
  function step(template: Polymer, stepsRemaining: number): Polymer {
    if (stepsRemaining === 0) return template

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

    return step(polymer, stepsRemaining - 1)
  }

  const polymerAfter10 = step(ancestorPair.split('') as Polymer, 10)

  const polymerChildrenAfter10 = polymerAfter10.slice(1, -1)

  return [
    polymerAfter10,
    _.countBy(polymerChildrenAfter10, _.identity) as ElementCounters,
  ] as const
})

export function part1({template, insertionRules}: Input) {
  const polymerCounters = _.countBy(template, _.identity) as ElementCounters

  for (const pair of slidingPairs(template)) {
    const [, counters] = polymerize10(pair.join('') as Pair, insertionRules)
    for (const [el, counter] of Object.entries(counters)) {
      polymerCounters[el as Element] = (polymerCounters[el as Element] ?? 0) + counter
    }
  }

  const elementCountsAsc = Object.values(polymerCounters)
    .sort(_.subtract)
  return _.last(elementCountsAsc)! - _.first(elementCountsAsc)!
}

export function part2({template, insertionRules}: Input) {
  const elements: Set<Element> = new Set()
  for (const element of template) {
    elements.add(element)
  }
  for (const [pair, child] of insertionRules.entries()) {
    elements.add(pair.at(0) as Element)
    elements.add(pair.at(1) as Element)
    elements.add(child)
  }
  const allPairs = Array.from(pairPermutations(Array.from(elements)))

  const childrenCountersAfter20 = {} as Record<Pair, ElementCounters>
  for (const ancestorPair of allPairs) {
    const ancestor = ancestorPair.join('') as Pair
    const [polymerAfter10] = polymerize10(ancestor, insertionRules)

    childrenCountersAfter20[ancestor] = _.countBy(polymerAfter10.slice(1, -1), _.identity) as ElementCounters
    
    for (const pair_ of slidingPairs(polymerAfter10)) {
      const [, counters] = polymerize10(pair_.join('') as Pair, insertionRules)
      
      for (const [el, counter] of Object.entries(counters)) {
        childrenCountersAfter20[ancestor][el as Element] =
        (childrenCountersAfter20[ancestor][el as Element] ?? 0) + counter
      }
    }
  }

  const childrenCountersAfter30 = {} as Record<Pair, ElementCounters>
  for (const ancestorPair of allPairs) {
    const ancestor = ancestorPair.join('') as Pair
    const [polymerAfter10] = polymerize10(ancestor, insertionRules)

    childrenCountersAfter30[ancestor] = _.countBy(polymerAfter10.slice(1, -1), _.identity) as ElementCounters

    for (const pair_ of slidingPairs(polymerAfter10)) {
      const counters = childrenCountersAfter20[pair_.join('') as Pair]

      for (const [el, counter] of Object.entries(counters)) {
        childrenCountersAfter30[ancestor][el as Element] =
          (childrenCountersAfter30[ancestor][el as Element] ?? 0) + counter
      }
    }
  }

  const childrenCountersAfter40 = {} as Record<Pair, ElementCounters>
  for (const ancestorPair of allPairs) {
    const ancestor = ancestorPair.join('') as Pair
    const [polymerAfter10] = polymerize10(ancestor, insertionRules)

    childrenCountersAfter40[ancestor] = _.countBy(polymerAfter10.slice(1, -1), _.identity) as ElementCounters

    for (const pair_ of slidingPairs(polymerAfter10)) {
      const counters = childrenCountersAfter30[pair_.join('') as Pair]

      for (const [el, counter] of Object.entries(counters)) {
        childrenCountersAfter40[ancestor][el as Element] =
          (childrenCountersAfter40[ancestor][el as Element] ?? 0) + counter
      }
    }
  }

  const polymerCounters = _.countBy(template, _.identity) as ElementCounters
  for (const pair of slidingPairs(template)) {
    const counters = childrenCountersAfter40[pair.join('') as Pair]

    for (const [el, counter] of Object.entries(counters)) {
      polymerCounters[el as Element] = (polymerCounters[el as Element] ?? 0) + counter
    }
  }

  const elementCountsAsc = Object.values(polymerCounters)
    .sort(_.subtract)
  return _.last(elementCountsAsc)! - _.first(elementCountsAsc)!
}

async function solve() {
  const input = parseInput(await getInput('2021', __filename))
  console.info(part1(input))
  console.info(part2(input))
}

if (require.main === module) {
  solve()
}
