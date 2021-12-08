import _ from 'lodash'

export type Input = number

export function parseInput(s: string): Input[] {
  return s.split(',')
    .flatMap(x => /\d+/.test(x) ? [_.toNumber(x)] : [])
}

type FuelCalculation = (pos1: number, pos2: number) => number

export function part1(data: Input[], fuelCalculation: FuelCalculation = (x, y) => Math.abs(x - y)) {
  return _.chain(data)
    .sort()
    .countBy(_.identity)
    .entries()
    .map(([posStr, count]) => ({ position: _.toNumber(posStr), count }))
    .map(({ position }, i, all) => {
      const others = [...all as {position: number, count: number}[]]
      others.splice(i, 1)
      return others
        .map(other => fuelCalculation(other.position, position) * other.count)
        .reduce(_.add)
    })
    .min()
    .value()
}

export function part2(data: Input[]) {
  return part1(data, (x, y) => {
    const distance = Math.abs(x-y)
    return (distance * (distance + 1)) / 2
  })
}
