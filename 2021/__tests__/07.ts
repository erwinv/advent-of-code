import { parseInput, part1, part2 } from '../07'

const example = parseInput(`
16,1,2,0,4,2,7,1,2,14
`)

test('2021 day 07 part 1', () => {
  expect(part1(example)).toBe(37)
})

test('2021 day 07 part 2', () => {
  expect(part2(example)).toBe(168)
})
