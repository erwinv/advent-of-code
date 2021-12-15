import { parseInput, part1, part2 } from '../05'

const example = parseInput(`
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`)

test('2021 day 05 part 1', () => {
  expect(part1(example)).toBe(5)
})

test('2021 day 05 part 2', () => {
  expect(part2(example)).toBe(12)
})
