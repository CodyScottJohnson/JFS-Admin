'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:EmailClientCtrl
 * @description
 * # EmailClientCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('EmailClientCtrl', function ($scope, Email, $sce, $interpolate, $parse, Recruits) {
    Email.getTemplates();
    $scope.expand_address = true;
    $scope.Email = Email.data;
    Recruits.updateRecruits().then(function(){
      $scope.RecipientList = Recruits.data.List;
      console.log(Recruits.data.List);
    });
    $scope.summernoteOptions ={toolbar:[
        ['custom',['pageTemplates','blocks']], // Custom Buttons
        ['style',['style']],
        ['font',['bold','italic','underline','clear']],
        ['fontname',['fontname']],
        ['color',['color']],
        ['para',['ul','ol','paragraph']],
        ['height',['height']],
        ['table',['table']],
        ['insert',['media','link','hr']],
        ['insert', ['template']],
        ['view',['fullscreen','codeview']],
        ['help',['help']]
    ],
    template:{
        path: '/views/Shared/summernote',
        list: {
           'firstname': 'Recipient First Name',
           'lastname': 'Recipient Last Name'
       }
    }};
    $scope.templateFilter = {Type:'Default'};
    $scope.variables = {FNAME:'John'};
    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml($interpolate(html_code.replace('\\',''))($scope.variables));

    };
    $scope.Preview = function(template)
    {
      Email.PreviewTemplate(template,{First_Name:$scope.Email.currentRecipient.FNAME,GUID:'Invalid'}).then(function(data){
        $scope.currentPreview = $sce.trustAsHtml(data);
      });
    };
    $scope.setCurrent = function(email){
      $scope.Preview(email.Template);
      $scope.Email.Templates= _.map($scope.Email.Template, function(x) {
        x.selected = false;
        return x;
      });
      email.selected = true;
      _.forEach(email.Variables, function(variable){
                    if(!angular.isDefined($scope.variables[variable.name])){
                        $scope.variables[variable.name]='';
                    }
                    if(angular.isDefined(variable.default)){
                        $scope.variables[variable.name] = $scope.$eval(variable.default);
                    }
                  });
      $scope.Email.CurrentEmail = email;
      $scope.HideMenu=!$scope.HideMenu;
    };
    $scope.send = function(){
      var EmailData = {
        First_Name: $scope.Email.currentRecipient.FNAME,
        Last_Name: $scope.Email.currentRecipient.LNAME,
      };
      Email.Send($scope.Email.currentRecipient.EMAIL,Email.data.CurrentEmail.Subject,Email.data.CurrentEmail.Template,EmailData,$scope.Email.currentRecipient.INDV_ID);
    };
    $scope.setFavorite = function(email){
      var index = _.findIndex(Email.data.Templates, {
        'Template_ID': email.Template_ID
      });
      email.favorite = !email.favorite;
      Email.data.Templates[index].favorite = email.favorite;
    };
  });
