

# Test Automation #

**Assumption**
The execution of the automated tests assumes that the application (back-end and front-end) is running.


## UI Testing ##

**Tests Implemented**
The files **ui-test/features/ui-test1.feature** contains 2 scenarios:
- Validating than the input field should be not empty to process to the list screen.
- Validating thet than the company table is displayed and the size calculated correctly. The company **Caribian Airlnis** has an invalid size. It is set as Big instead of Medium.

The files **ui-test/features/ui-test1.feature** contains 1 scenarios:
- Validating that the company link navigates correctly to the detail page and that the company information is displayed correctly. The test also validate that the **Back to the list** navigates back to the list page. The test iterates over all test data. The system is not able to display the details for company **United Brands**.

# Note #
The rules for calculating the size of the company are different between UI and API:
- UI: **Size**: if **# of Employees** is less than or equal 100, size is **Small**; if greater then 10 and less then or equal 1000, **Medium**; otherwise, **Big**
- API: customer **size** is: **Small**, when **# of employees** is <= 10; **Medium** when it is <= 1000; **Big** otherwise.

- Due to the time constraint I haven't implemented a scenario to validate the contact information structure (Name + Email) or the existence of the default message: No contact info available

# Libraries Used #
Libraries used for API testing:
- Cucumber: BDD implementation library
- Chai: Test assertion library
- Moment: Date management library
- Selenium-Webdriver: Selenium driver to pilot the browser
- ChromeDriver: Diver to support the Chrome browser

# Setup #
- clone repository
- npm install
- installing selenium chromedriver

# Running the tests: #
- npm run test-ui


## API Testing ##

# Tests Implemented #
The file **api-test/features/api-test.feature** contains 2 test scenarios:
- Validating the API attribute structure. In comparison with the requirements, I detected that the field **name** was missing from the response.
- Validate the calculation of the company size. Customer with **id=2** has an invalid size. It is set as Big instead of Medium.

# Libraries #
Libraries used for API testing:
- Cucumber: BDD implementation library
- Chai: Test assertion library
- selenium-webdriver

# Setup #
- clone repository
- npm install

# Running the tests: #
- npm run test-api


