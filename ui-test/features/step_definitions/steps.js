const { Given, When, Then } = require("@cucumber/cucumber")
const expect = require('chai').expect
const assert = require('chai').assert
const browser = require('../common/browser');

let companies = []
let companyRow;

Given('I navigate to {string}', function (strURL) {
  return this.driver.get(strURL);
})

When('I insert {string} in the edit field', function (strInput) {
  return browser(this.driver).waitAndLocateByCSS('input#name').sendKeys(strInput);
});

When('I click on the submit button', async function () {
  const button = await browser(this.driver).waitAndLocateByCSS("input[type='button']")
  return button.click();
});

When('I should see an alert with the message {string}', function (strMessage) {
  this.driver.switchTo().alert().getText().then((alertMessage) => {
    expect(alertMessage).to.equal(strMessage)
  })
});

Then('I should see the table of companies with the headers', async function (dataTable) {
  await browser(this.driver).waitAndLocateByCSS("table")
  let headers = await browser(this.driver).allWaitAndLocateByCSS("thead tr th")

  let headerNames = []
  for (headerIndex = 0; headerIndex < headers.length; headerIndex++) {
    const name = await headers[headerIndex].getText()
    headerNames.push(name)
  }

  let expectedHeaders = dataTable.raw()

  if (headers.length != expectedHeaders.length) {
    return assert.fail('Incompatible number of headers. Headers: [' + headerNames + '] / '
      + 'Expected Headers: [' + expectedHeaders + ']')
  }

  for (headerIndex = 0; headerIndex < headers.length; headerIndex++) {
    assert.equal(headerNames[headerIndex], expectedHeaders[headerIndex], 'Header[' + (headerIndex + 1) + '] is invalid')
  }

  let cells = await browser(this.driver).allWaitAndLocateByCSS("tbody tr td")
  let cellContent = []
  for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const content = await cells[cellIndex].getText()
    cellContent.push(content)
  }
  let companiesLink = await browser(this.driver).allWaitAndLocateByCSS("tbody tr td a")

  companies = []
  let companyRow = 0
  let company = {}
  for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const cellValue = cellContent[cellIndex]

    if ((cellIndex % headerNames.length) == 0) {
      company = {}
      company.Name = cellValue
    }
    if ((cellIndex % headerNames.length) == 1) {
      company.NumEmployees = cellValue
    }
    if ((cellIndex % headerNames.length) == 2) {
      company.Size = cellValue

      company.link = companiesLink[companyRow]
      companyRow = companyRow + 1
      companies.push(company)
    }
  }
});

Then('the column {string} is calculated based on column {string} and the following rules', async function (strTarget, strInput, dataTable) {
  let headers = await browser(this.driver).allWaitAndLocateByCSS("thead tr th")

  let headerNames = []
  for (headerIndex = 0; headerIndex < headers.length; headerIndex++) {
    const name = await headers[headerIndex].getText()
    headerNames.push(name)
  }

  const targetIndex = headerNames.findIndex((item) => {
    return item == strTarget
  })
  const inputIndex = headerNames.findIndex((item) => {
    return item == strInput
  })

  let cells = await browser(this.driver).allWaitAndLocateByCSS("tbody tr td")
  let cellContent = []
  for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const content = await cells[cellIndex].getText()
    cellContent.push(content)
  }

  let inputValue = []
  let targetValue = []
  for (cellIndex = 0; cellIndex < cells.length; cellIndex++) {
    const cellValue = cellContent[cellIndex]
    if ((cellIndex % headerNames.length) == inputIndex) {
      inputValue.push(cellValue)
    }
    if ((cellIndex % headerNames.length) == targetIndex) {
      targetValue.push(cellValue)
    }
  }

  let rules = dataTable.hashes()

  inputValue.forEach((item, index) => {

    let ruleResult = ''
    for (ruleIndex = 0; ruleIndex < rules.length; ruleIndex++) {
      rule = rules[ruleIndex]

      if ((parseInt(item) > parseInt(rule.From)) && ((rule.To == 'Any') || (parseInt(item) <= parseInt(rule.To)))) {
        ruleResult = rule.Size
        break
      }
    }

    assert.equal(ruleResult, targetValue[index], strTarget + '[' + (index + 1) + '] is invalid')
  })
});

When('I select a company on row {int}', function (intRow) {
  companyRow = intRow - 1
  return companies[companyRow].link.click();
});

Then('I should see the company information in the detail screen', async function () {
  const companyDetail = companies[companyRow]

  let paragraphs = await browser(this.driver).allWaitAndLocateByCSS("div div div div div p")
  let paragraphContent = []
  for (paragraphIndex = 0; paragraphIndex < paragraphs.length; paragraphIndex++) {
    const content = await paragraphs[paragraphIndex].getText()
    paragraphContent.push(content)
  }

  assert.equal('Name: ' + companyDetail.Name, paragraphContent[1], '"Name" information is invalid')
  assert.equal('# of Employees: ' + companyDetail.NumEmployees, paragraphContent[2], '"# of Employees" information is invalid')
  assert.equal('Size: ' + companyDetail.Size, paragraphContent[3], '"Size" information is invalid')

});

When('I click on the {string} button', async function (strButtonName) {
  const button = await browser(this.driver).waitAndLocateByCSS("input[type='button'][value='" + strButtonName +"']");
  return button.click();
});