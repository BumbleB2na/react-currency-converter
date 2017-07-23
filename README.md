# Plan 

## Setup
- add github repo to harddrive for project
- open project in VS code
  - in Terminal use: npm install and npm start to watch changes and get error messages on traspilation
    - local: localhost:8888/api/0.1/
    - hosted: example.com:8888/api/0.1

## Task
- fix bug in app
  - push to github when fixed
- Note: Saw hint related to date problem with dates before year 2000.

## Main task:
Reference Thinking in react guide: https://facebook.github.io/react/docs/thinking-in-react.html

1. Break UI in to a component hierarchy
   - open psd file in photoshop on other computer
     - draw boxes around components to form hierarchy
       - *Use layer names in psd file to help name components* if they exist - name the components.
     - email image to self and open on main computer

2. Build a static version in React
   - build components from mockups that only have render() methods and use props that were passed down to them
     - build top-down... from main container down to smaller components
      - *Does not yet have interactive functionality*
      - *Use proprs to pass data down - don't use state yet*, state will come in next step

3. Identify the minimal (but complete) representation of UI state
   - list off all the parts in the application (e.g. checkbox, search input, table)
   - go through checklist and ask the 3 questions...
   - result: list of parts that will need to be controlled by state.
     - think of minimal state components will use for functionality; don't repeat yourself

4. Identify where your state should live
   - go through hierarchy of components and decide which will need state based on checklist results
      - go down in to child components that use that state instead of props.
   - test by playing with contructor this.state values

5. Add inverse data flow

6. Deploy
   - in VS Code Terminal: npm run build
     - use Heroku guide online to create new project and to deploy project to heroku.
