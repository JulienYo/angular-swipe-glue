'use strict';

angular.module('angular-swipe-glue', ['ngTouch'])
  .directive('swipeGlue', function($swipe, $document) {
    return {
      scope: {
        swipeIndex: '=?'
      },
      transclude: true,
      link: function (scope, element, attrs, controller, transclude) {
        var ulWidth = 0,
          liWidth = 0,
          liCount = 0,
          startMove = 0,
          translateX = 0,
          canceled;

        transclude(function(clone) {
          element.empty();
          element.append(clone);
        });

        function documentMouseUpEvent(event) {
          canceled = true;
          endSwipe({
            x: event.clientX,
            y: event.clientY
          });
        }

        //End handler
        function endSwipe(coords) {
          var moveX = startMove - coords.x;
          startMove = 0;
          $document.unbind('mouseup', documentMouseUpEvent);
          if (moveX) {
            var swipedRight = moveX < 0;
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
            });
          }
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
        function initContext () {
          if (element.children && element.children().length > 0) {
            var li;
            liWidth = element.children()[0].offsetWidth;
            liCount = element.children().length;

            for (var i=0;i<element.children().length;i++) {
              li = element.children()[i];
              ulWidth += li.offsetWidth;
            }
            element.addClass('swipe-glue');
            element.css({width: ulWidth + 'px'});
            scope.swipeIndex = scope.swipeIndex || 0;
            move();
          }
        }

        scope.$watch(function() {
          return element.children()[0] && element.children()[0].offsetWidth;
        }, function() {
          initContext();
        });

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
            translate = 'translateX(' + (-moveX) + 'px)';
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