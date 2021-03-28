Feature: UI Test1
  Scenario: Welcome Screen
    Given I navigate to "http://localhost:3000"
    When I click on the submit button
    And I should see an alert with the message "Please provide your name"

  Scenario: Customer List Screen
    Given I navigate to "http://localhost:3000"
    When I insert "Luis Cavalheiro" in the edit field
    And I click on the submit button
    Then I should see the table of companies with the headers
      | Name           |
      | # of Employees |
      | Size           |
    And the column "Size" is calculated based on column "# of Employees" and the following rules
      | From | To   | Size   |
      | 0    | 100  | Small  |
      | 101  | 1000 | Medium |
      | 1001 | Any  | Big    |
