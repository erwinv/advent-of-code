import _ from 'lodash'
import { getInput } from './api'

export type Input = string[]

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

export function part1(data: Input) {
  return data
}

export function part2(data: Input) {
  return data
}

async function solve() {
  const input = parseInput(await getInput('2021', __filename))
  console.info(part1(input))
  console.info(part2(input))
}

if (require.main === module) {
  solve()
}
