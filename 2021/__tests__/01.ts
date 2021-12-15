import { parseInput, part1, part2 } from '../01'

const example = parseInput(`
199
200
208
210
200
207
240
269
260
263
`)

test('2021 day 01 part 1', () => {
  expect(part1(example)).toBe(7)
})

test('2021 day 01 part 2', () => {
  expect(part2(example)).toBe(5)
})
