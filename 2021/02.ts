import _ from 'lodash'

type Direction = 'forward' | 'up' | 'down'
interface Position {
  horizontal: number
  depth: number
  aim?: number
}

type Input = Array<readonly [Direction, number]>

export function parseInput(s: string): Input {
  const DIRECTION_MAGNITUDE = /(forward|down|up)\s+(\d+)/

  return s.split(/\r?\n/)
    .flatMap(x => {
      const match = DIRECTION_MAGNITUDE.exec(x)
      if (!match) return []
      return [[match[1] as Direction, _.toNumber(match[2])] as const]
    })
}

export function part1(data: Input, debug = true) {
  const finalPosition = data.reduce(({ horizontal, depth }, [direction, magnitude]) => {

    let newHorizontal = horizontal
    let newDepth = depth

    switch (direction) {
      case 'down':    newDepth += magnitude; break
      case 'up':      newDepth -= magnitude; break
      case 'forward': newHorizontal += magnitude
    }

    return {
      horizontal: newHorizontal,
      depth: newDepth,
    }
  }, {
    horizontal: 0,
    depth: 0,
  } as Position)

  return finalPosition.horizontal * finalPosition.depth
}

export function part2(data: Input, debug = true) {
  const finalPosition = data.reduce(({ horizontal, depth, aim }, [direction, magnitude]) => {

    let newHorizontal = horizontal
    let newDepth = depth
    let newAim = aim

    switch (direction) {
      case 'down':  newAim += magnitude; break
      case 'up':    newAim -= magnitude; break
      case 'forward':
        newHorizontal += magnitude
        newDepth += aim * magnitude
    }

    return {
      horizontal: newHorizontal,
      depth: newDepth,
      aim: newAim,
    }
  }, {
    horizontal: 0,
    depth: 0,
    aim: 0,
  } as Required<Position>)

  return finalPosition.horizontal * finalPosition.depth
}

export function* solve(input: string, debug = false) {
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
