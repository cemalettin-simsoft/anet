import moment from "moment"
import Page from "../page"

const PAGE_URL = "/reports/new"

class CreateReport extends Page {
  get form() {
    return browser.$("form")
  }

  get title() {
    return browser.$("h2.legend")
  }

  get intent() {
    return browser.$("#intent")
  }

  get intentHelpBlock() {
    return browser.$("#fg-intent .help-block")
  }

  get engagementDate() {
    return browser.$("#engagementDate")
  }

  get datePickPopover() {
    // check the today button
    const today = moment().format("ddd MMM DD YYYY")
    return browser.$(`div[aria-label="${today}"]`)
  }

  get duration() {
    return browser.$("#duration")
  }

  get allDayCheckbox() {
    return browser.$("#all-day-col label")
  }

  get reportPeople() {
    return browser.$("#reportPeople")
  }

  get reportPeopleTable() {
    return browser.$("#reportPeople-popover .table-responsive table")
  }

  get submitButton() {
    return browser.$("#formBottomSubmit")
  }

  open() {
    super.open(PAGE_URL)
  }

  getPersonByName(name) {
    const personRow = browser.$$(
      `//div[@id="reportPeopleContainer"]//tr[td[@class="reportPeopleName" and ./a[text()="${name}"]]]/td[@class="conflictButton" or @class="reportPeopleName"]`
    )
    personRow[0].$("div.bp3-spinner").waitForExist({ reverse: true })

    return {
      name: personRow[1].getText(),
      conflictButton: personRow[0].$("./span")
    }
  }

  selectAttendeeByName(name) {
    this.reportPeople.click()
    // wait for attendess table loader to disappear
    this.reportPeopleTable.waitForDisplayed()
    let searchTerm = name
    if (searchTerm.startsWith("CIV") || searchTerm.startsWith("Maj")) {
      searchTerm = name.substr(name.indexOf(" ") + 1)
    }
    browser.keys(searchTerm)
    this.reportPeopleTable.waitForDisplayed()
    const checkBox = this.reportPeopleTable.$(
      "tbody tr:first-child td:first-child input.checkbox"
    )
    if (!checkBox.isSelected()) {
      checkBox.click()
    }
    this.title.click()
    this.reportPeopleTable.waitForExist({ reverse: true, timeout: 3000 })
  }

  fillForm(fields) {
    this.form.waitForClickable()

    if (fields.intent !== undefined) {
      this.intent.setValue(fields.intent)
    }

    this.intentHelpBlock.waitForExist({ reverse: true })

    if (moment.isMoment(fields.engagementDate)) {
      // remove all day as it would block duration adding
      if (!this.duration.isClickable()) {
        this.allDayCheckbox.click()
      }
      this.engagementDate.waitForClickable()
      this.engagementDate.click()
      this.datePickPopover.waitForDisplayed()
      browser.keys(fields.engagementDate.format("DD-MM-YYYY HH:mm"))

      this.title.click()
      this.datePickPopover.waitForExist({ reverse: true, timeout: 3000 })
    }

    if (fields.duration !== undefined) {
      this.duration.setValue(fields.duration)
    }

    if (Array.isArray(fields.advisors) && fields.advisors.length) {
      fields.advisors.forEach(at => this.selectAttendeeByName(at))
    }

    if (Array.isArray(fields.principals) && fields.principals.length) {
      fields.principals.forEach(at => this.selectAttendeeByName(at))
    }
  }

  submitForm() {
    this.submitButton.waitForClickable()
    this.submitButton.click()
    this.submitButton.waitForExist({ reverse: true })
  }
}

export default new CreateReport()
