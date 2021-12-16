import _ from 'lodash'

type Input = number[]

export function parseInput(s: string): Input {
  return s.split(',')
    .flatMap(x => /\d+/.test(x) ? [_.toNumber(x)] : [])
}

type FuelCalculation = (pos1: number, pos2: number) => number

export function part1(data: Input, fuelCalculation: FuelCalculation = (x, y) => Math.abs(x - y), debug = false) {
  const counts = _.chain(data)
    .countBy(_.identity)
    .entries()
    .map(([posStr, count]) => ({ position: _.toNumber(posStr), count }))
    .value()

  const minPos = _.min(counts.map(({ position }) => position))!
  const maxPos = _.max(counts.map(({ position }) => position))!

  const fuelConsumptions = _.range(minPos, maxPos + 1).map(position => {
    return {
      position,
      fuel: counts
        .map(other => fuelCalculation(other.position, position) * other.count)
        .reduce(_.add)
    }
  })

  return _.min(fuelConsumptions.map(({ fuel }) => fuel))
}

export function part2(data: Input, debug = true) {
  return part1(data, (x, y) => {
    const distance = Math.abs(x-y)
    return (distance * (distance + 1)) / 2
  })
}

export function* solve(input: string, debug = false) {
  const data = parseInput(input)
  yield data
  yield part1(data, undefined, debug)
  yield part2(data, debug)
}
