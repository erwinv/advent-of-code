import { parseInput, part1, part2 } from '../14'

const example = parseInput(`
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`)

test('2021 day 14 part 1', () => {
  expect(part1(example)).toBe(1588)
})

test('2021 day 14 part 2', () => {
  expect(part2(example)).toBe(2188189693529)
})
