'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('NotesCtrl', function ($scope, $sce, User,UUID) {
    $scope.newNote = function() {
        $scope.currentNote = {
            id: UUID.newuuid(),
            Title: 'Note Title',
            body: 'Type Here'
        };
    };
    $scope.newNote();
    User.getNotes().then(function(notes){$scope.notes=notes;});
    $scope.selectNote = function(note){
      $scope.currentNote = note;
    };

    $scope.saveNote = function(note) {
      var index = _.findIndex($scope.notes, {
        'id': note.id
      });
      if (index !== -1) {
           note.lastUpdate = new Date();
           $scope.notes[index] = note;
       } else {
           note.created = new Date();
           $scope.notes.push(note);

       }
       User.setNotes($scope.notes);
   };
   $scope.deleteNote =function(note){
     var index = _.findIndex($scope.notes, {
       'id': note.id
     });
     $scope.notes.splice(index, 1);
     $scope.newNote();
     User.setNotes($scope.notes);
   };
    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
    $scope.editorOptions ={
      popover: {
    air: [
      ['fontclr', ['color']],
      ['textsize', ['fontsize']],
      ['font', ['bold', 'underline', 'clear']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['insert', ['link','picture','video']]
    ]
  }
    };
    $scope.showSidebar = false;
    $scope.text = "<p>Lorem ipsum dolor sit amet, erat labore aliquam est in. Ad vim choro ubique, pertinax conceptam at vim, usu eleifend petentium eloquentiam an. Ea pro fugit cetero offendit, nec ne choro equidem impedit, quod iudicabit usu ei. Nam ex elit dictas. Quo mazim prompta electram no, quo in libris corrumpit. Commune adipiscing an per, per no decore semper intellegat, ut duo alienum expetendis theophrastus. </p> <p>Doming option alienum quo at. Quodsi omnium nec cu, ad eos tation munere, te nam nibh movet. Ne unum pericula sit, esse nonumy adipiscing an mel. Decore pertinax te pri. Pro an dicit semper dissentiet, in sea posse legimus placerat, qui vero regione denique in. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p> <p>Mel meis cotidieque te, nam quis electram scribentur at. Sit probo invidunt te, ne per natum harum omittam. Timeam impedit ex sit. Quidam semper qui ei, at volumus assentior interpretaris quo. </p>";
  });
