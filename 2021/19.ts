import _ from 'lodash'
import { combinations, pairPermutations } from '../lib'

export function parseInput(s: string): ScannerReport[] {
  const REPORT_HEADER = /--- scanner (\d+) ---/
  const BEACON_LOCATION = /(-?\d+),(-?\d+),(-?\d+)/

  const lines = s.split(/\r?\n/)
    .flatMap(line => {
      const match = REPORT_HEADER.exec(line) ?? BEACON_LOCATION.exec(line)
      if (!match) return []

      return [
        REPORT_HEADER.test(line)
          ? Number(match[1])
          : {
            x: Number(match[1]),
            y: Number(match[2]),
            z: Number(match[3]),
          }
      ]
    })

  const scannerReports: ScannerReport[] = []
  for (const line of lines) {
    if (_.isNumber(line)) {
      scannerReports.push({
        id: line,
        beacons: []
      })
    } else {
      scannerReports.at(-1)!.beacons.push(line)
    }
  }
  return scannerReports
}

interface Location {
  x: number
  y: number
  z: number
}
type BasisComponent = -1 | 0 | 1
type RotationMatrix = readonly [
  readonly [BasisComponent, BasisComponent, BasisComponent],
  readonly [BasisComponent, BasisComponent, BasisComponent],
  readonly [BasisComponent, BasisComponent, BasisComponent]
]
type Translation = readonly [xOffset: number, yOffset: number, zOffset: number]
interface Transformation {
  rotation: RotationMatrix
  translation: Translation
}

interface ScannerReport {
  id: number
  location?: Location
  orientation?: RotationMatrix
  beacons: Location[]
}

function reconstructRegion(reports: ScannerReport[]) {
  const pairedReportsIds: Set<number> = new Set()
  const overlappingPairs: Array<{
    left: number
    right: number
    transformation: Transformation
  }> = []

  for (const [report1, report2] of pairPermutations(reports, true)) {
    if (pairedReportsIds.has(report1.id) && pairedReportsIds.has(report2.id))
      continue

    const transformation = tryToOverlap(report1, report2)
    if (transformation) {
      pairedReportsIds.add(report1.id)
      pairedReportsIds.add(report2.id)
      overlappingPairs.push({left: report1.id, right: report2.id, transformation})
    }
  }
}

function tryToOverlap(a: ScannerReport, b: ScannerReport): Transformation | undefined {
  for (const dozenBeaconsA of combinations(a.beacons, 12)) {
    for (const dozenBeaconsB of combinations(b.beacons, 12)) {
      for (const [rotatedB, rotation] of orientations(dozenBeaconsB)) {
        const translation = tryToAlignByTranslation(dozenBeaconsA, rotatedB)
        if (translation) {
          return {rotation, translation}
        }
      }
    }
  }
}

function* orientations(a: Location[]): Iterable<[Location[], RotationMatrix]> {
  const identity = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ] as const
  yield [a, identity]

  // TODO
  // (facing +x) current orientation
  // (face -x) rotate along y/z 2 times
  // (face +y) rotate along z 1 time
  // (face -y) rotate along z 3 times
  // (face +z) rotate along y 1 time
  // (face -z) rotate along y 3 times

  // for every facing orientation
    // rotate along x (4 times)
    // rotate along y (4 times)
    // rotate along z (4 times)
}

function tryToAlignByTranslation(a: Location[], b: Location[]): Translation | undefined {
  // check bounding cube lengths (along x, y, z)
  // if any of the lengths don't match, return (no alignment)

  // translate b so that a and b have the same bounding cube
  // check deep equality of a and translated b
  // if equal, return translation
  return
}

export function part1(reports: ScannerReport[], debug = true) {
  if (debug) console.info(reports)
  return reports
}

export function part2(reports: ScannerReport[], debug = true) {
  return reports
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, debug)
  yield part2(data, debug)
}
