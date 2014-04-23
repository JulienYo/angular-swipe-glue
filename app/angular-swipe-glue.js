'use strict';

angular.module('angular-swipe-glue', ['ngTouch'])
  .directive('swipeGlue', function($swipe) {
    return {
      scope: {
        swipeIndex: '=?'
      },
      link: function (scope, element) {
        var ulWidth = 0,
          ulHeight = 0,
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
            /*var newX = startMove - coords.x;
            if (newX) {
              move(newX);
              startMove = newX;
            }*/
          },
          'end': function(coords) {
            console.log('end', coords);
            scope.$apply(function() {
              if (startMove - coords.x > 0) {
                scope.swipeRight();
              } else {
                scope.swipeLeft();
              }
              startMove = 0;
            });
          }
        };
        $swipe.bind(element, handlers);

        if (element.children && element.children.length > 0) {
          var li;
          liWidth = element.children()[0].offsetWidth;

          for (var i=0;i<element.children().length;i++) {
            li = element.children()[i];
            ulWidth += li.offsetWidth;
            if (ulHeight < li.offsetHeight) {
              ulHeight = li.offsetHeight;
            }
          }
          element.addClass('swipe-glue');
          element.css({width: ulWidth + 'px', height: ulHeight + 'px'});
        }

        if (angular.isUndefined(scope.swipeIndex)) {
          scope.swipeIndex = 0;
        }

        scope.$watch('swipeIndex', function() {
          move();
        });

        scope.swipeRight = function () {
          console.log('index', scope.swipeIndex);
          scope.swipeIndex = scope.swipeIndex + 1;
          move();
        }
        scope.swipeLeft = function () {
          if (scope.swipeIndex > 0) { 
            console.log('index', scope.swipeIndex);
            scope.swipeIndex = scope.swipeIndex - 1;
          }
          move();
        }
        function move(x) {
          console.log('index', scope.swipeIndex);
          var moveX = x || (scope.swipeIndex * liWidth),
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