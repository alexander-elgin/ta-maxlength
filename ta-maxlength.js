'use strict';

angular
    .module('ta-maxlength', [])
    .directive('taMaxlength', function ($timeout, textAngularManager) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var editor, maxLength = parseInt(attrs.taMaxlength);

                var getTruncatedContent = function(content) {
                    return $.truncate(content, {
                        length: maxLength + 1,
                        ellipsis: ''
                    });
                };

                var getEditor = function() {
                    return editor.scope.displayElements.text[0];
                };

                var getContentLength = function() {
                    return angular.element(getEditor()).text().length;
                };

                var isNavigationKey = function(keyCode) {
                    return ((keyCode >= 33) && (keyCode <= 40)) || ([8, 46].indexOf(keyCode) !== -1);
                };

                var isCopying = function(event) {
                    return event.ctrlKey && ([65, 67, 88].indexOf(event.keyCode) !== -1);
                };

                $scope.$watch(function() {
                    var editorInstance = textAngularManager.retrieveEditor(attrs.name);

                    if((editorInstance !== undefined) && (editor === undefined)) {
                        editor = editorInstance;

                        getEditor().addEventListener('keydown', function(e) {
                            if(!isNavigationKey(e.keyCode) && !isCopying(e) && (getContentLength() >= maxLength)) {
                                e.preventDefault();
                                return false;
                            }
                        });
                    }

                    return editorInstance === undefined ? '' : editor.scope.html;
                }, function(modifiedContent) {
                    if(getContentLength() > maxLength) {
                        $timeout(function() {
                            editor.scope.html = getTruncatedContent(modifiedContent);
                        });
                    }
                });
            }
        };
    });
