# Currency converter

## React web app  

Converts dollar ($) amount between CAD and USD.  
Shows 30 day history of $1 currency conversions between CAD and USD.  
  
(Demo)[https://react-currency-converter.herokuapp.com/]  

## Node server api

Accesses node server api to convert currency or to get historical currency amounts by the dollar  
  
(Api)[https://react-currency-api.herokuapp.com/api/0.2]  

## Notes

### Component hierarchy
- Currency
  - Nav
  - GetRate
    - InputFormGetRate
      - InputAmount
      - DropDownFrom
      - DropDownTo
      - ButtonGo
    - ResultTable
  - ThirtyDayHistory
    - InputFormGetHistory
      - DropDownFrom
      - DropDownTo
      - ButtonGo
    - ResultGraph

### List of parts
- the selected nav item            state
- the input amount user enters     state
- the value of from select         state
- the value of to select           state
- the result retrieved on submit   state
- the displayed calculated result  props
- the displayed result graph       props
  - date range (last 30 days)      props
  - graph                          props

