(function () {
  let appSpinalforgePlugin = angular.module('app.spinalforge.plugin');
  appSpinalforgePlugin.run(["$rootScope", "$compile", "$templateCache", "$http", "spinalRegisterViewerPlugin",
    function ($rootScope, $compile, $templateCache, $http, spinalRegisterViewerPlugin) {
      spinalRegisterViewerPlugin.register("PanelValidation");
      let load_template = (uri, name) => {
        $http.get(uri).then((response) => {
          $templateCache.put(name, response.data);
        }, (errorResponse) => {
          console.log('Cannot load the file ' + uri);
        });
      };
      let toload = [{
        uri: '../templates/spinal-env-viewer-validation-plugin/validationTemplate.html', // à modifié lors de la création pannel
        name: 'validationTemplate.html'
      }];

      // , {
      //   uri: '../templates/spinal-env-viewer-annotation-group-pannel/commentTemplate.html',
      //   name: 'commentTemplate.html'
      // }
      for (var i = 0; i < toload.length; i++) {
        load_template(toload[i].uri, toload[i].name);
      }

      class PanelValidation {
        constructor(viewer, options) {
          Autodesk.Viewing.Extension.call(this, viewer, options);
          this.viewer = viewer;
          this.panel = null;
        }

        load() {
          if (this.viewer.toolbar) {
            this.createUI();
          } else {
            this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
            this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
          }
          return true;
        }

        onToolbarCreated() {
          this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
          this.onToolbarCreatedBinded = null;
          this.createUI();
        }

        unload() {
          this.viewer.toolbar.removeControl(this.subToolbar);
          return true;
        }

        createUI() {
          var title = 'SpinalBIM Analyzer';
          this.panel = new PanelClass(this.viewer, title);
          var button1 = new Autodesk.Viewing.UI.Button(title);

          button1.onClick = (e) => {
            if (!this.panel.isVisible()) {
              this.panel.setVisible(true);
            } else {
              this.panel.setVisible(false);
            }
          };

          button1.addClass('fa');
          button1.addClass('fa-check-circle');
          button1.addClass('fa-2x');
          button1.addClass('spinalColorButton');
          button1.setToolTip(title);

          this.subToolbar = this.viewer.toolbar.getControl("spinalcom2");
          if (!this.subToolbar) {
            this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('spnalcom2');
            this.viewer.toolbar.addControl(this.subToolbar);
          }
          this.subToolbar.addControl(button1);
          this.initialize();
        }

        initialize() {

          var _container = document.createElement('div');
          _container.style.height = "calc(100% - 45px)";
          _container.style.overflowY = 'auto';
          this.panel.container.appendChild(_container);

          $(_container).html("<div ng-controller=\"validationCtrl\" ng-cloak>" +
            $templateCache.get("validationTemplate.html") + "</div>");
          $compile($(_container).contents())($rootScope);
        }
      } // end class

      Autodesk.Viewing.theExtensionManager.registerExtension('PanelValidation', PanelValidation);
    } // end run
  ]);

  require("./parameterModel.js");
  require("./validationCtrl.js");
  require("./parametterFactory.js");
  require("./parametterCtrl");
  // require("./moussa_template/main.js");


})();
