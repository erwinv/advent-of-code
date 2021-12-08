import { parseInput, Input, part1, part2 } from '../04'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '04'))
})

test('2021 day 04 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`25023`)
})

test('2021 day 04 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`2634`)
})
