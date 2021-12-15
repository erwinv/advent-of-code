import { parseInput, part1, part2 } from '../12'

const examples = [
`start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
`dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
`fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`
].map(parseInput)

test('2021 day 12 part 1', () => {
  expect(part1(examples[0])).toBe(10)
  expect(part1(examples[1])).toBe(19)
  expect(part1(examples[2])).toBe(226)
})

test('2021 day 12 part 2', () => {
  expect(part2(examples[0])).toBe(36)
  expect(part2(examples[1])).toBe(103)
  expect(part2(examples[2])).toBe(3509)
})

