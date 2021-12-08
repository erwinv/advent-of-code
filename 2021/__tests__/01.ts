import { parseInput, Input, part1, part2 } from '../01'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '01'))
})

test('2021 day 01 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`1215`)
})

test('2021 day 01 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`1150`)
})
