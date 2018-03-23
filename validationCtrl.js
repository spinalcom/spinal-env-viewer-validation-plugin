(function () {
  angular.module('app.spinalforge.plugin')
    .controller('validationCtrl', ["$scope", "$rootScope", "$mdToast", "$mdDialog", "authService", "$compile", "$injector", "layout_uid", "spinalModelDictionary", "$q", "parametterService",
      function ($scope, $rootScope, $mdToast, $mdDialog, authService, $compile, $injector, layout_uid, spinalModelDictionary, $q, parametterService) {

        var viewer = v;
        $scope.validationGroup = null; // path to forgefile.validationPlugin
        $scope.validationGroupList = null; // list of all validationGroupList
        $scope.allParameter = []; // all parameter used for search

        spinalModelDictionary.init().then((m) => {
          console.log("spinal model dictionary");
          if (m) {
            // console.log(m);
            // console.log(m.validationPlugin);
            if (m.validationPlugin) {
              m.validationPlugin.load((mod) => {
                console.log("ON CHARGE LES DONNEE PRESENTE DANS validation PLUGIN");
                console.log(mod);
                $scope.validationGroup = mod;
                $scope.validationGroup.bind($scope.onModelChange);
                // $scope.selectGroup = mod;
                // $scope.selectGroup.bind($scope.onModelChange);
              });
            } else {
              console.log("delete of validation plugin");
              $scope.validationGroup = new Lst();
              m.add_attr({
                validationPlugin: new Ptr($scope.validationGroup)
              });
              $scope.validationGroup.bind($scope.onModelChange);
            }
          }
        }, function () {
          console.log("model unreachable");
        });


        $scope.onModelChange = () => {
          $scope.validationGroupList = [];
          for (let i = 0; i < $scope.validationGroup.length; i++) {
            const group = $scope.validationGroup[i];
            $scope.validationGroupList.push(group);
          }
        };

        $scope.start = (theme) => {
          console.log(theme);
          console.log(viewer);
          $scope.allParameter = [];
          $scope.valide = false;
          for (let i = 0; i < theme.parameter.length; i++) {
            $scope.allParameter.push(theme.parameter[i]);
          }

          console.log($scope.allParameter);

          for (let i = 0; i < theme.allObject.length; i++) { // on verifie parmi tous les item du referenciel si les attribut sont présent, on check pas encore la value
            const bimObject = theme.allObject[i];
            viewer.getProperties(bimObject.dbId.get(), (result) => { // result est les properties du bim object
              console.log('there is all properties');
              console.log(result);
              $scope.valide = true;
              let validation = false;
              let partValidation = false;
              let tabValidation = [];
              let tabPartValidation = [];
              for (let k = 0; k < $scope.allParameter.length; k++) {
                const parameter = $scope.allParameter[k];
                validation = false;
                partValidation = false;
                for (let j = 3; j < result.properties.length; j++) { // pour toutes les properties de l'objet 
                  const properties = result.properties[j];
                  if (parameter.name.get() == properties.displayName) {
                    validation = true;
                    if (properties.displayValue == "") {
                      partValidation = true;
                    }
                  }
                }
                tabPartValidation.push(partValidation);
                tabValidation.push(validation);
              }

              tabValidation.forEach(element => {
                if (element == false)
                  $scope.valide = false;
              });
              tabPartValidation.forEach(element => {
                if (element == true)
                  $scope.partValide = true;
              });

              if ($scope.valide) {
                console.log("validation");
                if ($scope.partValide) {
                  for (let l = 0; l < theme.group.length; l++) {
                    const group = theme.group[l];
                    if (group.name.get() == "non rempli" || group.name.get() == "Non rempli")
                      bimObject.group.set(group.id.get());
                  }
                } else {
                  for (let l = 0; l < theme.group.length; l++) {
                    const group = theme.group[l];



                    if (group.name.get() == "Present" || group.name.get() == "present")
                      bimObject.group.set(group.id.get());
                  }
                }


              } else {
                console.log("invalide");
                for (let l = 0; l < theme.group.length; l++) {
                  const group = theme.group[l];
                  if (group.name.get() == "Non present" || group.name.get() == "non present")
                    bimObject.group.set(group.id.get());
                }
              }

            }, (err) => {
              console.log("error to get all properties with dbid");
              console.log(err);
            });

          }
        };

        $scope.parametter = (theme) => {
          console.log(theme);
          console.log("lala");
          parametterService.hideShowPanel(theme);
        };

        $scope.deleteGroup = (theme) => {
          console.log(theme)

          // console.log(note);
          var dialog = $mdDialog.confirm()
            .ok("Delete !")
            .title('Do you want to remove it?')
            .cancel('Cancel')
            .clickOutsideToClose(true);

          $mdDialog.show(dialog)
            .then((result) => {

              for (let i = 0; i < $scope.validationGroupList.length; i++) {
                const element = $scope.validationGroupList[i];
                console.log(element);
                if (element._server_id == theme._server_id)
                  $scope.validationGroup.splice(i, 1);
              }
              for (let i = 0; i < $scope.validationGroupList.length; i++) {
                const element = $scope.validationGroupList[i];
                if (element._server_id == theme._server_id)
                  $scope.validationGroupList.splice(i, 1);
              }


            }, () => {});
        };



      }
      // end of controller
    ]);
})();