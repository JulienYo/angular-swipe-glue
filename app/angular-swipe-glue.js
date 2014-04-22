'use strict';

angular.module('angular-swipe-glue', ['ngTouch'])
  .directive('swipeGlue', function($swipe) {
    return {
      scope: {
        swipeIndex: '=?'
      },
      link: function (scope, element) {
        var ulWidth = 0,
          liWidth = 0,
          startMove = 0;

        var handlers = {
          'start': function(coords) {
            console.log('start', coords);
            startMove = coords.x;
          },
          'cancel': function() {
            console.log('cancel');
          },
          'move': function(coords) {
            console.log('move', coords);
            //move(coords.x);
          },
          'end': function(coords) {
            console.log('end', coords);
            if (startMove - coords.x >= 0) {
              right();
            } else {
              left();
            }
            startMove = 0;
          }
        };
        $swipe.bind(element, handlers);

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
        scope.swipeIndex = scope.swipeIndex || 0;
        scope.$watch('glueIndex', move);
        var right = function() {
          scope.swipeIndex++;
          console.log('right', scope.swipeIndex);
          move();
        };
        var left = function() {
          console.log('left', scope.swipeIndex);
          if (scope.swipeIndex > 0) { 
            scope.swipeIndex --;
          }
          move();
        };
        function move() {
          var moveX = scope.swipeIndex * liWidth,
            translate = "translateX(-"+moveX+"px)";
          element.css({
            '-webkit-transform': translate,
            '-moz-transform': translate,
            '-o-transform': translate,
            '-ms-transform': translate,
            transform: translate
          });
        }
      }
    };
  });