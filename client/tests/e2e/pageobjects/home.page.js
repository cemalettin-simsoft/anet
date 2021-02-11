import Page from "./page"

class HomePage extends Page {
  get createReportButton() {
    return browser.$("#mini-anet-container")
  }

  open(path) {
    return super.open(path)
  }
}

export default new HomePage()
