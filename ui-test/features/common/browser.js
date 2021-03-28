const {By, until} = require('selenium-webdriver');
const {timeout} = require('../../config');

function browser(driver){
  function waitAndLocateByCSS(selector){
    return driver.wait(until.elementLocated(By.css(selector)), timeout);
  }
  
  function waitAndLocateByXpath(selector){
    return driver.wait(until.elementLocated(By.xpath(selector)), timeout);
  }

  function allWaitAndLocateByCSS(selector){
    return driver.wait(until.elementsLocated(By.css(selector)), timeout);
  }
  
  function allWaitAndLocateByXpath(selector){
    return driver.wait(until.elementsLocated(By.xpath(selector)), timeout);
  }

  return {
    waitAndLocateByCSS,
    allWaitAndLocateByCSS,
    waitAndLocateByXpath,
    allWaitAndLocateByXpath
  };
}

module.exports = browser;