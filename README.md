# angular-swipe-glue

Swipe items horizontaly and try to reach nearest item smoothly.

Demo: http://julienyo.github.io/angular-swipe-glue

## Usage:

    <ul swipe-glue>
      <li>A</li>
      <li>B</li>
      <li>C</li>
      <li>D</li>
      <li>E</li>
      <li>F</li>
    </ul>

### 2way binding index controllers

    <ul swipe-glue swipe-index="index">
      <li>A</li>
      <li>B</li>
      <li>C</li>
      <li>D</li>
      <li>E</li>
      <li>F</li>
    </ul>
    index: <input type="number" min="0" ng-model="index">
    <span ng-click="index = index-1">&lt;</span><span ng-click="index = index+1">&gt;</span>

## Todo:

 -  Allow Different sized items
 -  Allow vertical items