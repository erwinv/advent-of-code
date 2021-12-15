import _ from 'lodash'

type Input = number[]

export function parseInput(s: string): Input {
  return s.split(/\r?\n/)
    .flatMap(x => /\d+/.test(x) ? [_.toNumber(x)] : [])
}

export function part1(data: Input) {
  return _.zip(_.initial(data), _.tail(data))
    .filter(([x=0, y=0]) => y > x)
    .length
}

export function part2(data: Input) {
  const n = data.length
  const threeElementWindowAggregateData = _.zip(
    _.slice(data, 0, n - 2),
    _.slice(data, 1, n - 1),
    _.slice(data, 2, n)
  ).map(([x=0, y=0, z=0]) => x + y + z)

  return part1(threeElementWindowAggregateData)
}
