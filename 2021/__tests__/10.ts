import { parseInput, Input, part1, part2 } from '../10'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '10'))
})

test('2021 day 10 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`294195`)
})

test('2021 day 10 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`3490802734`)
})
