import { parseInput, part1, part2 } from '../02'

const example = parseInput(`
forward 5
down 5
forward 8
up 3
down 8
forward 2
`)


test('2021 day 02 part 1', () => {
  expect(part1(example)).toBe(150)
})

test('2021 day 02 part 2', () => {
  expect(part2(example)).toBe(900)
})
