import _ from 'lodash'
import chalk from 'chalk'
import { MappedSet } from '../lib'

interface Range {
  min: number
  max: number
}

interface RectArea {
  x: Range
  y: Range
}

export function parseInput(s: string): OceanTrench {
  const INPUT = /target area: x=(\d+)..(\d+), y=(-?\d+)..(-?\d+)/
  return new OceanTrench(s.split(/\r?\n/)
    .flatMap(line => {
      const match = INPUT.exec(line)
      if (!match) return []
      return [{
        x: {
          min: _.toNumber(match[1]),
          max: _.toNumber(match[2]),
        },
        y: {
          min: _.toNumber(match[3]),
          max: _.toNumber(match[4]),
        },
      }]
    })[0])
}

interface Velocity {
  vx: number
  vy: number
}
type VelocityKey = `${number},${number}`

interface Pos {
  x: number
  y: number
}
type PosKey = `${number},${number}`

class ProbePositions extends MappedSet<Pos, PosKey> {
  map(pos: Pos) {
    return `${pos.x},${pos.y}` as const
  }
  inverseMap(posKey: PosKey): Pos {
    const [x, y] = posKey.split(',').map(_.toNumber)
    return {x, y}
  }
}
class VelocitySet extends MappedSet<Velocity, VelocityKey> {
  map(v: Velocity) {
    return `${v.vx},${v.vy}` as const
  }
  inverseMap(vKey: VelocityKey): Velocity {
    const [vx, vy] = vKey.split(',').map(_.toNumber)
    return {vx, vy}
  }
}

class OceanTrench {
  constructor(public target: RectArea) {}

  withinTarget(x: number, y: number) {
    return this.target.x.min <= x && x <= this.target.x.max
      && this.target.y.min <= y && y <= this.target.y.max
  }

  probeHitsTarget(vx: number, vy: number): [boolean, ProbePositions] {
    const probePositions = new ProbePositions()
    let x = 0, y = 0

    while (x <= this.target.x.max && y >= this.target.y.min) {
      x += vx
      y += vy
      vx += (vx > 0 ? -1 : vx < 0 ? 1 : 0)
      vy -= 1
      probePositions.add({ x, y })

      if (this.withinTarget(x, y)) {
        return [true, probePositions]
      }
    }

    return [false, probePositions]
  }

  probeInitialVelocitiesThatHitTarget(debug = false) {
    const maxVx = this.target.x.max
    const minVy = this.target.y.min
    const maxVy = -minVy // could be higher???
    
    let initialVelocitiesThatHitTarget = [] as Array<Velocity & { maxY: number }>
    for (const vx of _.range(1, maxVx + 1, 1)) {
      for (const vy of _.range(maxVy, minVy - 1, -1)) {
        const [doesHit, positions] = this.probeHitsTarget(vx, vy)
        const maxY = _.max([...positions].map(({ y }) => y))!

        if (doesHit) {
          if (debug) {
            console.info(this.toString(positions))
          }
          initialVelocitiesThatHitTarget.push({ vx, vy, maxY })
        }
      }
    }

    return initialVelocitiesThatHitTarget
  }

  toString(probePositions: ProbePositions = new ProbePositions()) {
    let minX = 0, maxX = this.target.x.max
    let maxY = 0, minY = this.target.y.min
    for (const pos of probePositions) {
      if (pos.x < minX) minX = pos.x
      else if (pos.x > maxX) maxX = pos.x
      if (pos.y < minY) minY = pos.y
      else if (pos.y > maxY) maxY = pos.y
    }

    let out = ''
    for (const y of _.range(maxY, minY - 1, -1)) {
      for (const x of _.range(minX, maxX + 1, 1)) {
        const tile = (x === 0 && y === 0)
          ? chalk.bgRed('S')
          : probePositions.has({x, y})
          ? chalk.bgBlue('#')
          : this.withinTarget(x, y)
          ? chalk.bgGreen('T')
          : chalk.bgGray('.')
        out += tile
      }
      out += '\n'
    }
    return out
  }
  toJSON() {
    return this.toString()
  }
}

export function part1(trench: OceanTrench, debug = true) {
  const velocities = trench.probeInitialVelocitiesThatHitTarget(debug)
  return _.max(velocities.map(({ maxY }) => maxY))
}

export function part2(trench: OceanTrench, debug = true) {
  const velocities = trench.probeInitialVelocitiesThatHitTarget(debug)
  if (debug) {
    console.info(velocities.map(({vx, vy}) => `${vx},${vy}`))
  }
  return velocities.length
}

export function part2_1(trench: OceanTrench, debug = true) {
  const velocities = trench.probeInitialVelocitiesThatHitTarget(debug)
  return velocities.map(({vx, vy}) => `${vx},${vy}`)
}

export function* solve(input: string, debug = false) {
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
