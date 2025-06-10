/**
 * Page settings
 */

function initPageSettings() {

  new amCards({
      container: '#div-page-settings'
    })
    .add('Instellingen', { theme: app.settings.theme })
    .addBreak()
    .add({
      width: 300,
      header: 'Admin',
      content: "<div id='settings-form-user'></div>"
    })
    .add({
      width: 360,
      header: 'App instellingen',
      content: "<div id='settings-form-settings'></div>"
    })

  new amForm({
      theme: app.settings.theme,
      container: "#settings-form-user",
      showLabels: false,
      labelCols: 0,
      labelSave: "Toepassen",

      fields: [
        { name: "name", label: "Naam", icon: "account-outline", value: app.user.name },
        { name: "password", label: "Wachtwoord", type: 'password', icon: "key-outline", value: app.user.password }
      ],
      closeOnAction: false,
      onAction: function(data, action) {
        if (action !== "cancel") {
          app.user = data;
          app.saveSettings();
          if (app.isAdmin()) {
            amToast("Ingelogged als admin")
          } else {
            amToast("Onbekende user")
          }
          let pass = amMd5(app.user.password)
          amSetCookie('dbUser', app.user.name, 3)
          amSetCookie('dbPass', pass, 3)
          amSetCookie('dbUser', app.user.name, 3, 'ameinema.synology.me')
          amSetCookie('dbPass', pass, 3, 'ameinema.synology.me')
        }
      }
    })
    .show();


  new amForm({
      theme: app.settings.theme,
      container: "#settings-form-settings",
      labelCols: 3,
      labelSave: "Toepassen",

      fields: [
        { name: "theme", label: "Thema", type: "radio-list", options: ['blank', 'black', 'blue', 'red', 'teal'], value: app.settings.theme },
        { name: "dbLocation", label: "Database locatie", type: "radio", options: ["local", "remote"], value: app.settings.dbLocation },
        { name: "textEditor", label: "Text editor", type: "select", options: ["tinymce", "redactor"], value: app.settings.textEditor },

        { name: "html1", type: "html", value: `<div class='amForm-subheader'>Side menu mini</div>` },
        { name: "sideNavMiniEnabled", label: "Actief", type: "switch", value: app.settings.sideNavMiniEnabled },
        { name: "sideNavMiniWidth", label: "Breedte", type: "range", min: 60, max: 300, step: 10, value: app.settings.sideNavMiniWidth },
        { name: "sideNavMiniBreakpoint", label: "Breakpoint", type: "int", value: app.settings.sideNavMiniBreakpoint },

        { name: "html2", type: "html", value: `<div class='amForm-subheader'>Side menu maxi</div>` },
        { name: "sideNavMaxiEnabled", label: "Actief", type: "switch", value: app.settings.sideNavMaxiEnabled },
        { name: "sideNavMaxiWidth", label: "Breedte", type: "range", min: 60, max: 300, step: 10, value: app.settings.sideNavMaxiWidth },
        { name: "sideNavMaxiBreakpoint", label: "Breakpoint", type: "int", value: app.settings.sideNavMaxiBreakpoint },
      ],
      closeOnAction: false,
      onAction: function(data, action) {
        if (action !== "cancel") {
          app.settings = data;

          amToast("App instellingen bijgewerkt")
          app.saveSettings();
          app.setTheme();
        }
      }
    })
    .show();

}