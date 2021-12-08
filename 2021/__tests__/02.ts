import { parseInput, Input, part1, part2 } from '../02'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '02'))
})

test('2021 day 02 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`1636725`)
})

test('2021 day 02 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`1872757425`)
})
