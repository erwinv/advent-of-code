import _ from 'lodash'

type Input = string[]

export function parseInput(s: string): Input {
  const INPUT = /(\w+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        match[1]
      ]
    })
}

export function part1(data: Input, debug = true) {
  return data
}

export function part2(data: Input, debug = true) {
  return data
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
