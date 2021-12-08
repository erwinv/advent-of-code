import _ from 'lodash'

export type Input = string

export function parseInput(s: string): Input[] {
  return s.split(/\r?\n/)
    .flatMap(x => /\w+/.test(x) ? [x] : [])
}

export function part1(data: Input[]) {
  return data
}

export function part2(data: Input[]) {
  return data
}
