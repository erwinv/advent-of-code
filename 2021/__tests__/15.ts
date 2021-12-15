import { parseInput, part1, part2 } from '../15'

const example = parseInput(`
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`)

test('2021 day 15 part 1', () => {
  expect(part1(example)).toBe(40)
})

test('2021 day 15 part 2', () => {
  expect(part2(example)).toBe(315)
})
