'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:ImageCtrl
 * @description
 * # ImageCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
.controller('ImageCtrl', function (Cropper, $scope, $timeout,recruit, $http, $rootScope, User) {
  $scope.test ={t:1};
  $scope.options = {
       maximize: false, // very important otherwise it will overload the custom data
       data: {
           x: 261,
           y: 7,
           width: 56,
           height: 56
       } // those are arbitrary values
   };
   function showCropper() {
       $scope.$broadcast($scope.showEvent);
   }

   function hideCropper() {
       $scope.$broadcast($scope.hideEvent);
   }
   var file, data;
   $scope.uploadVis = 'false';
       /**
        * Method is called every time file input's value changes.
        * Because of Angular has not ng-change for file inputs a hack is needed -
        * call `angular.element(this).scope().onFile(this.files[0])`
        * when input's event is fired.
        */
   $scope.onFile = function(event) {
     var blob = event;
       Cropper.encode((file = blob)).then(function(dataUrl) {
           $scope.dataUrl = dataUrl;
           $timeout(hideCropper); // wait for $digest to set image's src
           $timeout(showCropper); // wait for $digest to set image's src
       });
   };
   $scope.cropper = {};
   $scope.cropperProxy = 'cropper.first';

   /**$scope.cropper.first('getCroppedCanvas', { width: 160, height: 90 })*/
   /**
    * When there is a cropped image to show encode it to base64 string and
    * use as a source for an image element.
    */
   $scope.preview = function() {
       if (!file || !data) {return;}
       Cropper.crop(file, data).then(Cropper.encode).then(function(dataUrl) {
           ($scope.preview || ($scope.preview = {})).dataUrl = $scope.cropper.first('getCroppedCanvas', {
               width: 200,
               height: 200
           }).toDataURL("image/jpeg");

       });

   };
   $scope.save = function() {
        $scope.preview();
       var PhotoURL = $scope.Agents.currentAgent.profilepic || $scope.Agents.currentAgent.FirstName+'.'+$scope.Agents.currentAgent.LastName;
       $scope.Agents.currentAgent.profilepic = 'blank.jpg';
       var formData = {
           picture: $scope.cropper.first('getCroppedCanvas', {
               width: 200,
               height: 200
           }).toDataURL("image/png"),
           saveas: '/srv/jfsapp/Media/Images/Agents/Profile/' + PhotoURL
       };
       var postData = 'datas=' + JSON.stringify(formData);
       $http({
           method: 'POST',
           url: 'https://jfsapp.com/Secure/API/Images/Upload',
           params:{
           'access_token': $rootScope.currentUser.Token.access_token,
           client_id: 'testclient',
           client_secret: 'testpass'},
           data: formData
       }).then(function() {

            console.log(PhotoURL);
           $scope.Agents.currentAgent.profilepic = PhotoURL;
           //Agents.
           $scope.uploadVis = 'false';
       },function() {
           //console.log('Fail');
       });

   };
   $scope.saveRecruit = function() {
        $scope.preview();
        recruit.SetPictureURI({url:$scope.cropper.first('getCroppedCanvas', {
            width: 200,
            height: 200
        }).toDataURL("image/png")});
   };
   $scope.saveUser = function() {
        User.setProfilePic($scope.cropper.first('getCroppedCanvas', {
            width: 200,
            height: 200
        }).toDataURL("image/png"));
   };
   /**
    * Use cropper function proxy to call methods of the plugin.
    * See https://github.com/fengyuanchen/cropper#methods
    */
   $scope.clear = function(degrees) {
       if (!$scope.cropper.first) {return;}
       $scope.cropper.first('rotateTo', 45);
       $scope.cropper.first('clear');
       $scope.cropper.first('reset');

   };

   $scope.scale = function(width) {
       if (!$scope.cropper.first) {return;}
       Cropper.crop(file, data)
           .then(function(blob) {
               return Cropper.scale(blob, {
                   width: width
               });
           })
           .then(Cropper.encode).then(function(dataUrl) {
               ($scope.preview || ($scope.preview = {})).dataUrl = $scope.cropper.first('getCroppedCanvas', {
                   width: 150,
                   height: 150
               }).toDataURL("image/png");
           });
   };

   /**
    * Object is used to pass options to initalize a cropper.
    * More on options - https://github.com/fengyuanchen/cropper#options
    */
   $scope.options = {
       maximize: false,
       aspectRatio: 1 / 1,
       crop: function(dataNew) {
           data = dataNew;
       }
   };

   /**
    * Showing (initializing) and hiding (destroying) of a cropper are started by
    * events. The scope of the `ng-cropper` directive is derived from the scope of
    * the controller. When initializing the `ng-cropper` directive adds two handlers
    * listening to events passed by `ng-cropper-show` & `ng-cropper-hide` attributes.
    * To show or hide a cropper `$broadcast` a proper event.
    *$scope.imageurl = $scope.cropper.first('getCroppedCanvas', { width: 200, height: 200 }).toDataURL("image/jpeg");
    */
   $scope.showEvent = 'show';
   $scope.hideEvent = 'hide';
   $scope.rotateRight = function(degree) {
       if (!$scope.cropper.first) {return;}
       $scope.cropper.first('rotate', degree);
   };




});
