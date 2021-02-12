import { reportTimedOut } from "utils"

const TIMED_OUT_CASE = {
  reportData: {
    createdAt: Date.now() - 2000
  },
  timeOutDur: 1000 // ms
}

const NOT_TIMED_OUT_CASE = {
  reportData: {
    createdAt: Date.now()
  },
  timeOutDur: 1_000_000 // ms
}

describe("In reportTimedOut util function", () => {
  it("Should return true given a timed out report input", () => {
    const result = reportTimedOut(
      TIMED_OUT_CASE.reportData,
      TIMED_OUT_CASE.timeOutDur
    )
    expect(result).toBe(true)
  })

  it("Should return false given not a timed out report input", () => {
    const result = reportTimedOut(
      NOT_TIMED_OUT_CASE.reportData,
      NOT_TIMED_OUT_CASE.timeOutDur
    )
    expect(result).toBe(false)
  })

  it("Should throw an error if report data is invalid", () => {
    const callback = () => reportTimedOut()
    expect(callback).toThrow("INVALID REPORT DATA")
  })
})
