require('chromedriver')
const seleniumWebdriver = require('selenium-webdriver');
const {setWorldConstructor, setDefaultTimeout} = require('@cucumber/cucumber');
const {timeout, browser} = require('../../config');

class CustomWorld {
  constructor() {

    this.driver = new seleniumWebdriver
      .Builder()
      .forBrowser(browser)
      .build();
  }
}

setDefaultTimeout(timeout);
setWorldConstructor(CustomWorld);