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
          startMove = 0,
          translateX = 0,
          lastTranslateX = 0;

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
            var newX = lastTranslateX + startMove - coords.x
            if (newX >= 0) {
              translateX =  newX;
            }
            element.removeClass('glue-animation');
            move(translateX);
          },
          'end': function(coords) {
            console.log('end', coords);
            var swipedLeft;
            if (startMove - coords.x <= 0) {
              swipedLeft = true;
            }
            startMove = 0;
            element.addClass('glue-animation');
            scope.$apply(function() {
              var index = Math.ceil(translateX / liWidth);
              scope.swipeIndex = swipedLeft ? index - 1 : index;
              if (scope.swipeIndex < 0) {
                scope.swipeIndex = 0;
              }
              lastTranslateX = scope.swipeIndex * liWidth;
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
          scope.swipeIndex = scope.swipeIndex + 1;
          move();
        }
        scope.swipeLeft = function () {
          if (scope.swipeIndex > 0) { 
            scope.swipeIndex = scope.swipeIndex - 1;
          }
          move();
        }
        function move(x) {
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