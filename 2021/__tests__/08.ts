import { parseInput, Input, part1, part2 } from '../08'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '08'))
})

test('2021 day 08 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`301`)
})

test('2021 day 08 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`908067`)
})
