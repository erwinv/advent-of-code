import { parseInput, Input, part1, part2 } from '../03'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '03'))
})

test('2021 day 03 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`3985686`)
})

test('2021 day 03 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`2555739`)
})
