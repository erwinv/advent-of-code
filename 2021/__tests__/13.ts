import { parseInput, part1, part2 } from '../13'
import stripAnsi from 'strip-ansi'

const example = parseInput(`
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

test('2021 day 13 part 1', () => {
  expect(part1(example)).toBe(17)
})

test('2021 day 13 part 2', () => {
  expect(stripAnsi(part2(example))).toBe(
`#####
#...#
#...#
#...#
#####
.....
.....`
)
})
