import { parseInput, Input, part1, part2 } from '../13'
import { getInput } from '../../api'

let data: Input[]
const example: Input[] = parseInput(`
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`)

beforeAll(async () => {
  data = parseInput(await getInput('2021', '13'))
})

test('2021 day 13 part 1', () => {
  expect(part1(example)).toBe(17)
  expect(part1(data)).toMatchInlineSnapshot(`765`)
})

test('2021 day 13 part 2', () => {
  expect(part2(example)).toMatchInlineSnapshot(`
"#####
#...#
#...#
#...#
#####
.....
....."
`)
  expect(part2(data)).toMatchInlineSnapshot(`
"###..####.#..#.####.#....###...##..#..#.
#..#....#.#.#.....#.#....#..#.#..#.#..#.
#..#...#..##.....#..#....#..#.#....####.
###...#...#.#...#...#....###..#.##.#..#.
#.#..#....#.#..#....#....#....#..#.#..#.
#..#.####.#..#.####.####.#.....###.#..#."
`)
})

