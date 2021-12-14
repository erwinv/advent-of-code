import { parseInput, Input, part1, part2 } from '../14'
// import { getInput } from '../../api'

// let data: Input
const example: Input = parseInput(`
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

beforeAll(async () => {
  // data = parseInput(await getInput('2021', '14'))
})

test('2021 day 14 part 1', () => {
  expect(part1(example)).toBe(1588)
  // expect(part1(data)).toMatchInlineSnapshot(`2584`)
})

test('2021 day 14 part 2', () => {
  expect(part2(example)).toBe(2188189693529)
  // expect(part2(data)).toMatchInlineSnapshot(`3816397135460`)
})

