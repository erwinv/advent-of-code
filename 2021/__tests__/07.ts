import { parseInput, Input, part1, part2 } from '../07'
import { getInput } from '../../api'

let data: Input[]

beforeAll(async () => {
  data = parseInput(await getInput('2021', '07'))
})

test('2021 day 07 part 1', () => {
  expect(part1(data)).toMatchInlineSnapshot(`344138`)
})

test('2021 day 07 part 2', () => {
  expect(part2(data)).toMatchInlineSnapshot(`94862124`)
})
