import { parseInput, part1, part2 } from '../09'

const example = parseInput(`
2199943210
3987894921
9856789892
8767896789
9899965678
`)

test('2021 day 09 part 1', () => {
  expect(part1(example)).toBe(15)
})

test('2021 day 09 part 2', () => {
  expect(part2(example)).toBe(1134)
})
