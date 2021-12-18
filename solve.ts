import 'dotenv-safe/config'
import _ from 'lodash'
import chalk from 'chalk'
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
    '17': _2021._17,
    '18': _2021._18,
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

if (!validateDay(day) && day !== 'all') {
  throw new Error(`Invalid day: ${day}`)
}

function withPerformanceMeasurement<Ret>(fn: (...args: unknown[]) => Ret) {
  const start = performance.now()
  const ret = fn()
  const end = performance.now()

  const ms = end - start
  const colorFmt = ms < 200 ? chalk.green
    : ms < 600 ? chalk.hex('#FFFF00') // yellow
    : ms < 1000 ? chalk.hex('#FFA500') // orange
    : chalk.red
  
  return [ret, colorFmt(`${(ms).toFixed(2)}ms`)] as const
}

const runAllDays = day === 'all'
const solvers = runAllDays ? yr : _.pick(yr, day)

;(async function runInSequence() {
  for (const [day, solver] of _.orderBy(Object.entries(solvers), ([day]) => day)) {
    console.info(chalk.whiteBright.bold(`${year} day ${day}`))

    const solverStep = solver.solve(debug)

    const [dir, file] = solverStep.next().value as [string, string]
    const input = await getInput(dir, file)

    const [parsedInput, ms0] = withPerformanceMeasurement(() => solverStep.next(input).value)
    if (!runAllDays) {
      console.info(`[${ms0}] parsed input:`, parsedInput)
    }

    let n = 0
    while (true) {
      const [{value, done}, ms] = withPerformanceMeasurement(() => solverStep.next())
      if (done) break
      console.info(`[${ms}] part ${++n}:`, value)
    }
  }
})()
