import { parseInput, Input, part1, part2 } from '../11'
import { getInput } from '../../api'

let data: Input[]
const example: Input[] = parseInput(
`5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526`)

beforeAll(async () => {
  data = parseInput(await getInput('2021', '11'))
})

test('2021 day 11 part 1', () => {
  expect(part1(example)).toBe(1656)
  expect(part1(data)).toMatchInlineSnapshot(`1749`)
})

test('2021 day 11 part 2', () => {
  expect(part2(example)).toBe(195)
  expect(part2(data)).toMatchInlineSnapshot(`285`)
})

