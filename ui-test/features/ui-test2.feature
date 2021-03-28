Feature: UI Test2

  Scenario Outline: Customer Detail Screen
    Given I navigate to "http://localhost:3000"
    When I insert "Luis Cavalheiro" in the edit field
    And I click on the submit button
    Then I should see the table of companies with the headers
      | Name           |
      | # of Employees |
      | Size           |
    When I select a company on row <Row>
    Then I should see the company information in the detail screen
    When I click on the "Back to the list" button
    Then I should see the table of companies with the headers
      | Name           |
      | # of Employees |
      | Size           |

    Examples:
      | Row |
      | 1   |
      | 2   |
      | 3   |
      | 4   |
      | 5   |
      | 6   |

