import _ from 'lodash'

export type Input = {
  inputSignals: SegmentSet[]
  outputSignals: SegmentSet[]
}

export function parseInput(s: string): Input[] {
  const INPUT = /^([abcdefg\s]+)\|([abcdefg\s]+)$/

  return s.split(/\r?\n/)
    .flatMap(x => {
      const match = INPUT.exec(x)
      if (!match) return []
      return [{
        inputSignals: match[1]?.trim().split(/\s+/).map(s => new SegmentSet(s)),
        outputSignals: match[2]?.trim().split(/\s+/).map(s => new SegmentSet(s)),
      }]
    })
}

type Segment = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

class SegmentSet extends Set<Segment> {
  constructor(s: string | Segment[]) {
    super(_.isString(s) ? s.split('') as Segment[] : s)
  }

  get numSegments() { return this.size }

  isEqual(other: SegmentSet) {
    return this.size === other.size
      && Array.from(this).every(e => other.has(e))
  }

  intersection(other: SegmentSet) {
    return new SegmentSet(Array.from(this).filter(e => other.has(e)))
  }

  diff(other: SegmentSet) {
    return new SegmentSet(Array.from(this).filter(e => !other.has(e)))
  }

  union(other: SegmentSet) {
    return new SegmentSet([...this.values(), ...other.values()])
  }

  symmetricDiff(other: SegmentSet) {
    const union = this.union(other)
    const intersection = this.intersection(other)
    return union.diff(intersection)
  }

  toString() {
    return Array.from(this).sort().join('')
  }
}

export function part1(data: Input[]) {
  return _.chain(data)
    .flatMap(({ outputSignals }) => outputSignals)
    .flatMap(signal => [2, 3, 4, 7].includes(signal.numSegments) ? [signal] : [])
    .value()
    .length
}

export function part2(data: Input[]) {
  return _.chain(data)
    .map(({ inputSignals: signals, outputSignals }) => {
      const _1 = signals.find(s => s.numSegments === 2)!
      const _4 = signals.find(s => s.numSegments === 4)!
      const _7 = signals.find(s => s.numSegments === 3)!
      const _8 = signals.find(s => s.numSegments === 7)!
      const _235 = signals.filter(s => s.numSegments === 5)
      const _069 = signals.filter(s => s.numSegments === 6)
      const [[_3], _25] = _.partition(_235, s => _1.diff(s).numSegments === 0)
      const [[_6], _09] = _.partition(_069, s => _1.diff(s).numSegments === 1)
      const [[_2], [_5]] = _.partition(_25, s => s.union(_4).isEqual(_8))
      const [[_9], [_0]] = _.partition(_09, s => s.intersection(_3).isEqual(_3))

      const decoder = Object.fromEntries([
        [_0, 0],
        [_1, 1],
        [_2, 2],
        [_3, 3],
        [_4, 4],
        [_5, 5],
        [_6, 6],
        [_7, 7],
        [_8, 8],
        [_9, 9],
      ])

      return _.toNumber(
        outputSignals
          .map(outputSignal => decoder[`${outputSignal}`])
          .join('')
      )
    })
    .reduce(_.add)
    .value()
}
