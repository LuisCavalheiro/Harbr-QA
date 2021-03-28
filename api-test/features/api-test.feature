Feature: API Test
    Scenario: Check Post '/' response structure
        Given the payload "{name: 'Luis Cavalheiro'}"
        When I POST the payload to "/" on host "http://localhost:3001"
        Then I get response code 200
        And the response "Content-Type" is "application/json"
        And the response contains attribute "name" with the value "Luis Cavalheiro"
        And the response contains attribute "timestamp" with the value as today
        And the response contains attribute "customers" of type "Array"
        And the response contains attribute "customers.id" of type "Number"
        And the response contains attribute "customers.name" of type "String"
        And the response contains attribute "customers.employees" of type "Number"
        And the response contains an optional attribute "customers.contactInfo" of type "Object"
        And the response contains an optional attribute "customers.contactInfo.name" of type "String"
        And the response contains an optional attribute "customers.contactInfo.email" of type "String"
        And the response contains attribute "customers.size" of type "String"


    Scenario: Check Post '/' size calculation
        Given the payload "{name: 'Luis Cavalheiro'}"
        When I POST the payload to "/" on host "http://localhost:3001"
        Then the attribute "customers.size" is calculated based on "customers.employees" and the following rules
            | From | To   | Size   |
            | 0    | 10   | Small  |
            | 11   | 1000 | Medium |
            | 1001 | Any  | Big    |
