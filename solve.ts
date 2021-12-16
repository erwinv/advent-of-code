import 'dotenv-safe/config'
import _ from 'lodash'
import { getInput } from './api'

import * as _2021 from './2021'

const [,, year, day_, debug_=''] = process.argv
const day = _.padStart(day_, 2, '0')
const debug = debug_.toLowerCase() === '-d'

const solutions = {
  '2021': {
    '01': _2021._01,
    '02': _2021._02,
    '03': _2021._03,
    '04': _2021._04,
    '05': _2021._05,
    '06': _2021._06,
    '07': _2021._07,
    '08': _2021._08,
    '09': _2021._09,
    '10': _2021._10,
    '11': _2021._11,
    '12': _2021._12,
    '13': _2021._13,
    '14': _2021._14,
    '15': _2021._15,
    '16': _2021._16,
  },
}

function validateYear(x: string): x is keyof typeof solutions {
  return Object.keys(solutions).includes(x)
}

if (!validateYear(year)) {
  throw new Error(`Invalid year: ${year}`)
}

const yr = solutions[year]

function validateDay(x: string): x is keyof typeof yr {
  return Object.keys(yr).includes(x)
}

if (!validateDay(day)) {
  throw new Error(`Invalid day: ${day}`)
}

const solver = yr[day]

getInput(year, day)
  .then(input => {
    const solverStep = solver.solve(input, debug)

    let start = performance.now()
    const parsedInput = solverStep.next().value
    let end = performance.now()

    console.info(`parsed input:\n${parsedInput}`)
    console.info(`time: ${(end - start).toFixed(2)}ms\n`)

    start = performance.now()
    const answer1 = solverStep.next().value
    end = performance.now()

    console.info(`part 1 answer:\n${answer1}`)
    console.info(`time: ${(end - start).toFixed(2)}ms\n`)

    start = performance.now()
    const answer2 = solverStep.next().value
    end = performance.now()

    console.info(`part 2 answer:\n${answer2}`)
    console.info(`time: ${(end - start).toFixed(2)}ms\n`)
  })
