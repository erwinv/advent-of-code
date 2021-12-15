import _ from 'lodash'
import { getInput } from '../api'

type Input = number[]

export function parseInput(s: string): Input {
  return s.split(',')
    .flatMap(x => /\d+/.test(x) ? [_.toNumber(x)] : [])
}

type FuelCalculation = (pos1: number, pos2: number) => number

export function part1(data: Input, fuelCalculation: FuelCalculation = (x, y) => Math.abs(x - y)) {
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

export function part2(data: Input) {
  return part1(data, (x, y) => {
    const distance = Math.abs(x-y)
    return (distance * (distance + 1)) / 2
  })
}

async function solve() {
  const input = parseInput(await getInput('2021', __filename))
  console.info(part1(input))
  console.info(part2(input))
}

if (require.main === module) {
  solve()
}
