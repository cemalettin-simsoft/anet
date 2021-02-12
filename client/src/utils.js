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

const IN_MINS = 2
const REPORT_TIME_OUT_IN_MS = IN_MINS * 60 * 1000

export function reportTimedOut(reportData, timeOutDur = REPORT_TIME_OUT_IN_MS) {
  if (!reportData?.createdAt) {
    throw new Error("INVALID REPORT DATA")
  }
  const diff = Date.now() - reportData.createdAt
  return diff > timeOutDur
}

export default {
  isNullOrUndefined
}

export function jumpToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" })
}
