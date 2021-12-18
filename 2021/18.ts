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

function* traverseInorder(x: SnailfishNumber, depth = 0, parent?: SnailfishNumber, location?: 'left' | 'right')
  : Generator<[
      parent: SnailfishNumber, location: 'left' | 'right', depth: number,
      grandparent?: SnailfishNumber, parentLocation?: 'left' | 'right'
    ], void>
{
  const { left, right } = x

  if (_.isNumber(left)) {
    yield [x, 'left', depth + 1, parent, location]
  } else {
    yield* traverseInorder(left, depth + 1, x, 'left')
  }

  if (_.isNumber(right)) {
    yield [x, 'right', depth + 1, parent, location]
  } else {
    yield* traverseInorder(right, depth + 1, x, 'right')
  }
}

function incrementByAt(x: SnailfishNumber, increment: number, index: number) {
  if (index < 0) return
  let i = 0
  for (const [parent, location] of traverseInorder(x)) {
    if (i === index) {
      const value = parent[location] as number
      parent[location] = value + increment
      return
    }
    i++
  }
}

export function add(x: SnailfishNumber, y: SnailfishNumber): SnailfishNumber {
  return reduce({ left: x, right: y })
}

function reduce(x_: SnailfishNumber): SnailfishNumber {
  const x = _.cloneDeep(x_)

  let wasUpdated = true
  while (wasUpdated) {
    wasUpdated = false
    let i = 0
    for (const [parent, location, depth, grandparent, parentLocation] of traverseInorder(x)) {
      if (location === 'left' && _.isNumber(parent.right) && depth >= 5) {
        // explode
        incrementByAt(x, parent.left as number, i - 1)
        incrementByAt(x, parent.right as number, i + 2)
        grandparent![parentLocation!] = 0
        wasUpdated = true
        break
      }
      i++
    }

    if (wasUpdated) continue

    i = 0
    for (const [parent, location] of traverseInorder(x)) {
      if (parent[location] > 9) {
        // split
        const value = parent[location] as number
        parent[location] = {
          left: Math.floor(value / 2),
          right: Math.ceil(value / 2),
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
  const sum = numbers.reduce(add)
  if (debug) {
    console.info('sum:', format(sum))
  }
  return magnitude(sum)
}

export function part2(numbers: SnailfishNumber[], debug = true) {
  let largestMagnitude = -Infinity
  for (const [x, y] of pairPermutations(numbers)) {
    if (_.isEqual(x, y)) continue

    const sum = add(x, y)
    const mag = magnitude(sum)
    if (mag > largestMagnitude) {
      if (debug) {
        console.info(' ', format(x), '\n+', format(y), '\n=', format(sum), `\nmagnitude: ${mag}`)
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
