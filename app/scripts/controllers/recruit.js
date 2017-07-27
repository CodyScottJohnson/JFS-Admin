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
  t.style.position = "absolute"; t.style.left = "-9999px"; t.setAttribute("readonly", ""); t.value = e; t.select();
  try {
    return document.execCommand("copy");
  } catch (o) {
    return !1;
  } finally {
    t.parentNode.removeChild(t);
  }
}
angular.module('JFS_Admin')
  .controller('RecruitCtrl', function($scope, $http, $rootScope, Task, Recruits, recruit, Dropbox, Functions, FileUploader, File, User, $sce,$location) {
    if(angular.isDefined($location.search().RecruitID))
    {
      recruit.setRecruit($location.search().RecruitID);
    }
    $scope.ViewTask = function(taskID) {
      Task.getTask(taskID);
      Functions.OpenModal('views/Modals/TaskModal.html', 'md');
    };
    $scope.newTextMessage="";
    $scope.clipboard = function(string) {
      ecopy(string);
      //console.log('coppied');
    };
    $scope.popSent = function() {
      recruit.popSent();
    };
    $scope.User = User.data;
    $scope.Task = Task.data;
    $scope.Recruit = recruit.data;
    $scope.getSocial = function(email){
      recruit.getSocial(email);
    };
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
    $scope.getFile = function(file) {
      Dropbox.getFile(file).then(function(data) {
        console.log(data);
      });
    };
    $scope.uploadFile = function() {
      Functions.OpenModal('views/Modals/FileUpload.html', 'lg');
    };
    $scope.sendPop = function() {
      console.log($rootScope.currentUser.Info);
      recruit.data.popInfo.message = recruit.data.currentRecruit.FNAME + ',\n\n' + (User.data.GlobalSettings.POP.EmailBody.replace('<br>','\n')).replace(/<\//g,'\n<').replace(/<[^>]+>/gm,'') + '\n' + $rootScope.currentUser.Info.display_name + '\nAmerican National Insurance Company\nJohnson Agency';
      recruit.data.popInfo.subject = (User.data.GlobalSettings.POP.EmailSubject.replace('<br>','\n')).replace(/<[^>]+>/gm,'');
      recruit.data.popInfo.url = $sce.trustAsResourceUrl("https://www.selfmgmt.com/cgi-bin/pac.exe?function=InviteCandidate&ProgramLang=eng&TestType=POP7&TestLang=eng&Attachment=&Name=" + recruit.data.currentRecruit.FNAME + "&Subject=Online%20Profile%20Invitation&EMail=" + recruit.data.currentRecruit.EMAIL + "&CC=scott@anpac.net,david.moultrie@american-national.com&FromName=" + encodeURIComponent($scope.User.displayname) + "&ID=&Source=&FromTracker=&FromResumeLeads=&Resend=");
      ecopy(recruit.data.popInfo.message);
      Functions.OpenModal('views/Modals/sendPop.html', 'lg');
    };
    $scope.popStatus = function(){
      if($scope.Recruit.currentRecruit.POP_Status!=='Test Sent' && $scope.Recruit.currentRecruit.POP_Status!=='Test Completed'){
        $scope.sendPop();
      }
      else{
          Functions.OpenModal('views/Modals/popStatus.html', 'lg');
      }
    };
    $scope.colorStatus = function(){
      if($scope.Recruit.currentRecruit.Color_Status!=='Test Sent' && $scope.Recruit.currentRecruit.Color_Status!=='Test Completed'){
        recruit.sendColor();
      }
      else{
          Functions.OpenModal('views/Modals/colorStatus.html', 'lg');
      }
    };
    $scope.sendColor = function(){
      recruit.sendColor();
    };
    $scope.sendText = function(message) {
      var phone = $scope.Recruit.currentRecruit.BUS_PH_NBR.replace(/\D/g, '');
      if (phone.length >= 10 && phone.length <= 11) {

        if (phone.length == 10) {
          phone = '1' + phone;
        }
        User.sendText(message,phone).then(function(data){recruit.getConversationHistory();});
        $scope.newTextMessage="";
      }
      else {
        Functions.Toast('toast', 'toast', $scope.Recruit.currentRecruit.BUS_PH_NBR + ' Is not a valid number');
      }
    };
    $scope.popFollowUp = function(){
      Functions.OpenModal('views/Modals/EmailComposer.html', 'lg');
    };
    $scope.popRecieved = function(){
      recruit.popRecieved();
    };
    $scope.colorRecieved = function(){
      recruit.colorRecieved();
    };
    $scope.openSidebar = function(type) {
      User.data.visibility.recruitSidebar = true;
      $scope.toolbar.vis = false;
      User.data.visibility.recruitSidebarType = 'views/Recruiting/sidepanels/' + type;
      console.log($scope.User.visibility.recruitSidebarType);
    };
    $scope.MarkAsDone = function(task){
      //task.Status = "Completed";
      Task.updateTask(task);
    };
    $scope.updateToDo = function(){
      recruit.updateToDo();
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
      recruit.save();
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
    };
    $scope.newTask = function(){
      Task.newTask({Recruit_ID:$scope.Recruit.currentRecruit.INDV_ID});
      Functions.OpenModal('views/Modals/TaskModal.html', 'md');
    };
    $scope.getTaskList = function(){
      recruit.getTaskList();
    };
    $scope.saveRecruit = function(){
      recruit.save();
    };
    $scope.saveRecruitStatus = function(recruit){
      $scope.Recruit.currentRecruit.NextStepUpdated = moment();
      $scope.saveRecruit();
    };
    $scope.SetPhoto = function(photo){
      recruit.SetPicture(photo);
    };
    $scope.test = function(){
      $http({
        method: 'POST',
        url: 'https://jfsapp.com/Secure/API/Email/Send/ContactCard',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        }
      });
    };
    $scope.fileIcon = function(type){
    console.log(type);
    if(['png','bmp','jpg','jpeg','tiff','gif'].indexOf(type)!== -1){
      return 'page_white_picture';
    }
    if(['application/x-rar-compressed', 'application/octet-stream','application/zip'].indexOf(type)!== -1){
      return 'page_white_zip';
    }
    if(['application/vnd.oasis.opendocument.text','application/x-iwork-pages-sffpages','application/msword','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.wordprocessingml.template','application/vnd.ms-word.document.macroEnabled.12','application/vnd.ms-word.template.macroEnabled.12','doc','docx'].indexOf(type)!== -1){
      return 'page_white_word';
    }
    if(['application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.presentationml.template','application/vnd.openxmlformats-officedocument.presentationml.slideshow','application/vnd.ms-powerpoint.addin.macroEnabled.12','application/vnd.ms-powerpoint.presentation.macroEnabled.12','application/vnd.ms-powerpoint.template.macroEnabled.12','application/vnd.ms-powerpoint.slideshow.macroEnabled.12','ppt','pptx'].indexOf(type)!== -1){
      return 'page_white_powerpoint';
    }
    if(['application/pdf','pdf'].indexOf(type)!== -1){
      return 'page_white_acrobat';
    }
    if(['application/vnd.oasis.opendocument.spreadsheet','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.spreadsheetml.template','application/vnd.ms-excel.sheet.macroEnabled.12','application/vnd.ms-excel.template.macroEnabled.12','application/vnd.ms-excel.addin.macroEnabled.12','application/vnd.ms-excel.sheet.binary.macroEnabled.12','csv','xlsx','xls'].indexOf(type)!== -1){
      return 'page_white_excel';
    }
    else{
      return 'page_white_text';
    }

  };
    $scope.Detail="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'> <html xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='Content-Type' content='text/html; charset=utf-8' /> <meta name='viewport' content='width=device-width, initial-scale=1' /> <title>Skyline Confirm Email</title> <style type='text/css'> @import url(https://fonts.googleapis.com/css?family=Lato:400); /* Take care of image borders and formatting */ img { max-width: 600px; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; } a { text-decoration: none; border: 0; outline: none; } a img { border: none; } /* General styling */ td, h1, h2, h3  { font-family: Helvetica, Arial, sans-serif; font-weight: 400; } body { -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:none; width: 100%; height: 100%; color: #37302d; background: #ffffff; } table { border-collapse: collapse !important; } h1, h2, h3 { padding: 0; margin: 0; color: black; font-weight: 400; } h3 { color: #21c5ba; font-size: 24px; } .important-font { color: #3B78A3; font-weight: bold; } .hide { display: none !important; } .force-full-width { width: 100% !important; } </style> <style type='text/css' media='screen'> @media screen { /* Thanks Outlook 2013! http://goo.gl/XLxpyl*/ td, h1, h2, h3 { font-family: 'Lato', 'Helvetica Neue', 'Arial', 'sans-serif' !important; } } </style> <style type='text/css' media='only screen and (max-width: 480px)'> /* Mobile styles */ @media only screen and (max-width: 480px) { table[class='w320'] { width: 320px !important; } table[class='w300'] { width: 300px !important; } table[class='w290'] { width: 290px !important; } td[class='w320'] { width: 320px !important; } td[class='mobile-center'] { text-align: center !important; } td[class*='mobile-padding'] { padding-left: 20px !important; padding-right: 20px !important; padding-bottom: 20px !important; } td[class*='mobile-block'] { display: block !important; width: 100% !important; text-align: left !important; padding-bottom: 20px !important; } td[class*='mobile-border'] { border: 0 !important; } td[class*='reveal'] { display: block !important; } } </style> </head> <body class='body' style='padding:0; margin:0; display:block; background:#ffffff; -webkit-text-size-adjust:none' bgcolor='#ffffff'> <table align='center' cellpadding='0' cellspacing='0' width='100%' height='100%'> <tr> <td align='center' valign='top' bgcolor='#ffffff'  width='100%'> <table cellspacing='0' cellpadding='0' width='100%'> <tr> <td style='border-bottom: 3px solid #226493;' width='100%'> <center> <table cellspacing='0' cellpadding='0' width='500' class='w320'> <tr> <td valign='top' style='padding:10px 0; text-align:left;' class='mobile-center'> <img  height='62' src='https://www.jfsapp.com/Images/Logos/JohnsonFinanceMain.png'> </td> </tr> </table> </center> </td> </tr> <tr> <td  bgcolor='#F1F4F8' valign='top' style='background-color: #F1F4F8; background-position: center;'> <!--[if gte mso 9]> <v:rect xmlns:v='urn:schemas-microsoft-com:vml' fill='true' stroke='false' style='mso-width-percent:1000;height:303px;'> <v:fill type='tile' src='https://www.filepicker.io/api/file/kmlo6MonRpWsVuuM47EG' color='#8b8284' /> <v:textbox inset='0,0,0,0'> <![endif]--> <div> <center> <table cellspacing='0' cellpadding='0' width='530' height='303' class='w320'> <tr> <td valign='middle' style='vertical-align:middle; padding-right: 15px; padding-left: 15px; text-align:left;' height='303'> <table cellspacing='0' cellpadding='0' width='100%'> <tr> <td> <h1>Cody</h1><br> <h2>Here is the link to the personality test we talked about. Please let me know if you have any problems taking it.</h2> <br> </td> </tr> </table> <table cellspacing='0' cellpadding='0' width='100%'> <tr> <td class='hide reveal'> &nbsp; </td> <td style='width:150px; height:33px; background-color: #3bcdc3;' > <div> <a href='#' style='background-color:#3B78A3;border-radius:4px;color:#ffffff;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;'>Take Test</a> </div> </td> <td> &nbsp; </td> </tr> </table> </td> </tr> </table> </center> </div> <!--[if gte mso 9]> </v:textbox> </v:rect> <![endif]--> </td> </tr> <tr> <td style='background-color:#ffffff;border-top: 3px solid #226493'> <center> <table cellspacing='0' cellpadding='0' width='100%' class='w320'> <tr> <td width='33%'></td> <td  width='33%'> <table cellspacing='0' cellpadding='30' width='100%'> <tr> <td style='text-align:center;'> <a href='#'> <img width='61' height='51' src='https://www.filepicker.io/api/file/vkoOlof0QX6YCDF9cCFV' alt='twitter' /> </a> <a href='#'> <img width='61' height='51' src='https://www.filepicker.io/api/file/fZaNDx7cSPaE23OX2LbB' alt='google plus' /> </a> <a href='#'> <img width='61' height='51' src='https://www.filepicker.io/api/file/b3iHzECrTvCPEAcpRKPp' alt='facebook' /> </a> </td> </tr> </table> </td> <td  width='33%'> <table class='force-full-width' cellspacing='0' cellpadding='0'> <tr> <td style='text-align: left;'> <span class='important-font'> Scott Johnson <br> </span> 533 W 2600 S <br> Suite 135 <br> Bountiful, Ut <br> 1(801)296-2000 </td> </tr> </table> </td> </tr> </table> </center> </td> </tr> </table> </td> </tr> </table> </body> </html>";
  });
