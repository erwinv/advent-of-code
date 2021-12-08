import { parseInput, Input, part1, part2 } from '../05'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '05'))
})

test('2021 day 05 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`5197`)
})

test('2021 day 05 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`18605`)
})
