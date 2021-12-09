import { parseInput, Input, part1, part2 } from '../09'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '09'))
})

test('2021 day 09 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`498`)
})

test('2021 day 09 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`1071000`)
})