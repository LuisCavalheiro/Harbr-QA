const { Given, When, Then } = require("@cucumber/cucumber")
const request = require('supertest')
const expect = require('chai').expect
const assert = require('chai').assert
const moment = require('moment');

let payload;
let body;
let header;
let statusCode;


Given('the payload {string}', function (strPayload) {
  payload = strPayload
});

When('I POST the payload to {string} on host {string}', async function (strURL, strHost) {
  return request(strHost)
    .post(strURL)
    .send(payload)
    .then((res) => {
      body = res.body
      header = res.header
      statusCode = res.status
    })
});

Then('I get response code {int}', function (intStatus) {
  expect(statusCode).to.equal(intStatus)
});

Then('the response {string} is {string}', function (strHeaderName, strHeaderValue) {
  const headerValue = header[strHeaderName.toLowerCase()]
  expect(headerValue).to.have.string(strHeaderValue)
});

Then('the response contains attribute {string} with the value {string}', function (strAttributeName, strAttributeValue) {
  const attributeValue = body[strAttributeName]
  if (attributeValue) {
    expect(attributeValue).to.equal(strAttributeValue)
  }
  else {
    assert.fail('Attribute: ' + strAttributeName + ', does not exist')
  }
});

Then('the response contains attribute {string} with the value as today', function (strAttributeName) {
  const attributeValue = body[strAttributeName]
  if (attributeValue) {
    const currentDay = moment().format('ddd MMM DD YYYY')
    expect(attributeValue).to.equal(currentDay)
  }
  else {
    assert.fail('Attribute: ' + strAttributeName + ', does not exist')
  }
});


function checkAttributeValue(startAttribute, attributePath) {
  let attributeValue = startAttribute

  let listAttributeValue = []
  let pendingPath = attributePath
  for (index = 0; index < attributePath.length; index++) {
    let attribute = attributePath[index]
    pendingPath = pendingPath.slice(1);
    attributeValue = attributeValue[attribute]

    if ((pendingPath.length > 0) && (attributeValue) && (attributeValue instanceof Array)) {
      attributeValue.forEach((value) => {
        listAttributeValue = listAttributeValue.concat(checkAttributeValue(value, pendingPath))
      })
      break
    }
    else if ((!attributeValue) || (pendingPath.length == 0)) {
      listAttributeValue.push(attributeValue)
      if (!attributeValue) {
        break
      }
    }
  }

  return listAttributeValue
}


function checkAttributeType(optional, strAttributeName, strAttributeType) {
  const attributePath = strAttributeName.split('.')
  let attributeValue = checkAttributeValue(body, attributePath)

  attributeValue.forEach((item, index) => {
    if (item) {
      assert.typeOf(item, strAttributeType, strAttributeName + '[' + (index + 1) + '] is not of type: ' + strAttributeType)
    }
    else {
      if (!optional) {
        assert.fail('Attribute: ' + strAttributeName + '[' + (index + 1) + '] does not exist')
      }
      else {
        assert.isOk(true, 'Optional attribute: ' + strAttributeName + '[' + (index + 1) + '] does not exist')
      }
    }
  })
}

Then('the response contains attribute {string} of type {string}', function (strAttributeName, strAttributeType) {
  checkAttributeType(false, strAttributeName, strAttributeType)
});

Then('the response contains an optional attribute {string} of type {string}', function (strAttributeName, strAttributeType) {
  checkAttributeType(true, strAttributeName, strAttributeType)
});

Then('the attribute {string} is calculated based on {string} and the following rules', function (strTarget, strInput, dataTable) {
  const inputPath = strInput.split('.')
  let inputValue = checkAttributeValue(body, inputPath)

  const targetPath = strTarget.split('.')
  let targetValue = checkAttributeValue(body, targetPath)

  if (inputValue.length != targetValue.length) {
    return assert.fail('Incompatible number of references. Attribute: ' + strTarget + '[' + targetValue.length + '] / '
      + 'Attribute: ' + strInput + '[' + inputValue.length + ']')
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