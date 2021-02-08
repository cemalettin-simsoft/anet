export const isNullOrUndefined = value => {
  return value === null || value === undefined
}

Object.forEach = function(source, func) {
  return Object.keys(source).forEach(key => {
    func(key, source[key])
  })
}

Object.without = function(source, ...keys) {
  const copy = Object.assign({}, source)
  let i = keys.length
  while (i--) {
    const key = keys[i]
    copy[key] = undefined
    delete copy[key]
  }
  return copy
}

const REPORT_TIME_OUT_IN_MS = 1000 * 60 * 2

export const REPORT_CONTROL_PERIOD_IN_MS = 30_000

export function reportTimedOut(reportData) {
  if (!reportData?.createdAt) {
    console.warn("Timeout calculation without a report or timestamp!")
    console.dir("reportData")
    console.dir(reportData)
    console.dir("reportData.createdAt")
    console.dir(reportData.createdAt)
    return
  }
  const diff = Date.now() - reportData.createdAt
  return diff > REPORT_TIME_OUT_IN_MS
}

export default {
  isNullOrUndefined
}
