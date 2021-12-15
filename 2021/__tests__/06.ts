import { parseInput, part1, part2 } from '../06'

const example = parseInput(`
3,4,3,1,2
`)

test('2021 day 06 part 1', () => {
  expect(part1(example, 18)).toBe(26)
  expect(part1(example, 80)).toBe(5934)
})

test('2021 day 06 part 2', () => {
  expect(part2(example)).toBe(26984457539)
})
