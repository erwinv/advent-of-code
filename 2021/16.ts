import _ from 'lodash'
import { getInput } from '../api'
import chalk from 'chalk'

export type Input = string

export function parseInput(s: string): Input {
  const INPUT = /(\w+)/
  return s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [
        match[1]
      ]
    })
    .join('')
}

interface Packet {
  version: number
  typeId: number
}

interface Literal extends Packet {
  type: 'literal'
  value: number
}

const OPERATIONS = {
  [0]: 'sum',
  [1]: 'product',
  [2]: 'minimum',
  [3]: 'maximum',
  [5]: 'greaterThan',
  [6]: 'lessThan',
  [7]: 'equalTo',  
} as const

interface Operator extends Packet {
  type: 'operator'
  typeId: number
  operation: typeof OPERATIONS[keyof typeof OPERATIONS]
  lengthType: 'bits' | 'packets'
  length: number
  subpackets: Array<Literal | Operator>
}

function parsePacket(bits: string): readonly [Literal | Operator, string] {
  const versionBits = bits.substring(0, 3)
  const typeIdBits = bits.substring(3, 6)

  const version = parseInt(versionBits, 2)
  const typeId = parseInt(typeIdBits, 2)

  // literal
  if (typeId === 4) {
    const payload = bits.substring(6).split('')
    let valueBits = ''

    let parserIndex = 6
    while (payload.length > 0) {
      const keepGoing = payload.shift() === '1'
      valueBits += payload.splice(0, 4).join('')
      parserIndex += 5
      if (!keepGoing) break
    }

    const remainingBits = bits.substring(parserIndex)

    console.info(
      chalk.bgRed(versionBits) +
      chalk.bgBlue(typeIdBits) +
      chalk.bgGreen(valueBits) +
      chalk.bgGray(remainingBits)
    )

    return [{
      version,
      typeId,
      type: 'literal',
      value: parseInt(valueBits, 2),
    } as Literal,
      remainingBits
    ] as const
  }

  // operator
  const lengthTypeId = parseInt(bits.at(6)!, 2)
  const lengthType = lengthTypeId === 0 ? 'bits' : 'packets'
  const lengthBits = lengthType === 'bits'
    ? bits.substring(7, 7+15)
    : bits.substring(7, 7+11)
  const length = parseInt(lengthBits, 2)
  const subpacketsBits = lengthType === 'bits'
    ? bits.substring(7+15, 7+15+length)
    : bits.substring(7+11)

  const [subpackets, remaining] = parsePackets(subpacketsBits, lengthType, length)

  const remainingBits = lengthType === 'bits'
    ? bits.substring(7+15+length)
    : remaining

  console.info(
    chalk.bgRed(versionBits) +
    chalk.bgBlue(typeIdBits) +
    chalk.bgCyan(bits.at(6)) +
    chalk.bgMagenta(lengthBits) +
    chalk.bgGreen(subpacketsBits) +
    chalk.bgGray(remainingBits)
  )

  return [{
    version,
    typeId,
    type: 'operator',
    operation: OPERATIONS[typeId as keyof typeof OPERATIONS],
    lengthType,
    length,
    subpackets,
  } as Operator,
    remainingBits
  ] as const
}

function parsePackets(bits: string, lengthType: Operator['lengthType'], length: number) {
  const subpackets = [] as Array<Literal|Operator>
  let remaining = bits

  switch (lengthType) {
    case 'bits':
      while (remaining !== '') {
        const [packet, remaining_] = parsePacket(remaining)
        subpackets.push(packet)
        remaining = remaining_
      }
      break
    case 'packets':
      for (const __ of _.range(length)) {
        const [packet, remaining_] = parsePacket(remaining)
        subpackets.push(packet)
        remaining = remaining_
      }
  }

  return [subpackets, remaining] as const
}

export function parseTransmission(hex: string): Literal | Operator {
  let bits = ''
  for (const digit of hex) {
    bits += _.padStart(parseInt(digit, 16).toString(2), 4, '0')
  }
  console.info(hex, bits)
  const [packet] = parsePacket(bits)
  console.info(JSON.stringify(packet, null, 2))
  return packet
}

function foldLeft<T>(
  tree: Literal | Operator,
  folder: (acc: T, next: Literal | Operator) => T,
  acc: T
): T {
  if (tree.type === 'operator') {
    for (const packet of tree.subpackets) {
      acc = foldLeft(packet, folder, acc)
    }
  }

  return folder(acc, tree)
}

function foldRecursive<T>(
  tree: Literal | Operator,
  literalMapper: (x: Literal) => T,
  operatorFolder: (x: Operator) => (...xs: T[]) => T
): T {
  if (tree.type === 'literal') {
    return literalMapper(tree)
  }

  const sutbreeValues = tree.subpackets
    .map(subtree => foldRecursive(subtree, literalMapper, operatorFolder))

  return operatorFolder(tree)(...sutbreeValues)
}

export function part1(data: Input) {
  const packet = parseTransmission(data)
  const sumVersions = foldLeft(packet, (x, packet) => x + packet.version, 0)
  return sumVersions
}

export function part2(data: Input) {
  const packet = parseTransmission(data)
  return foldRecursive(packet,
    ({ value }) => value,
    ({ operation }) => {
      switch (operation) {
        case 'sum':     return (...xs) => xs.reduce(_.add)
        case 'product': return (...xs) => xs.reduce(_.multiply)
        case 'minimum': return Math.min
        case 'maximum': return Math.max
        case 'greaterThan': return (x1, x2) => (x1 > x2) ? 1 : 0
        case 'lessThan': return (x1, x2) => x1 < x2 ? 1 : 0
        case 'equalTo': return (x1, x2) => x1 === x2 ? 1 : 0
      }
    }
  )
}

async function solve() {
  const input = parseInput(await getInput('2021', __filename))
  console.info(part1(input))
  console.info(part2(input))
}

if (require.main === module) {
  solve()
}
