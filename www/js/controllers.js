angular.module('conFusion.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = $localStorage.getObject('userinfo','{}');

 
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function () {
	console.log('Doing login', $scope.loginData);
	$localStorage.storeObject('userinfo',$scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  $scope.reservation = {};

  // Create the reserve modal that we will use later
  $ionicModal.fromTemplateUrl('templates/reserve.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.reserveform = modal;
  });

  // Triggered in the reserve modal to close it
  $scope.closeReserve = function() {
    $scope.reserveform.hide();
  };

  // Open the reserve modal
  $scope.reserve = function() {
    $scope.reserveform.show();
  };

  // Perform the reserve action when the user submits the reserve form
  $scope.doReserve = function() {
    console.log('Doing reservation', $scope.reservation);

    // Simulate a reservation delay. Remove this and replace with your reservation
    // code if using a server system
    $timeout(function() {
      $scope.closeReserve();
    }, 1000);
  }; 
  
  $scope.registration = {};
    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the registration action when the user submits the registration form
    $scope.doRegister = function () {
        // Simulate a registration delay. Remove this and replace with your registration
        // code if using a registration system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
  
   $ionicPlatform.ready(function() {
	   if(typeof Camera === "undefined"){
		   $scope.takePicture = function() {
				console.log("A camera could not be found for the app.");
		   }
	   }else{
			var options = {
				quality: 50,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.CAMERA,
				allowEdit: true,
				encodingType: Camera.EncodingType.JPEG,
				targetWidth: 100,
				targetHeight: 100,
				popoverOptions: CameraPopoverOptions,
				saveToPhotoAlbum: false
			};
			 $scope.takePicture = function() {
				$cordovaCamera.getPicture(options).then(function(imageData) {
					$scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
				}, function(err) {
					console.log(err);
				});

				$scope.registerform.show();

			};
			
			var options_Gallery = {
				maximumImagesCount:1,
				width:100,
				height:100,
				quality:50
			};
			
			 $scope.Gallery = function() {
				$cordovaImagePicker.getPictures(options_Gallery).then(function(imageData) {
					$scope.registration.imgSrc = imageData[0];
				}, function(err) {
					console.log(err);
				});

				$scope.registerform.show();

			};
	   }
    });
})

.controller('MenuController', ['$scope', 'dishes', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', function ($scope, dishes, favoriteFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {
            $scope.baseURL = baseURL;
			$scope.addFavorite = function (index) {
				favoriteFactory.addToFavorites(index);
				$ionicPlatform.ready(function () {
						$cordovaLocalNotification.schedule({
							title: "Added Favorite",
							text: "You have added the dish " + dishes[index].name + " to your favorites."
						}).then(function () {
							console.log(dishes[index].name + ' was added to the favorites.');
						},
						function () {
							console.log('Failed to add Notification ');
						});
						$cordovaToast
							.show("The following dish was added to the favorites list:\nDish: "+ dishes[index].name + "\nCategory: " + dishes[index].category + "\nPrice: " + dishes[index].price + (dishes[index].label==""?"":"\nLabel: " + dishes[index].label) + "\nDescription: " + dishes[index].description, 'long', 'bottom')
							.then(function (success) {
							  // success
							}, function (error) {
							  // error
							});
				});
			}
			
			$scope.dishes = dishes;
			
			console.log(dishes);
			
			$scope.select = function(index){
				$scope.filtText = ["","","appetizer", "mains", "dessert"][index];
			}
			$scope.isSelected = function(index){
				return $scope.filtText == ["","","appetizer", "mains", "dessert"][index];
			}
        }])

        .controller('ContactController', ['$scope', function($scope) {

            $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
            
            var channels = [{value:"tel", label:"Tel."}, {value:"Email",label:"Email"}];
            
            $scope.channels = channels;
            $scope.invalidChannelSelection = false;
                        
        }])

        .controller('FeedbackController', ['$scope', 'feedbackFactory', function($scope,feedbackFactory) {
            
            $scope.sendFeedback = function() {
                
                console.log($scope.feedback);
                
                if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
                    $scope.invalidChannelSelection = true;
                    console.log('incorrect');
                }
                else {
                    $scope.invalidChannelSelection = false;
                    feedbackFactory.save($scope.feedback);
                    $scope.feedback = {mychannel:"", firstName:"", lastName:"", agree:false, email:"" };
                    $scope.feedback.mychannel="";
                    $scope.feedbackForm.$setPristine();
                }
            };
        }])

        .controller('DishDetailController', ['$scope', '$stateParams', 'dish', 'menuFactory', 'favoriteFactory', 'baseURL', '$ionicPopover', '$ionicModal',  '$timeout', '$ionicPlatform', '$cordovaToast', '$cordovaLocalNotification', function ($scope, $stateParams, dish, menuFactory, favoriteFactory, baseURL, $ionicPopover, $ionicModal,$timeout, $ionicPlatform, $cordovaToast, $cordovaLocalNotification) {    
			$scope.baseURL = baseURL;
			$scope.showDish = false;
			$ionicPopover.fromTemplateUrl('templates/dish-detail-popover.html', {
				scope:$scope
			}).then(function(popover){
				$scope.popover = popover;
			});

			
			$scope.addFavorite = function(id){
				$scope.closePopover();
				favoriteFactory.addToFavorites(id);
				$ionicPlatform.ready(function () {
					$cordovaLocalNotification.schedule({
						title: "Added Favorite",
						text: "You have added the dish " +dish.name + " to your favorites."
					}).then(function(res) {
						console.log('Added Favorite ' + dish.name);
					},
					function(res) {
						console.log('Failed to add Favorite ');
					});
					$cordovaToast
					  .show("The following dish was added to the favorites list:\nDish: "+ dish.name + "\nCategory: " + dish.category + "\nPrice: " + dish.price + (dish.label==""?"":"\nLabel: " + dish.label) + "\nDescription: " + dish.description, 'long', 'bottom')
					  .then(function (success) {
						  // success
					  }, function (error) {
						  // error
					  });
				});
			}
			
			$scope.dish = dish;
			
			
			$scope.openPopover = function($event){
				$scope.popover.show($event);
			};
			$scope.closePopover = function() {
				$scope.popover.hide();
			};



			  // Create the login modal that we will use later
			$ionicModal.fromTemplateUrl('templates/dish-comment.html', {
				scope: $scope
			}).then(function(modal) {
				$scope.commentModal = modal;
			});


			
			  // Triggered in the login modal to close it
			$scope.closeModal = function() {
				$scope.commentModal.hide();
			};

			  // Open the login modal
			$scope.openModal = function() {
				$scope.closePopover();
				//$scope.commentModal.show()
				$timeout(function(){$scope.commentModal.show()},0);
			};
			
            $scope.mycomment = {rating:5, comment:"", author:"", date:""};
            
            $scope.submitComment = function () {
                
                $scope.mycomment.date = new Date().toISOString();
                console.log($scope.mycomment);
                
                $scope.dish.comments.push($scope.mycomment);
				$timeout(function() {
				  $scope.closeModal();
				}, 100);
				menuFactory.update({id:$scope.dish.id},$scope.dish);
                
                //$scope.commentForm.$setPristine();
                
                $scope.mycomment = {rating:5, comment:"", author:"", date:""};

				
            }
        }])

        // implement the IndexController and About Controller here

		.controller('IndexController', ['$scope', 'dish', 'promotion', 'leader', 'menuFactory', 'promotionFactory', 'corporateFactory', 'baseURL', function ($scope, dish, promotion, leader, menuFactory, promotionFactory, corporateFactory, baseURL) {

			$scope.baseURL = baseURL;


			$scope.showDish = false;
			$scope.message = "Loading ...";

			$scope.dish = dish;

			$scope.promotion = promotion;
			$scope.leader = leader;

		}])

        .controller('AboutController', ['$scope', 'leaders','corporateFactory', 'baseURL', function($scope, leaders,corporateFactory,baseURL) {
					$scope.baseURL=baseURL;

					$scope.leaders=leaders;
                    
            
                    }])
		.controller('FavoritesController', ['$scope', 'dishes', 'favorites', 'favoriteFactory', 'baseURL', '$ionicListDelegate', '$ionicPopup', '$ionicLoading', '$timeout', '$ionicPlatform', '$cordovaVibration', function ($scope, dishes, favorites, favoriteFactory, baseURL, $ionicListDelegate, $ionicPopup, $ionicLoading, $timeout, $ionicPlatform, $cordovaVibration) {
			$scope.baseURL = baseURL;
			$scope.shouldShowDelete = false;

			$ionicLoading.show({
				template: '<ion-spinner></ion-spinner> Loading...'
			});
			

			$scope.favorites = favorites;

			$scope.dishes = dishes;
			
			$ionicLoading.hide();

				
			console.log($scope.dishes, $scope.favorites);

			$scope.toggleDelete = function () {
				$scope.shouldShowDelete = !$scope.shouldShowDelete;
				console.log($scope.shouldShowDelete);
			}

			$scope.deleteFavorite = function (index) {

				var confirmPopup = $ionicPopup.confirm({
					title: 'Confirm Delete',
					template: 'Are you sure you want to delete this item?'
				});

				confirmPopup.then(function (res) {
					if (res) {
						console.log('Ok to delete');
						favoriteFactory.deleteFromFavorites(index);
						$localStorage.storeObject('favoriteDishes', favoriteFactory.getFavorites());
						$ionicPlatform.ready(function () {
							$cordovaVibration.vibrate(100);
						});
					} else {
						console.log('Canceled delete');
					}
				});

				$scope.shouldShowDelete = false;
				

			}}])
		.filter('favoriteFilter', function () {
			return function (dishes, favorites) {
				var out = [];
				for (var i = 0; i < favorites.length; i++) {
					for (var j = 0; j < dishes.length; j++) {
						if (dishes[j].id === favorites[i].id)
							out.push(dishes[j]);
					}
				}
				return out;

			}});
