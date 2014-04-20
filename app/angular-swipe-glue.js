'use strict';

angular.module('angular-swipe-glue', ['ngTouch'])
  .directive('glue', function($swipe) {
    return {
      scope: {
        glueIndex: '=?'
      },
      link: function (scope, element) {
        var ulWidth = 0,
          liWidth = 0,
          startMove = 0;

        scope.$watch(function() {
          return element[0].clientWidth;
        }, function(width) {
          console.log(width);
          ulWidth = width;
          if (element.children && element.children.length > 0) {
            liWidth = element.children()[0].clientWidth;
            console.log(liWidth);
          }
        });
        scope.glueIndex = scope.glueIndex || 0;
        scope.$watch('glueIndex', move);
        function right() {
          scope.glueIndex++;
          move();
        };
        function left() {
          if (scope.glueIndex > 0) { 
            scope.glueIndex --;
          }
          move();
        };
        function move() {
          console.log(scope.glueIndex);
          element.css({
            'transform': 
              "translate(-"+scope.glueIndex * liWidth+"px)"
          });
        }
        $swipe.bind(element, {
          'start': function(coords) {
            startMove = coords.x;
          },
          'cancel': function() {
            console.log('cancel');
          },
          'move': function(coords) {
          },
          'end': function(coords) {
            if (startMove - coords.x >= 0) {
              right();
            } else {
              left();
            }
          }
        });
      }
    };
  });