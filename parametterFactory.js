angular.module('app.spinalforge.plugin')
  .factory('parametterFactory', ["$rootScope", "$compile", "$templateCache", "$http",
    function ($rootScope, $compile, $templateCache, $http) {
      let load_template = (uri, name) => {
        $http.get(uri).then((response) => {
          $templateCache.put(name, response.data);
        }, (errorResponse) => {
          console.log('Cannot load the file ' + uri);
        });
      };
      let toload = [{
        uri: '../templates/spinal-env-viewer-validation-plugin/parametterTemplate.html',
        name: 'parametterTemplate.html'
      }];
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }
      this.panel = new PanelClass(v, "parametter panel");
      this.panel.container.style.right = "35%";
      this.panel.container.style.minWidth = "400px";
      this.panel.container.style.width = "450px";
      this.panel.container.style.height = "300px";
      this.panel.container.style.minHeight = "100px";
      this.panel.container.padding = "0px";

      var _container = document.createElement('div');
      _container.style.height = "calc(100% - 45px)";
      _container.style.overflowY = 'auto';
      this.panel.container.appendChild(_container);

      var init = false;
      return {
        getPanel: () => {

          if (init == false) {
            init = true;
            $(_container).html("<div ng-controller=\"parameterCtrl\" class=\"panelContent\" ng-cloak>" +
              $templateCache.get("parametterTemplate.html") + "</div>");
            $compile($(_container).contents())($rootScope);
          }

          return this.panel;
        }
      };
    }
  ]);


angular.module('app.spinalforge.plugin')
  .factory('parametterService', ["$rootScope", "$compile", "$templateCache", "$http", "parametterFactory",
    function ($rootScope, $compile, $templateCache, $http, parametterFactory) {

      var currentNote, selectedObject;
      var init = false;
      var myCallback = null;

      return {

        hideShowPanel: (note, _selectedObject) => {
          if (init == false) {
            init = true;
            this.panel = parametterFactory.getPanel();
          }
          if (!this.panel.isVisible()) {
            currentNote = note;
            selectedObject = _selectedObject;
            this.panel.setVisible(true);
            if (!_selectedObject)
              this.panel.setTitle(note.name + " - " + "Filter");
            else
              this.panel.setTitle(_selectedObject.name + -note.name);

          } else if (this.panel.isVisible() && note._server_id == currentNote._server_id) {
            this.panel.setVisible(false);
          } else {
            currentNote = note;
            selectedObject = _selectedObject;
            if (!_selectedObject)
              this.panel.setTitle(note.name + " - " + "Filter");
            else
              this.panel.setTitle(_selectedObject.name + " Group : " + note.name);

          }



          if (myCallback)
            myCallback(currentNote, selectedObject);
        },

        register: (callback) => {
          myCallback = callback;
          callback(currentNote, selectedObject);
        }

      };
    }
  ]);