import { parseInput, part1, part2 } from '../03'

const example = parseInput(`
00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010
`)

test('2021 day 03 part 1', () => {
  expect(part1(example)).toBe(198)
})

test('2021 day 03 part 2', () => {
  expect(part2(example)).toBe(230)
})
