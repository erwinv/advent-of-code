import _ from 'lodash'

type Input = number[]

export function parseInput(s: string): Input {
  return s.split(',')
    .flatMap(x => /\d+/.test(x) ? [_.toNumber(x)] : [])
}

class School {
  constructor(public timer: number, public numFish: number) {}

  countDown() {
    if (this.timer === 0) {
      this.timer = 6
      return new School(8, this.numFish)
    } else {
      this.timer--
      return null
    }
  }
}

export function part1(data: Input, numDays = 80, debug = false) {
  const schools =  _.chain(data)
    .countBy(_.identity)
    .entries()
    .map(([timerStr, n]) => new School(_.toNumber(timerStr), n))
    .value()

  let newSchools: School[] = []

  for (const __ of _.range(numDays)) {
    for (const newSchool of newSchools) {
      newSchool.countDown()
    }

    for (const school of schools) {
      const newSchool = school.countDown()
      if (newSchool) {
        newSchools.push(newSchool)
      }
    }

    const regularizedSchools = _.remove(newSchools,
      (newSchool) => newSchool.timer <= 6)

    for (const regularizedSchool of regularizedSchools) {
      const school = schools
        .find(school => school.timer === regularizedSchool.timer)
      if (school) {
        school.numFish += regularizedSchool.numFish
      } else {
        schools.push(regularizedSchool)
      }
    }
  }

  return [...schools, ...newSchools]
    .map(school => school.numFish)
    .reduce(_.add)
}

export function part2(data: Input, debug = false) {
  return part1(data, 256, debug)
}

export function* solve(debug = false) {
  const input: string = yield [__dirname, __filename]
  const data = parseInput(input)
  yield data
  yield part1(data, undefined, debug)
  yield part2(data, debug)
}
