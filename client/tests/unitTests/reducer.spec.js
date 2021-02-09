import isEqual from "lodash/isEqual"
import ACTION_TYPES from "../../src/actions"
import { reducer } from "../../src/reducer"

const TEST_INITIAL_STATE = [
  { uuid: 1, description: "one" },
  { uuid: 2, description: "two" },
  { uuid: 3, description: "three" },
  { uuid: 4, description: "four" },
  { uuid: 5, description: "five" }
]

const ADDITION_RESULT = [...TEST_INITIAL_STATE, { uuid: 6, description: "six" }]

const UPDATE_RESULT = [
  { uuid: 1, description: "one" },
  { uuid: 2, description: "two" },
  { uuid: 3, description: "three" },
  { uuid: 4, description: "FOUR" },
  { uuid: 5, description: "five" }
]

const DELETE_REPORT_RESULT = [
  { uuid: 1, description: "one" },
  { uuid: 2, description: "two" },
  { uuid: 3, description: "three" },
  { uuid: 5, description: "five" }
]
// Assume all even numbered are timed out
const DELETE_TIMED_OUT_REPORT_RESULT = [
  { uuid: 1, description: "one" },
  { uuid: 3, description: "three" },
  { uuid: 5, description: "five" }
]

describe("In our reducer function", () => {
  it("Should correctly return new state with ADD_NEW_REPORT action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.ADD_NEW_REPORT,
      payload: { uuid: 6, description: "six" }
    })

    expect(isEqual(newState, ADDITION_RESULT)).toBe(true)
  })
  it("Should correctly return new state with UPDATE_REPORT action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.UPDATE_REPORT,
      payload: { uuid: 4, description: "FOUR" }
    })

    expect(isEqual(newState, UPDATE_RESULT)).toBe(true)
  })
  it("Should correctly return new state with DELETE_REPORT action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.DELETE_REPORT,
      payload: 4
    })

    expect(isEqual(newState, DELETE_REPORT_RESULT)).toBe(true)
  })
  it("Should correctly return new state with DELETE_TIMED_OUT_REPORTS action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.DELETE_TIMED_OUT_REPORTS,
      // Payload is deleted uuid array
      payload: [2, 4]
    })
    expect(isEqual(newState, DELETE_TIMED_OUT_REPORT_RESULT)).toBe(true)
  })
  it("Should correctly return new state with DELETE_ALL_REPORTS action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.DELETE_ALL_REPORTS
      // No payload required to delete all
    })

    expect(isEqual(newState, [])).toBe(true)
  })
})
