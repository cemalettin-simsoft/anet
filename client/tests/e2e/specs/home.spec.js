import HomePage from "../pageobjects/home.page"

describe("My Home page", () => {
  it("should have a create report button with correct text", () => {
    HomePage.open()
    const button = HomePage.createReportButton
    expect(button).toHaveTextContaining("Create Report")
  })
})
