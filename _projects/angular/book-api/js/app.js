'use strict';


angular.module('myApp', [])
	.controller('BookController', function ($scope, $http) {
		$scope.pageNum = 1;
		
		$scope.$watch('search' , function () {
			fetch($scope.pageNum);
		});


		$scope.search = "";

		function fetch(num) {

			// Error	Error code / description (Note: request success code = 0)
			// Time	Request query execution time (seconds)
			// Total	The total search results
			// Page	The page number of results (Note: limit = 10 results on page)
			// Books	Search results
			//		 Array: ID, Title, SubTitle (optional), Description, Image
			$http.get("http://it-ebooks-api.info/v1/search/" + $scope.search + "/page/" +num)
				.then(function (response) {
					$scope.related = response.data;
				});

			// Error	Error code / description (Note: request success code = 0)
			// Time	Request query execution time (seconds)
			// ID	The ID of the book
			// Title	The title of the book
			// SubTitle	The subtitle of the book
			// Description	The description of the book
			// Author	The author(s) name of the book
			// ISBN	The International Standard Book Number (ISBN) of the book
			// Page	The number of pages of the book
			// Year	The publication date (year) of the book
			// Publisher	The publisher of the book
			// Image	The image URL of the book
			// Download	The download URL of the book
			$http.get("http://it-ebooks-api.info/v1/book/"+$scope.bookId)
				.then(function (response) {
					$scope.book = response.data;
				})
		}

				// updates the page heading
		$scope.update = function (book) {
			$scope.bookId = book.ID;
			fetch();

		};

		// this makes sure all the text in the selection range is returned
		$scope.select = function () {
			this.setSelectionRange(0, this.value.length);
		};

		$scope.next = function () {
			$scope.pageNum += 1;
			fetch($scope.pageNum);
		};
		

		$scope.prev = function () {
			if($scope.pageNum > 1) {
				$scope.pageNum -= 1;
				fetch($scope.pageNum);
			}
		}

	});