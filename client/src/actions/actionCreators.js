import {
  addNewReportData,
  deleteAllReports,
  deleteReportData,
  deleteTimedOutReports,
  updateReport
} from "../clientStorage"
import ACTION_TYPES from "./index"

export function addNewReportAction(payload) {
  if (addNewReportData(payload)) {
    return {
      type: ACTION_TYPES.ADD_NEW_REPORT,
      payload
    }
  }
  return {
    type: ACTION_TYPES.NOOP
  }
}

export function updateReportAction(payload) {
  if (updateReport(payload)) {
    return {
      type: ACTION_TYPES.UPDATE_REPORT,
      payload
    }
  }
  return {
    type: ACTION_TYPES.NOOP
  }
}

export function deleteReportAction(uuid) {
  if (deleteReportData(uuid)) {
    console.log("Deleted reducer")

    return {
      type: ACTION_TYPES.DELETE_REPORT,
      payload: uuid
    }
  }
  return {
    type: ACTION_TYPES.NOOP
  }
}

export function deleteTimedOutReportsAction() {
  const deletedUuids = deleteTimedOutReports()
  if (deletedUuids) {
    return {
      type: ACTION_TYPES.DELETE_TIMED_OUT_REPORTS,
      payload: deletedUuids
    }
  }
  return {
    type: ACTION_TYPES.NOOP
  }
}

export function deleteAllReportsAction() {
  deleteAllReports()
  return {
    type: ACTION_TYPES.DELETE_ALL_REPORTS
  }
}
