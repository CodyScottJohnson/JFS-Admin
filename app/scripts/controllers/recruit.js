'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:RecruitCtrl
 * @description
 * # RecruitCtrl
 * Controller of the JFS_Admin
 */
function ecopy(e) {
  var t = document.body.appendChild(document.createElement("textarea"));
  t.style.position = "absolute", t.style.left = "-9999px", t.setAttribute("readonly", ""), t.value = e, t.select();
  try {
    return document.execCommand("copy")
  } catch (o) {
    return !1
  } finally {
    t.parentNode.removeChild(t)
  }
}
angular.module('JFS_Admin')
  .controller('RecruitCtrl', function($scope, $rootScope, Task, Recruits, recruit, Dropbox, Functions, FileUploader, File, User, $sce) {
    $scope.newTextMessage="";
    $scope.clipboard = function(string) {
      ecopy(string);
      //console.log('coppied');
    }
    $scope.popSent = function() {
      recruit.popSent();
    }
    $scope.User = User.data;
    $scope.Task = Task.data;
    $scope.Recruit = recruit.data;
    $scope.toolbar = {
      vis: false
    };
    $scope.options2 = {
      segmentStrokeWidth: 1
    };
    $scope.colors2 = ['#97BBCD', '#DCDCDC', '#F7464A', '#FDB45C'];
    $scope.labels2 = ['', '', '', ''];
    $scope.previewFile = function(file) {
      Dropbox.PreviewFile(file).then(function(data) {
        Functions.OpenModal('views/Modals/FilePreview.html', 'lg', data);
      });
    };
    $scope.uploadFile = function() {
      Functions.OpenModal('views/Modals/FileUpload.html', 'lg');
    };
    $scope.sendPop = function() {

      recruit.data.popInfo.message = recruit.data.currentRecruit.FNAME + ',\n\nThis is the POP7 evaluation I mentioned in my first email.  Just click on the link below and you will be connected to the evaluation page.  If you have any questions, please feel welcome to contact myself or Scott Johnson at 801-296-2000\n\nThank you \n\n' + $scope.User.displayname + '\nAmerican National Insurance Company\nJohnson Agency'
      recruit.data.popInfo.subject = 'Online Profile Invitation for American National'
      recruit.data.popInfo.url = $sce.trustAsResourceUrl("https://www.selfmgmt.com/cgi-bin/pac.exe?function=InviteCandidate&ProgramLang=eng&TestType=POP7&TestLang=eng&Attachment=&Name=" + recruit.data.currentRecruit.FNAME + "&Subject=Online%20Profile%20Invitation&EMail=" + recruit.data.currentRecruit.EMAIL + "&CC=scott@anpac.net,david.moultrie@american-national.com&FromName=" + encodeURIComponent($scope.User.displayname) + "&ID=&Source=&FromTracker=&FromResumeLeads=&Resend=")
      ecopy(recruit.data.popInfo.message)
      Functions.OpenModal('views/Modals/sendPop.html', 'lg');
    };
    $scope.sendText = function(message) {
      var phone = $scope.Recruit.currentRecruit.BUS_PH_NBR.replace(/\D/g, '');
      if (phone.length >= 10 && phone.length <= 11) {

        if (phone.length == 10) {
          phone = '1' + phone
        }
        User.sendText(message,phone).then(function(data){recruit.getConversationHistory();});
        $scope.newTextMessage="";
      }
      else {
        Functions.Toast('toast', 'toast', $scope.Recruit.currentRecruit.BUS_PH_NBR + ' Is not a valid number');
      }
    }
    $scope.openSidebar = function(type) {
      User.data.visibility.recruitSidebar = true;
      $scope.toolbar.vis = false;
      User.data.visibility.recruitSidebarType = 'views/Recruiting/sidepanels/' + type;
      console.log($scope.User.visibility.recruitSidebarType)
    };
    $scope.File = File.data;
    $scope.File.recruitUploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      var newDoc = {
        filePath: response.path,
        fileName: fileItem.newName,
        fileType: fileItem.ext,
        fileSize: response.bytes,
        fileIcon: response.icon,
        fileUploaded: new Date(),
        fileUploadedBy: $rootScope.currentUser.user_id,
        title: fileItem.file.name

      };
      $scope.Recruit.currentRecruit.Info.Documents.push(newDoc);
    };
    $scope.addNote = function(note) {
      var formData = {
        userid: $rootScope.currentUser.Info.id,
        userName: $rootScope.currentUser.Info.display_name,
        userPhoto: $rootScope.currentUser.Info.display_photo,
        applicantid: 1,
        parentid: 0,

        text: note,
        datetime: moment.utc().format()
      };
      $scope.Recruit.currentRecruit.Info.Notes.push(formData);
      recruit.save();
    }
  });
