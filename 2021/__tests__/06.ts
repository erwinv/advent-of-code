import { parseInput, Input, part1, part2 } from '../06'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '06'))
})

test('2021 day 06 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`389726`)
})

test('2021 day 06 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`1743335992042`)
})
