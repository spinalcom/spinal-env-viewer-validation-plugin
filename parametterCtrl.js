import {
  parameterGroup
} from "./parameterModel";

(function () {
  angular.module('app.spinalforge.plugin')
    .controller('parameterCtrl', ["$scope", "$rootScope", "$mdToast", "$mdDialog", "authService", "$compile", "$injector", "layout_uid", "spinalModelDictionary", "$q", "parametterService",
      function ($scope, $rootScope, $mdToast, $mdDialog, authService, $compile, $injector, layout_uid, spinalModelDictionary, $q, parametterService) {

        $scope.selectedAlert = null;
        $scope.referencial = null;
        $scope.selectedObject = null; // selection du group
        $scope.allParameter = []; // list de tous les paramettre associé au group

        parametterService.register(callback);

        function callback(mod, selectedObject) {
          if (mod) {
            $scope.selectedAlert = mod;
            if (selectedObject == null)
              $scope.selectedObject = mod;
            else
              $scope.selectedObject = selectedObject;
            if ($scope.selectedAlert.referencial) {
              $scope.selectedAlert = $scope.selectedAlert.referencial;
              $scope.referencial = $scope.selectedAlert.referencial;
            }

            console.log("ici est la liste des allObject");
            // console.log($scope.selectedAlert);
            // console.log($scope.selectedObject);
            $scope.allObject = mod.allObject;
            // $scope.$apply();
            $scope.selectedObject.bind($scope.onModelChange);
          }
          // $scope.openAlertList();
        }


        $scope.addParameter = (theme) => {

          $mdDialog.show($mdDialog.prompt()
              .title("add Group")
              .placeholder('Please enter the Name')
              .ariaLabel('Add Theme')
              .clickOutsideToClose(true)
              .required(true)
              .ok('Confirm').cancel('Cancel'))
            .then(function (result) {

              console.log(theme);
              console.log(result);
              let newParameter = new parameterGroup();
              newParameter.name.set(result);
              newParameter.value.set(0);
              if (theme.parameter) {
                console.log(theme.parameter);
                theme.parameter.push(newParameter);
              } else {
                console.log("sortparameter doesn't exist");
                theme.add_attr({
                  parameter: []
                });
                theme.parameter.push(newParameter);
                // theme.add_attr(parameter);
              }
            }, () => {});
        };

        $scope.onModelChange = () => {
          console.log("ici est onModelChange de parameter");
          console.log($scope.selectedObject);
          $scope.allParameter = [];
          for (let i = 0; i < $scope.selectedObject.parameter.length; i++) {
            $scope.allParameter.push($scope.selectedObject.parameter[i]);
          }
        };

        $scope.deleteParameter = (parameter) => {
          for (let i = 0; i < $scope.selectedObject.parameter.length; i++) {
            const element = $scope.selectedObject.parameter[i];
            if (parameter.name.get() == element.name.get())
              $scope.selectedObject.parameter.splice(i, 1);
          }


        };

      }
      // end of controller
    ]);
})();