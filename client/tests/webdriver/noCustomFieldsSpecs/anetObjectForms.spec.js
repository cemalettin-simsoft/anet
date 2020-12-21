// import { expect } from "chai"
import CreateAuthorizationGroup from "../pages/createAuthorizationGroup.page"
import CreatePerson from "../pages/createNewPerson.page"
import CreateTask from "../pages/createNewTask.page"
import CreateOrganization from "../pages/CreateOrganization.page"
import CreateReport from "../pages/createReport.page"
import EditPosition from "../pages/editPosition.page"
import CreateNewLocation from "../pages/location/createNewLocation.page"

// Forms should work just fine without custom fields

describe("When looking at anet object forms with dictionary that doesn't include custom fields", () => {
  it("Should see that report form successfully loads", () => {
    CreateReport.open()
    CreateReport.form.waitForExist()
    CreateReport.form.waitForDisplayed()
  })
  it("Should see that person form successfully loads", () => {
    CreatePerson.openAsSuperUser()
    CreatePerson.form.waitForExist()
    CreatePerson.form.waitForDisplayed()
  })
  it("Should see that task form successfully loads", () => {
    CreateTask.openAsAdmin()
    CreateTask.form.waitForExist()
    CreateTask.form.waitForDisplayed()
  })
  it("Should see that authorization groups form successfully loads", () => {
    CreateAuthorizationGroup.open()
    CreateAuthorizationGroup.form.waitForExist()
    CreateAuthorizationGroup.form.waitForDisplayed()
  })
  it("Should see that location form successfully loads", () => {
    CreateNewLocation.open()
    CreateNewLocation.createButton.click()
    CreateNewLocation.nameRequiredError.waitForExist()
    CreateNewLocation.nameRequiredError.waitForDisplayed()
  })
  it("Should see that position form successfully loads", () => {
    EditPosition.open()
    EditPosition.form.waitForExist()
    EditPosition.form.waitForDisplayed()
  })
  it("Should see that organization form successfully loads", () => {
    CreateOrganization.openAsAdmin()
    CreateOrganization.form.waitForExist()
    CreateOrganization.form.waitForDisplayed()
  })
})
