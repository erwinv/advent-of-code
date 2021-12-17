import { part1, part2 } from '../16'
import { parseTransmission } from '../16'

test('2021 day 16 parser', () => {
  expect(parseTransmission('D2FE28')).toMatchObject({
    type: 'literal',
    value: 2021,
  })
  
  expect(parseTransmission('38006F45291200')).toMatchObject({
    type: 'operator',
    subpackets: expect.arrayContaining([
      expect.objectContaining({
        type: 'literal',
        value: 10,
      }),
      expect.objectContaining({
        type: 'literal',
        value: 20,
      }),
    ]),
  })
  
  expect(parseTransmission('EE00D40C823060')).toMatchObject({
    type: 'operator',
    subpackets: expect.arrayContaining([
      expect.objectContaining({
        type: 'literal',
        value: 1,
      }),
      expect.objectContaining({
        type: 'literal',
        value: 2,
      }),
      expect.objectContaining({
        type: 'literal',
        value: 3,
      }),
    ]),
  })
})

test('2021 day 16 part 1', () => {
  expect(part1('D2FE28')).toBe(6)
  expect(part1('38006F45291200')).toBe(9)
  expect(part1('EE00D40C823060')).toBe(14)
  expect(part1('8A004A801A8002F478')).toBe(16)
  expect(part1('620080001611562C8802118E34')).toBe(12)
  expect(part1('C0015000016115A2E0802F182340')).toBe(23)
  expect(part1('A0016C880162017C3686B18A3D4780')).toBe(31)
})

test('2021 day 16 part 2', () => {
  expect(part2('C200B40A82')).toBe(3)
  expect(part2('04005AC33890')).toBe(54)
  expect(part2('880086C3E88112')).toBe(7)
  expect(part2('CE00C43D881120')).toBe(9)
  expect(part2('D8005AC2A8F0')).toBe(1)
  expect(part2('F600BC2D8F')).toBe(0)
  expect(part2('9C005AC2F8F0')).toBe(0)
  expect(part2('9C0141080250320F1802104A08')).toBe(1)
})
