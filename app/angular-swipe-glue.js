'use strict';

angular.module('angular-swipe-glue', ['ngTouch'])
  .directive('swipeGlue', function($swipe, $document) {
    return {
      scope: {
        swipeIndex: '=?'
      },
      link: function (scope, element) {
        var ulWidth = 0,
          ulHeight = 0,
          liWidth = 0,
          liCount = 0,
          startMove = 0,
          translateX = 0,
          lastTranslateX = 0,
          canceled;

        function documentMouseUpEvent(event) {
          endSwipe({
            x: event.clientX,
            y: event.clientY
          });
          canceled = true;
        }

        //End handler
        function endSwipe(coords) {
          var swipedRight = startMove - coords.x <= 0;
          startMove = 0;
          scope.$apply(function() {
            var index = Math.ceil(translateX / liWidth);
            index = swipedRight ? index - 1 : index;
            //Don't go further than li limits
            if (index < 0) {
              index = 0;
            } else if (index >= liCount) {
              index = liCount - 1;
            }
            var oldIndex = scope.swipeIndex;
            scope.swipeIndex = index;
            //Move, watch will do nothing
            if (oldIndex === scope.swipeIndex) {
              move();
            }
            $document.unbind('mouseup', documentMouseUpEvent);
          });
        }

        //Swipe handlers
        var handlers = {
          'start': function(coords) {
            startMove = coords.x;
            canceled = false;
            $document.bind('mouseup', documentMouseUpEvent);
          },
          'cancel': function() {
            canceled = true;
          },
          'move': function(coords) {
            if (!canceled) {
              translateX = scope.swipeIndex * liWidth + startMove - coords.x;
              move(translateX);
            }
          },
          'end': endSwipe
        };
        $swipe.bind(element, handlers);

        //Init context
        if (element.children && element.children().length > 0) {
          var li;
          liWidth = element.children()[0].offsetWidth;
          liCount = element.children().length;

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

        //Init index
        if (angular.isUndefined(scope.swipeIndex) || scope.swipeIndex < 0 || scope.swipeIndex >= liCount) {
          scope.swipeIndex = 0;
        }

        //Move on index update
        scope.$watch('swipeIndex', function(newValue, oldValue) {
          if (scope.swipeIndex < 0 || scope.swipeIndex >= liCount) {
            scope.swipeIndex = oldValue;
          }
          else {
            move();
          }
        });

        //Animate
        function move(x) {
          var moveX = x || (scope.swipeIndex * liWidth),
            translate = "translateX("+(-moveX)+"px)";
          if (x) {
            element.removeClass('glue-animation');
          }
          else {
            element.addClass('glue-animation');
          }
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