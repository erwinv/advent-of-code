import _ from 'lodash'
import { pairPermutations } from '../lib'

type NestedPair<T=number> = [T | NestedPair<T>, T | NestedPair<T>]

interface SnailfishNumber {
  left: number | SnailfishNumber
  right: number | SnailfishNumber
}

export function parseInput(s: string): SnailfishNumber[] {
  const INPUT = /([\[\],0-9]+)/

  const parseNestedPair = ([left_, right_]: NestedPair): SnailfishNumber => {
    const left = _.isNumber(left_) ? left_ : parseNestedPair(left_)
    const right = _.isNumber(right_) ? right_ : parseNestedPair(right_)
    return {left, right}
  }

  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        parseNestedPair(JSON.parse(match[1]) as NestedPair)
      ]
    })
}

function* traversePreorder(x: SnailfishNumber, depth = 0, parent?: SnailfishNumber, location?: 'left' | 'right')
  : Generator<[
      parent: SnailfishNumber, location: 'left' | 'right', depth: number,
      grandparent?: SnailfishNumber, parentLocation?: 'left' | 'right'
    ], void>
{
  const { left, right } = x

  if (_.isNumber(left)) {
    yield [x, 'left', depth + 1, parent, location]
  } else {
    yield* traversePreorder(left, depth + 1, x, 'left')
  }

  if (_.isNumber(right)) {
    yield [x, 'right', depth + 1]
  } else {
    yield* traversePreorder(right, depth + 1, x, 'right')
  }
}

function incrementByAt(x: SnailfishNumber, increment: number, index: number) {
  if (index < 0) return
  let i = 0
  for (const [parent, location] of traversePreorder(x)) {
    if (i === index) {
      const value = parent[location] as number
      parent[location] = value + increment
      return
    }
    i++
  }
}

export function add(a: SnailfishNumber, b: SnailfishNumber, debug = false): SnailfishNumber {
  const sum = {
    left: a,
    right: b,
  }
  if (debug) {
    console.info('after addition:', format(sum))
  }
  return reduce(sum, debug)
}

function reduce(x: SnailfishNumber, debug = false): SnailfishNumber {
  let wasUpdated = true
  while (wasUpdated) {
    wasUpdated = false
    let i = 0
    for (const [parent, location, depth, grandparent, parentLocation] of traversePreorder(x)) {
      if (location === 'left' && _.isNumber(parent.right) && depth >= 5) {
        // explode
        incrementByAt(x, parent.left as number, i - 1)
        incrementByAt(x, parent.right as number, i + 2)
        grandparent![parentLocation!] = 0
        if (debug) {
          console.info('after explode:', format(x))
        }
        wasUpdated = true
        break
      }
      i++
    }

    if (wasUpdated) continue

    i = 0
    for (const [parent, location] of traversePreorder(x)) {
      if (parent[location] > 9) {
        // split
        const value = parent[location] as number
        parent[location] = {
          left: Math.floor(value / 2),
          right: Math.ceil(value / 2),
        }
        if (debug) {
          console.info('after split:', format(x))
        }
        wasUpdated = true
        break
      }
      i++
    }
  }
  return x
}

function magnitude(x: SnailfishNumber | number): number {
  if (_.isNumber(x)) return x
  return 3 * magnitude(x.left) + 2 * magnitude(x.right)
}

export function format(x: SnailfishNumber | number): string {
  if (_.isNumber(x)) return `${x}`
  return `[${format(x.left)},${format(x.right)}]`
}

export function part1(numbers: SnailfishNumber[], debug = true) {
  const sum = _.cloneDeep(numbers).reduce((x, y) => add(x, y, debug))
  if (debug) {
    console.info('sum:', format(sum))
  }
  return magnitude(sum)
  return NaN
}

export function part2(numbers: SnailfishNumber[], debug = true) {
  let largestMagnitude = -Infinity
  for (const [x, y] of pairPermutations(numbers)) {
    if (_.isEqual(x, y)) continue

    const mag = magnitude(add(_.cloneDeep(x), _.cloneDeep(y), debug))
    if (mag > largestMagnitude) {
      if (debug) {
        console.info(format(x), '+', format(y), `magnitude: ${mag}`)
      }
      largestMagnitude = mag
    }
  }
  return largestMagnitude
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
