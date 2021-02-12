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

const AFTER_ADDITION = [...TEST_INITIAL_STATE, { uuid: 6, description: "six" }]

const AFTER_UPDATE = [
  { uuid: 1, description: "one" },
  { uuid: 2, description: "two" },
  { uuid: 3, description: "three" },
  { uuid: 4, description: "FOUR" },
  { uuid: 5, description: "five" }
]

const AFTER_DELETE_REPORT = [
  { uuid: 1, description: "one" },
  { uuid: 2, description: "two" },
  { uuid: 3, description: "three" },
  { uuid: 5, description: "five" }
]
// Assume all even numbered are timed out
const AFTER_DELETE_TIMED_OUT_REPORTS = [
  { uuid: 1, description: "one" },
  { uuid: 3, description: "three" },
  { uuid: 5, description: "five" }
]

describe("In reducer function", () => {
  it("Should correctly return new state with ADD_NEW_REPORT action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.ADD_NEW_REPORT,
      payload: { uuid: 6, description: "six" }
    })

    expect(isEqual(newState, AFTER_ADDITION)).toBe(true)
  })
  it("Should correctly return new state with UPDATE_REPORT action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.UPDATE_REPORT,
      payload: { uuid: 4, description: "FOUR" }
    })

    expect(isEqual(newState, AFTER_UPDATE)).toBe(true)
  })
  it("Should correctly return new state with DELETE_REPORT action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.DELETE_REPORT,
      payload: 4
    })

    expect(isEqual(newState, AFTER_DELETE_REPORT)).toBe(true)
  })
  it("Should correctly return new state with DELETE_TIMED_OUT_REPORTS action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.DELETE_TIMED_OUT_REPORTS,
      // Payload is deleted uuid array
      // Assume all even numbered are timed out
      payload: [2, 4]
    })
    expect(isEqual(newState, AFTER_DELETE_TIMED_OUT_REPORTS)).toBe(true)
  })
  it("Should correctly return new state with DELETE_ALL_REPORTS action", () => {
    const newState = reducer(TEST_INITIAL_STATE, {
      type: ACTION_TYPES.DELETE_ALL_REPORTS
      // No payload required to delete all
    })

    expect(isEqual(newState, [])).toBe(true)
  })
})
