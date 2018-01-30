angular.module('starter.controllers', [])
	.controller('AppCtrl', function ($scope, $http, $localStorage, $state, $ionicHistory, $ionicSideMenuDelegate) {
		if (rtl_language) $scope.menuDirection = "right";
		else $scope.menuDirection = "left";
		$http.get(wordpress_url + '/wp-json/wp/v2/categories', {
			params: { "page": 1, "per_page": 100 }
		}).then(function (response) {
			$localStorage.category = response.data;
			$scope.loaded();
		});
		$scope.loaded = function () {
			$scope.category = $localStorage.category;
			$scope.categoryParent = [];
			$scope.categoryChild = {};
			angular.forEach($scope.category, function (item) {
				if (item.parent == 0) $scope.categoryParent.push(item);
				else {
					if (!$scope.categoryChild[item.parent]) $scope.categoryChild[item.parent] = [];
					$scope.categoryChild[item.parent].push(item);
				}
			});
			$scope.openCategory = function (id, child) {
				if (!child) $scope.now = id;
				$scope.categoryNowChild = [];
				if (angular.isArray($scope.categoryChild[id])) {
					$scope.categoryNowChild = $scope.categoryChild[id];
				} else {
					$ionicHistory.nextViewOptions({
						disableAnimate: true,
						disableBack: true,
						historyRoot: true
					});
					if (rtl_language) $ionicSideMenuDelegate.toggleRight(false);
					else $ionicSideMenuDelegate.toggleLeft(false);
					$state.go("app.category", { id: id });
				}
			};
		};
		$scope.loaded();
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if ($state.current.name == "app.home") $scope.now = "home";
			else if ($state.current.name == "app.photo") $scope.now = "photo";
			else if ($state.current.name == "app.video") $scope.now = "video";
		});
		$scope.$watch(
			function () {
				return $ionicSideMenuDelegate.isOpen();
			},
			function (isOpen) {
				if (!isOpen) {
					$scope.categoryNowChild = [];
					if ($state.current.name == "app.home") $scope.now = "home";
					else if ($state.current.name == "app.photo") $scope.now = "photo";
					else if ($state.current.name == "app.video") $scope.now = "video";
				}
			}
		);
	})
	.controller('HomeCtrl', function ($rootScope, $scope, $http, $ionicTabsDelegate) {
		$rootScope.latest = [];
		$rootScope.maxLatest = 0;
		$scope.$watch('maxLatest', function (value) {
			if (value != 0) $scope.updateLatest();
		});

		




		$scope.updateLatest = function () {
			var updateLatest = setInterval(function () {
				$http.get(wordpress_url + '/wp-json/wp/v2/posts', {
					params: { "page": 1, "per_page": 1 }
				}).then(function (response) {
					if (response.data[0].id != $rootScope.maxLatest) {
						response.data[0].time = new Date(response.data[0].date_gmt).getTime();
						$rootScope.latest.unshift(response.data[0]);
						$rootScope.maxLatest = response.data[0].id;
					}
				});
			}, 60000);
			$scope.$on("$ionicView.leave", function () {
				if (angular.isDefined(updateLatest)) clearInterval(updateLatest);
			});
		};
		$rootScope.topnews = [];
		$rootScope.maxTopnews = 0;
		$scope.$watch('maxTopnews', function (value) {
			if (value != 0) $scope.updateTopnews();
		});



		$scope.updateTopnews = function () {
			var updateTopnews = setInterval(function () {
				$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[orderby]=post_views&filter[order]=desc', {
					params: { "page": 1, "per_page": 1 }
				}).then(function (response) {
					if (response.data[0].id != $rootScope.maxTopnews) {
						response.data[0].time = new Date(response.data[0].date_gmt).getTime();
						$rootScope.topnews.unshift(response.data[0]);
						$rootScope.maxTopnews = response.data[0].id;
					}
				});
			}, 60000);
			$scope.$on("$ionicView.leave", function () {
				if (angular.isDefined(updateTopnews)) clearInterval(updateTopnews);
			});
		};
		$rootScope.videos = [];
		$rootScope.maxVideos = 0;
		$scope.$watch('maxVideos', function (value) {
			if (value != 0) $scope.updateVideos();
		});







		$scope.updateVideos = function () {
			var updateVideos = setInterval(function () {
				$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[post_format]=post-format-video', {
					params: { "page": 1, "per_page": 1 }
				}).then(function (response) {
					if (response.data[0].id != $rootScope.maxVideos) {
						response.data[0].time = new Date(response.data[0].date_gmt).getTime();
						$rootScope.videos.unshift(response.data[0]);
						$rootScope.maxVideos = response.data[0].id;
					}
				});
			}, 60000);
			$scope.$on("$ionicView.leave", function () {
				if (angular.isDefined(updateVideos)) clearInterval(updateVideos);
			});
		};
		$rootScope.trending = [];
		$rootScope.maxTrending = 0;
		$scope.$watch('maxTrending', function (value) {
			if (value != 0) $scope.updateTrending();
		});





		$scope.updateTrending = function () {
			var updateTrending = setInterval(function () {
				$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[orderby]=comment_count&filter[order]=desc', {
					params: { "page": 1, "per_page": 1 }
				}).then(function (response) {
					if (response.data[0].id != $rootScope.maxTrending) {
						response.data[0].time = new Date(response.data[0].date_gmt).getTime();
						$rootScope.trending.unshift(response.data[0]);
						$rootScope.maxTrending = response.data[0].id;
					}
				});
			}, 60000);
			$scope.$on("$ionicView.leave", function () {
				if (angular.isDefined(updateTrending)) clearInterval(updateTrending);
			});
		};
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if (toState.name == "app.home") {
				if ($rootScope.maxLatest != 0) $scope.updateLatest();
				if ($rootScope.maxTopnews != 0) $scope.updateTopnews();
				if ($rootScope.maxVideos != 0) $scope.updateVideos();
				if ($rootScope.maxTrending != 0) $scope.updateTrending();
			}
		});
	})





	.controller('LastestCtrl', function ($rootScope, $scope, $http) {
		$scope.page = 1;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts', {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if ($rootScope.maxLatest == 0 && response.data[0]) $rootScope.maxLatest = response.data[0].id;
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$rootScope.latest.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
				$scope.$broadcast('scroll.refreshComplete');
			});
		};
	})





	.controller('TopnewsCtrl', function ($rootScope, $scope, $http) {
		$scope.page = 1;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[orderby]=post_views&filter[order]=desc', {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if ($rootScope.maxTopnews == 0 && response.data[0]) $rootScope.maxTopnews = response.data[0].id;
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$rootScope.topnews.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
			});
		};
	})
	.controller('VideoCtrl', function ($rootScope, $scope, $http) {
		$scope.page = 1;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[post_format]=post-format-video', {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if ($rootScope.maxVideos == 0 && response.data[0]) $rootScope.maxVideos = response.data[0].id;
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$rootScope.videos.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
			});
		};
	})
	.controller('TrendingCtrl', function ($rootScope, $scope, $http) {
		$scope.page = 1;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[orderby]=comment_count&filter[order]=desc', {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if ($rootScope.maxTrending == 0 && response.data[0]) $rootScope.maxTrending = response.data[0].id;
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$rootScope.trending.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
			});
		};
	})
	.controller('DetailCtrl', function ($scope, $http, $sce, $stateParams, $ionicPopover, $localStorage, $ionicPopup, IonicClosePopupService) {
		if (angular.isUndefined($localStorage.bookmark)) $localStorage.bookmark = {};
		$scope.$sce = $sce;
		$scope.posts = Number($stateParams.id);
		$scope.incategory = [];
		$scope.page = 1;
		if (angular.isDefined($localStorage.bookmark[$scope.posts])) $scope.bookmarked = true;
		$scope.showLoading("Loading...");
		$http.get(wordpress_url + '/wp-json/wp/v2/posts/' + $scope.posts)
			.then(function (response) {
				$scope.loadDetail = true;
				var tmp = document.createElement('div');
				tmp.innerHTML = response.data.content.rendered;
				var a = tmp.querySelectorAll('a');
				for (var i = 0; i < a.length; i++) {
					var attributes = "openLink('" + a[i].getAttribute('href') + "')";
					a[i].setAttribute("ng-click", attributes);
					a[i].setAttribute("href", "javascipt:void(0)");
				}
				response.data.content.rendered = tmp.innerHTML;
				$scope.data = response.data;
				$scope.data.time = new Date($scope.data.date).getTime();
				$scope.load = function () {
					$http.get(wordpress_url + '/wp-json/wp/v2/posts?categories=' + $scope.data.categories[0], {
						params: { "exclude": $scope.posts, "page": $scope.page, "per_page": 4 }
					}).then(function (response) {
						if (response.data.length == 0) {
							$scope.page = $scope.page - 1;
							$scope.over = true;
						}
						angular.forEach(response.data, function (item) {
							$scope.incategory.push(item);
						});
						$scope.$broadcast('scroll.infiniteScrollComplete');
						$scope.page = $scope.page + 1;
					});
				};
				$http.get(wordpress_url + '/wp-json/mobiconnector/post/counter_view?post_id=' + $scope.posts)
					.then(function () { $scope.hideLoading(); });
			});
		$scope.share = function () {
			window.plugins.socialsharing.share(null, null, null, $scope.data.link);
		};
		$ionicPopover.fromTemplateUrl('templates/dailynews/menu.html', {
			scope: $scope
		}).then(function (popover) {
			$scope.popover = popover;
		});
		$scope.openPopover = function ($event) {
			$scope.popover.show($event);
		};
		$scope.closePopover = function ($event) {
			$scope.popover.hide($event);
		};
		$scope.showPopupText = function () {
			$scope.closePopover();
			var popup = $ionicPopup.show({
				title: 'Choose default text size for story pages',
				templateUrl: 'templates/popup/text.html',
				cssClass: 'popup-choose',
				scope: $scope
			});
			$scope.closePopupText = function () { popup.close() };
			IonicClosePopupService.register(popup);
		};
		$scope.settings = {};
		if (angular.isDefined($localStorage.textSize)) $scope.settings.text = $localStorage.textSize;
		else $scope.settings.text = "normal";
		$scope.$watch('settings.text', function (newVal, oldVal) {
			if (newVal != oldVal) {
				$scope.closePopupText();
				$localStorage.textSize = newVal;
			}
		});
		$scope.bookmark = function () {
			$scope.closePopover();
			if ($scope.bookmarked) {
				delete $localStorage.bookmark[$scope.posts];
				$scope.bookmarked = false;
				window.plugins.toast.showShortBottom('Remove from Bookmark');
			} else {
				$localStorage.bookmark[$scope.posts] = true;
				$scope.bookmarked = true;
				window.plugins.toast.showShortBottom('Bookmark success');
			}
		};
	})
	.controller('PhotoCtrl', function ($scope, $http) {
		$scope.photos = [];
		$scope.maxPhotos = 0;
		$scope.page = 1;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[post_format]=post-format-image', {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if ($scope.maxPhotos == 0 && response.data[0]) $scope.maxPhotos = response.data[0].id;
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$scope.photos.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
				$scope.$broadcast('scroll.refreshComplete');				
			});
		};
		$scope.$watch('maxPhotos', function (value) {
			if (value != 0) $scope.updatePhotos();
		});
		$scope.updatePhotos = function () {
			var updatePhotos = setInterval(function () {
				$http.get(wordpress_url + '/wp-json/wp/v2/posts?filter[post_format]=post-format-image', {
					params: { "page": 1, "per_page": 1 }
				}).then(function (response) {
					if (response.data[0].id != $scope.maxPhotos) {
						$scope.photos.unshift(response.data[0]);
						$scope.maxPhotos = response.data[0].id;
					}
				});
			}, 60000);
			$scope.$on("$ionicView.leave", function () {
				if (angular.isDefined(updatePhotos)) clearInterval(updatePhotos);
			});
		};
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if (toState.name == "app.photo") {
				if ($scope.maxPhotos != 0) $scope.updatePhotos();
			}
		});
	})
	.controller('PhotoDetail', function ($scope, $http, $sce, $stateParams, $localStorage, $ionicSlideBoxDelegate) {
		if (angular.isUndefined($localStorage.bookmark)) $localStorage.bookmark = {};
		$scope.$sce = $sce;
		$scope.posts = $stateParams.id;

		$scope.currentItem = undefined;

		$scope.showLoading("Loading...");
		if (angular.isDefined($localStorage.bookmark[$scope.posts])) $scope.bookmarked = true;
		//alert(wordpress_url + '/wp-json/wp/v2/posts/' + $scope.posts);
		$http.get(wordpress_url + '/wp-json/wp/v2/posts/' + $scope.posts)
			.then(function (response) {
				$scope.data = response.data;
				$scope.code = $sce.trustAsHtml($scope.data.content.rendered);
				$scope.list = [];
				var tmp = document.createElement('div');
				tmp.innerHTML = $scope.code;
				var img = tmp.querySelectorAll('img');
				for (var i = 0; i < img.length; i++) {
					var nowImg = {};
					nowImg.src = img[i].getAttribute('src');
					nowImg.title = img[i].getAttribute('title');
					nowImg.alt = img[i].getAttribute('alt');
					$scope.list.push(nowImg);
				}

				if($scope.list.length > 0)
					$scope.currentItem = $scope.list[0];

				$scope.hideLoading();
				$ionicSlideBoxDelegate.update();
				
			});

		$scope.share = function () {
			//alert("sharing...");
			if($scope.currentItem)
			{
				//alert("Sharing Image " + $scope.currentItem.src);
				window.plugins.socialsharing.share(null, null, $scope.currentItem.src, null);
			}
		};

		$scope.slideHasChanged = function(index){
			//console.log(index);
			$scope.currentItem = $scope.list[index];
		}

		$scope.bookmark = function () {
			if ($scope.bookmarked) {
				delete $localStorage.bookmark[$scope.posts];
				$scope.bookmarked = false;
				window.plugins.toast.showShortBottom('Remove from Favs');
			} else {
				$localStorage.bookmark[$scope.posts] = true;
				$scope.bookmarked = true;
				window.plugins.toast.showShortBottom('Added to favorites');
			}
		};
	})
	.controller('CommentCtrl', function ($scope, $http, $state, $sce, $stateParams, $localStorage, $ionicScrollDelegate) {
		$scope.comments = [];
		$scope.page = 1;
		$scope.$sce = $sce;
		$scope.posts = $stateParams.id;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/comments?post=' + $scope.posts, {
				params: { "orderBy": "date", "order": "desc", "page": $scope.page, "per_page": 10 }
			}).then(function (response) {
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.overComments = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$scope.comments.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
			});
		};
		$scope.data = {};
		$scope.AddAComment = function () {
			if (angular.isDefined($localStorage.login)) {
				$scope.showLoading("Loading...");
				$scope.checkToken().then(function (response) {
					$http({
						method: 'POST',
						url: wordpress_url + '/wp-json/wp/v2/comments',
						data: { 'content': $scope.data.content, 'post': $scope.posts },
						cache: false,
						headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer ' + $localStorage.login.token },
						withCredentials: true,
						transformRequest: function (obj) {
							var str = [];
							for (var p in obj)
								str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
							return str.join("&");
						}
					}).success(function () {
						$state.reload();
						$scope.hideLoading();
						delete $scope.data.content;
					}).error(function (response) {
						$scope.hideLoading();
						if (response == null) {
							window.plugins.toast.showShortBottom('This message already sent');
						} else {
							window.plugins.toast.showShortBottom(response.message);
						}
					});
				}).catch(function () {
					$scope.hideLoading();
					$scope.autoLogin();
				});
			} else $state.go('app.login');
		};
	})
	.controller('CategoryCtrl', function ($scope, $http, $sce, $stateParams) {
		$scope.$sce = $sce;
		$scope.category = [];
		$scope.maxCategory = 0;
		$scope.page = 1;
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts?categories=' + $stateParams.id, {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if ($scope.maxCategory == 0) $scope.maxCategory = response.data[0].id;
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				angular.forEach(response.data, function (item) {
					$scope.category.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
			});
		};
		$scope.$watch('maxCategory', function (value) {
			if (value != 0) $scope.updateCategory();
		});
		$scope.updateCategory = function () {
			var updateCategory = setInterval(function () {
				$http.get(wordpress_url + '/wp-json/wp/v2/posts?categories=' + $stateParams.id, {
					params: { "page": 1, "per_page": 1 }
				}).then(function (response) {
					if (response.data[0].id != $scope.maxCategory) {
						$scope.category.unshift(response.data[0]);
						$scope.maxCategory = response.data[0].id;
					}
				});
			}, 60000);
			$scope.$on("$ionicView.leave", function () {
				if (angular.isDefined(updateCategory)) clearInterval(updateCategory);
			});
		};
		$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
			if (toState.name == "app.category") {
				if ($scope.maxCategory != 0) $scope.updateCategory();
			}
		});
		$scope.showLoading("Loading...");
		$http.get(wordpress_url + '/wp-json/wp/v2/categories/' + $stateParams.id)
			.then(function (response) {
				$scope.nameCategory = response.data;
				$scope.hideLoading();
			});
	})
	.controller('SettingsCtrl', function ($scope, $state, $http, $ionicPopup, $localStorage, IonicClosePopupService, Camera) {
		$scope.login = $localStorage.login;
		if ($scope.login) {
			$http.post(wordpress_url + '/wp-json/mobiconnector/user/get_info', {
				username: $scope.login.user_nicename
			}, {
					cache: false,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer ' + $scope.login.token },
					withCredentials: true,
					transformRequest: function (obj) {
						var str = [];
						for (var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					}
				}).then(function (response) {
					$scope.login.avatar = response.data.wp_user_avatar;
				}).catch(function (error) {
					window.plugins.toast.showShortBottom(error.data.message);
				});
		}
		$scope.settings = {};
		// $scope.settings.theme = "1";
		// $scope.showPopupTheme = function() {
		// var popup = $ionicPopup.show({
		// title: 'Choose application theme',
		// templateUrl:'templates/popup/theme.html',
		// cssClass: 'popup-choose',
		// scope: $scope
		// });
		// $scope.closePopupTheme = function(){popup.close()};
		// IonicClosePopupService.register(popup);
		// };
		// $scope.$watch('settings.theme', function(newVal, oldVal){
		// if(newVal != oldVal) $scope.closePopupTheme();
		// });
		if (angular.isDefined($localStorage.textSize)) $scope.settings.text = $localStorage.textSize;
		else $scope.settings.text = "normal";
		$scope.showPopupText = function () {
			var popup = $ionicPopup.show({
				scope: $scope,
				title: 'Choose default text size for story pages',
				templateUrl: 'templates/popup/text.html',
				cssClass: 'popup-choose'
			});
			$scope.closePopupText = function () { popup.close() };
			IonicClosePopupService.register(popup);
		};
		$scope.$watch('settings.text', function (newVal, oldVal) {
			if (newVal != oldVal) {
				$scope.closePopupText();
				$localStorage.textSize = newVal;
			}
		});
		if (angular.isDefined($localStorage.notification))
			$scope.settings.notification = $localStorage.notification;
		else $scope.settings.notification = true;
		$scope.$watch('settings.notification', function (newVal, oldVal) {
			if (newVal != oldVal) {
				if (newVal) {
					$localStorage.notification = true;
					if (window.plugins) window.plugins.OneSignal.setSubscription(true);
				} else {
					$localStorage.notification = false;
					if (window.plugins) window.plugins.OneSignal.setSubscription(false);
				}
			}
		});
		$scope.editAvatar = function () {
			var options = {
				sourceType: 0,
				allowEdit: true,
				targetWidth: 160,
				targetHeight: 160,
				destinationType: 0
			};
			Camera.getPicture(options).then(function (imageData) {
				$scope.avatar = "data:image/jpeg;base64," + imageData;
				$scope.showLoading("Loading...");
				$scope.checkToken().then(function (response) {
					$http.post(wordpress_url + '/wp-json/mobiconnector/user/update_profile', {
						user_profile_picture: $scope.avatar
					}, {
							cache: false,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'Authorization': 'Bearer ' + $scope.login.token },
							withCredentials: true,
							transformRequest: function (obj) {
								var str = [];
								for (var p in obj)
									str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
								return str.join("&");
							}
						}).then(function (response) {
							$scope.hideLoading();
							$scope.login.avatar = $scope.avatar;
						}).catch(function (error) {
							$scope.hideLoading();
							window.plugins.toast.showShortBottom(error.data.message);
						});
				}).catch(function () {
					$scope.hideLoading();
					$scope.autoLogin();
				});
			}, function (err) {
				console.log(err);
			});
		};
		$scope.showLogout = function () {
			var confirmPopup = $ionicPopup.show({
				title: 'Do you want to Logout?',
				cssClass: 'popup-confirm',
				buttons: [
					{
						text: 'YES',
						type: 'bar-button',
						onTap: function (e) {
							delete $localStorage.login;
							$state.reload();
						}
					},
					{
						text: 'NO',
						type: 'bar-button'
					}
				]
			});
		};
		$scope.rateApp = function () {
			if (ionic.Platform.isAndroid())
				cordova.InAppBrowser.open("market://details?id=" + android_packageName, "_system");
			else cordova.InAppBrowser.open("itms-apps://itunes.apple.com/app/id" + apple_id + "?mt=8", "_system");
		};
		$scope.shareApp = function () {
			if (ionic.Platform.isAndroid())
				window.plugins.socialsharing.share(null, null, null, "https://play.google.com/store/apps/details?id=" + android_packageName);
			else window.plugins.socialsharing.share(null, null, null, "https://itunes.apple.com/app/id" + apple_id + "?mt=8");
		};
	})
	.controller('BookmarkCtrl', function ($scope, $http, $localStorage, $sce, $stateParams, $ionicTabsDelegate) {
		if ($stateParams.type == "photo") setTimeout(function () { $ionicTabsDelegate.select(1); }, 10);
		$scope.$sce = $sce;
		if ($localStorage.bookmark && angular.isObject($localStorage.bookmark)) {
			$scope.showLoading("Loading...");
			$scope.include = [];
			angular.forEach($localStorage.bookmark, function (value, key) {
				$scope.include.push(key);
			});
			$scope.include = $scope.include.join(",");
			$http.get(wordpress_url + '/wp-json/wp/v2/posts', {
				params: { "include": $scope.include }
			}).then(function (response) {
				$scope.news = response.data;
				angular.forEach($scope.news, function (item) {
					item.time = new Date(item.date_gmt).getTime();
				});
				$scope.hideLoading();
			});
			$scope.deleteNews = function (id) {
				delete $localStorage.bookmark[id];
				angular.forEach($scope.news, function (item) {
					if (item.id == id) item.remove = true;
				});
			};
		}
	})
	.controller('LoginCtrl', function ($scope, $state, $http, $localStorage, $ionicHistory, base64, $stateParams) {
		$scope.dataLogin = $stateParams;
		$scope.data = {};
		$scope.login = function () {
			$scope.showLoading("Loading...");
			$http.post(wordpress_url + '/wp-json/jwt-auth/v1/token', {
				username: $scope.data.username,
				password: $scope.data.password
			}, {
					cache: false,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
					withCredentials: true,
					transformRequest: function (obj) {
						var str = [];
						for (var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					}
				}).then(function (response) {
					$scope.hideLoading();
					$localStorage.login = response.data;
					$localStorage.login.user_nicename = $scope.data.username;
					$scope.base = {};
					$scope.base.one = base64.encode($scope.data.username);
					$scope.base.two = base64.encode($scope.data.password);
					$localStorage.login.base = $scope.base;
					$ionicHistory.goBack();
				}).catch(function (error) {
					$scope.hideLoading();
					window.plugins.toast.showShortBottom("Invalid credentials");
				});
		};
		if ($scope.dataLogin.username && $scope.dataLogin.password) {
			$scope.data = $scope.dataLogin;
			$scope.login();
		}
		else if (angular.isDefined($localStorage.login)) $ionicHistory.goBack();
	})
	.controller('ForgotCtrl', function ($scope, $http, $state) {
		$scope.data = {};
		$scope.reset = function () {
			$scope.showLoading("Loading...");
			$http.post(wordpress_url + '/wp-json/mobiconnector/user/forgot_password', {
				username: $scope.data.email,
			}, {
					cache: false,
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
					withCredentials: true,
					transformRequest: function (obj) {
						var str = [];
						for (var p in obj)
							str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
						return str.join("&");
					}
				}).then(function (response) {
					$scope.hideLoading();
					$state.go('app.login');
					window.plugins.toast.showShortBottom("Please check your mail for reset link");
				}).catch(function (error) {
					$scope.hideLoading();
					window.plugins.toast.showShortBottom(error.data.message);
				});
		};
	})
	.controller('SignupCtrl', function ($scope, $http, $state) {
		$scope.data = {};
		$scope.register = function () {
			if (!$scope.data.email) {
				window.plugins.toast.showShortBottom('Email is not inserted');
			}
			else if (!$scope.data.password) {
				window.plugins.toast.showShortBottom('Password is not inserted');
			}
			else if (!$scope.data.repass) {
				window.plugins.toast.showShortBottom('Re-password is not inserted');
			}
			else if (!$scope.data.name.first || !$scope.data.name.last) {
				window.plugins.toast.showShortBottom('Name is not inserted');
			}
			else if (!$scope.data.term) {
				window.plugins.toast.showShortBottom('Please accept terms and conditions');
			}
			else {
				if ($scope.data.password != $scope.data.repass) {
					window.plugins.toast.showShortBottom('Re-password do not match');
				} else {
					$scope.showLoading("Loading...");
					$http.post(wordpress_url + '/wp-json/mobiconnector/user/register', {
						username: $scope.data.email,
						email: $scope.data.email,
						first_name: $scope.data.name.first,
						last_name: $scope.data.name.last,
						password: $scope.data.password,
					}, {
							cache: false,
							headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
							withCredentials: true,
							transformRequest: function (obj) {
								var str = [];
								for (var p in obj)
									str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
								return str.join("&");
							}
						}).then(function (response) {
							$scope.hideLoading();
							$state.go('app.login');
							window.plugins.toast.showShortBottom("A verification mail has been send to the email address provided by you. Please validate.");
						}).catch(function (error) {
							$scope.hideLoading();
							window.plugins.toast.showShortBottom(error.data.message);
						});
				}
			}
		};
	})
	.controller('SearchCtrl', function ($scope, $http, $ionicScrollDelegate) {
		$scope.data = {};
		$scope.load = function () {
			$http.get(wordpress_url + '/wp-json/wp/v2/posts?search=' + $scope.data.keyword, {
				params: { "page": $scope.page, "per_page": wordpress_per_page }
			}).then(function (response) {
				if (response.data.length == 0) {
					$scope.page = $scope.page - 1;
					$scope.over = true;
				}
				angular.forEach(response.data, function (item) {
					item.time = new Date(item.date_gmt).getTime();
					if (item.format == "video") item.content.rendered = "[video]";
				});
				angular.forEach(response.data, function (item) {
					$scope.search.push(item);
				});
				$scope.$broadcast('scroll.infiniteScrollComplete');
				$scope.page = $scope.page + 1;
			});
		};
		$scope.startSearch = function () {
			$scope.search = [];
			$scope.page = 1;
			$scope.over = false;
			$scope.isSearch = true;
			$ionicScrollDelegate.scrollBottom();
		};
	})