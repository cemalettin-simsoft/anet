import EditPosition from '../pages/editPosition.page'
import { expect } from 'chai'

const ADVISOR_ORG = 'EF 2.2'
const PRINCIPAL_ORG = 'MoI'

describe('Edit position page', () => {

  beforeEach('Open the edit position page', () => {
    EditPosition.open()
  })

  describe('When changing the position type from principal to advisor', () => {
    it('Should reset the organization field', () => {
        EditPosition.typeAdvisorButton.waitForVisible()
        expect(EditPosition.typeAdvisorButton.getAttribute('class')).to.not.include('active')
        EditPosition.typePrincipalButton.waitForVisible()
        expect(EditPosition.typePrincipalButton.getAttribute('class')).to.include('active')
        expect(EditPosition.organization.getValue()).to.not.equal('')
        EditPosition.typeAdvisorButton.click()
        EditPosition.typeAdvisorButton.waitForVisible()
        expect(EditPosition.typeAdvisorButton.getAttribute('class')).to.include('active')
        EditPosition.typePrincipalButton.waitForVisible()
        expect(EditPosition.typePrincipalButton.getAttribute('class')).to.not.include('active')
        expect(EditPosition.organization.getValue()).to.equal('')
    })
  })

  describe('When changing the position type from principal to advisor and saving', () => {
    it('Should update the position type to advisor', () => {
        EditPosition.typeAdvisorButton.waitForVisible()
        expect(EditPosition.typeAdvisorButton.getAttribute('class')).to.not.include('active')
        expect(EditPosition.typePrincipalButton.getAttribute('class')).to.include('active')
        expect(EditPosition.organization.getValue()).to.not.equal('')
        EditPosition.typeAdvisorButton.click()
        EditPosition.organization.setValue(ADVISOR_ORG)
        EditPosition.organizationAutocomplete.waitForExist()
        EditPosition.organizationAutocomplete.click()
        EditPosition.submitForm()
        EditPosition.waitForAlertSuccessToLoad()
        const alertMessage = EditPosition.alertSuccess.getText()
        expect(alertMessage).to.equal('Saved Position')
        EditPosition.open()
        EditPosition.typeAdvisorButton.waitForVisible()
        expect(EditPosition.typeAdvisorButton.getAttribute('class')).to.include('active')
        EditPosition.typePrincipalButton.waitForVisible()
        expect(EditPosition.typePrincipalButton.getAttribute('class')).to.not.include('active')
        expect(EditPosition.organization.getValue()).to.equal(ADVISOR_ORG)
    })
  })

  describe('When changing the position type from advisor to principal and saving', () => {
    it('Should update the position type to principal', () => {
        EditPosition.typeAdvisorButton.waitForVisible()
        expect(EditPosition.typeAdvisorButton.getAttribute('class')).to.include('active')
        EditPosition.typePrincipalButton.waitForVisible()
        expect(EditPosition.typePrincipalButton.getAttribute('class')).to.not.include('active')
        expect(EditPosition.organization.getValue()).to.not.equal('')
        EditPosition.typePrincipalButton.click()
        EditPosition.organization.setValue(PRINCIPAL_ORG)
        EditPosition.organizationAutocomplete.waitForExist()
        EditPosition.organizationAutocomplete.click()
        EditPosition.submitForm()
        EditPosition.waitForAlertSuccessToLoad()
        const alertMessage = EditPosition.alertSuccess.getText()
        expect(alertMessage).to.equal('Saved Position')
        EditPosition.open()
        EditPosition.typeAdvisorButton.waitForVisible()
        expect(EditPosition.typeAdvisorButton.getAttribute('class')).to.not.include('active')
        EditPosition.typePrincipalButton.waitForVisible()
        expect(EditPosition.typePrincipalButton.getAttribute('class')).to.include('active')
        expect(EditPosition.organization.getValue()).to.equal(PRINCIPAL_ORG)
    })
  })

})
