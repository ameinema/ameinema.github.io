/**
 * Page bookmarks
 */

function initPageBookmarksList18(param) {

  // Sorteer data op veld 'naam' 
  bookmarksJsonData18.sort((a, b) => { 
    if (a.naam.toLowerCase() < b.naam.toLowerCase()) return -1; if (a.naam.toLowerCase() > b.naam.toLowerCase()) return 1; return 0 
  });

  $('#div-page-bookmarksList18').append("<div id='div-page-bookmarksList18-header'></div>");
  $('#div-page-bookmarksList18').append("<div id='div-page-bookmarksList18-body'></div>");
  $('#div-page-bookmarksList18').append("<div id='div-page-bookmarksList18-footer'></div>");

  var barMain = new amBar({

    theme: "blank",
    container: "#div-page-bookmarksList18-header",
    height: 48,

    showFilter: true,
    filterPos: "left",

    buttons: [    
      { icon: "view-sequential", action: "view-list" },
      { icon: "view-grid", action: "view-cards" },
      { icon: "cog", action: "settings" },
      { icon: "plus", action: "insert" }
    ],

    menuRight: {
      // icon: 'more_vert',
      // action: 'right-menu', /* indien geen items voor een dropdown menu */
      // iconSize: 24, /* default icon size voor items in dropdown menu */
      menuWidth: 250, /* default = 200 */
      items: [
        { icon: "sort-alphabetical-ascending", text: "Sorteer op naam", action: "view-sort-name" },
        { icon: "sort-calendar-ascending", text: "Sorteer op datum aangemaakt", action: "view-sort-date-ins" },
        { icon: "sort-calendar-ascending", text: "Sorteer op datum gewijzigd", action: "view-sort-date-upd" },  
        { icon: "export", text: "Exporteer als CSV", action: "export-table-csv" }  
      ]
    },

    onAction: function(data) {

      switch (data.action) {

        // Actions
        case "view-sort-name":
          app.data.bookmarksList18.sort("naam");
          break;

        case "view-sort-date-ins":
          app.data.bookmarksList18.sort("-aangemaakt", "naam");
          break;

        case "export-table-csv":
          app.data.bookmarksList18.exportTableAsCsv();
          new amToast(`Database tabel is geexporteerd als CSV file`)
          break;

        case "view-sort-date-upd":
          app.data.bookmarksList18.sort("-gewijzigd", "naam");
          break;

        case "view-list":
          app.data.bookmarksList18.setView("list");
          break;

        case "view-cards":
          app.data.bookmarksList18.setView("cards");
          break;

        case "settings":
          app.data.bookmarksList18.showSettings();
          break;

        case "insert":
          app.data.bookmarksList18.recordInsert();
          break;
      }
    }

  }).show();

  var barTabs = new amBar({

    theme: "default",
    container: "#div-page-bookmarksList18-header",
    css: "margin-bottom: 5px",
    height: 32,

    tabs: [
      { text: "favorieten", action: "favorieten", selected: true },
      { text: "microsoft", action: "microsoft" },
      { text: "google", action: "google" }
    ],
    tabsMore: ["alle", "multimedia", "webdevelopment", "weer"],

    tabsFullWidth: true,
    tabsAddTabAll: false,

    onAction: function(data) {
      app.data.listBookmarks18Json.setTagFilter(data.action);
    }

  }).show();

  var footer = new amBar({

    theme: app.settings.theme,
    container: "#div-page-bookmarksList18-footer",

    height: 40,
    title: "Records: "

  }).show();

  var renderBookmarksCard18 = function(self, data, cardIndex) {
    var r = "";

    sFavicon = "<img width='32px' height='32px' src='http://www.google.com/s2/favicons?domain=" + data.url + "' />";

    var arrNameParts = [];
    arrNameParts = data.naam.split(" - ");
    var sName = arrNameParts[0];
    if (arrNameParts.length > 1) {
      sName += "<br />" + arrNameParts[1];
    }

    // Aanwezigheid (verborgen) velden 'tags' en 'omschrijving' is nodig voor filter functie
    // Class am-card-img wordt gebruikt om te herkennen dat img is geselecteerd. Zie onAction.

    r += "<div class='am-card' style='width:250px; max-width:350px; margin:5px; flex-grow:1; background-color:aliceblue; min-height:120x'>";
    r += "  <div class='am-card-header' style='color: grey; background-color:aliceblue; min-height:64px'><span class='am-card-img' style='float:right; margin-left: 5px'>" + sFavicon + "</span>" + sName + "</div>";
    r += "  <div class='am-card-content' style='display:none'>";
    r += "    <div class='am-card-text'>";
    r += data.omschrijving;
    r += self.getHtmlCardTags(cardIndex);
    r += "    </div>";
    r += "  </div>";
    r += "  <div class='am-card-footer' style='display:none;'><span style='margin-top:10px;float:right'>" + self.getHtmlRowActions(cardIndex) + "</span></div>";
    r += "</div>";

    return r;
  }

  // Als aanwezig, tagFilter uit app.data.pageParam gebruiken, anders default 'favorieten' 
  let sTagFilter = (app.data.pageParam > "") ? app.data.pageParam : "favorieten"

  // Globale variabele t.b.v. toegang tot setTheme
  app.data.listBookmarks18 = new amList({

      log: false,
      uid: "amAppBaseBookmarksList18", // tbv (re)store settings in amList in localStorage

      theme: app.settings.theme,
      view: "list",
      container: "#div-page-bookmarksList18-body",

      fullHeight: true,
      marginBottom: 50, // tbv ruimte eventuele header(s) en footer

      showFilter: false,
      externalFilter: barMain,
      showFieldNames: false,

      rowMinHeight: (this._isApp) ? 64 : 36,
      closeOnAction: false,
      textEditor: app.settings.textEditor,

      values: bookmarksJsonData18,
      /*
      dbLocation: app.settings.dbLocation,
      dbTable: "am_bookmarks",
      dbFields: "id, naam, url, tags, omschrijving, aangemaakt, gewijzigd",
      dbOrderBy: "naam",
      */
      fields: [
        { name: "id", hidden: true, type: "card", render: renderBookmarksCard18 },
        { name: "id", hidden: true },
        { name: "naam" },
        { name: "url", hidden: true, type: "url" },
        { name: "tags", align: "right", hidelt: 640, type: "tags" },
        { name: "omschrijving", hidden: true },
        { name: "aangemaakt", hidden: false, hidelt: 1024, css: "width:130px", render: "renderAangemaakt" },
        { name: "gewijzigd", hidden: false, hidelt: 1400, css: "width:130px", render: "renderGewijzigd" }
      ],
      renderAangemaakt: function(data) {
        return "<i class='fa fa-calendar'></i> " + data.aangemaakt.substr(0, 10);
      },
      renderGewijzigd: function(data) {
        return "<i class='fa fa-calendar'></i> " + data.gewijzigd.substr(0, 10);
      },


      rowActions: [
        //{ icon: "open-in-new", text: "Open", action: "open" },
        { icon: "chevron-right", text: "Info", action: "info" }
      ],


      onAction: function(data, action, className) {

        var options = {};

        if (className === 'am-card-img') {
          action = 'info';
          options = {
            showSwitchButtons: true
          };
        }

        switch (action) {

          // Row actions
          case "select":
            if (app.data.listBookmarks18.options.view !== 'split') {
              window.open(data.url, "_blank");
            }
            else {
              app.data.listBookmarks18.recordInfo(options);
            }
            break;

            case "open":
                window.open(data.url, "_blank");
              break;
  
          case "info":
            app.data.listBookmarks18.recordInfo(options);
            break;

        } // switch

      },
      onChange: function(recordCount, recordTotal, tags, tagFilter) {
        footer.setTitle("Records: " + recordCount + " / " + recordTotal);
        barTabs.setTabs(tags, tagFilter)
      }
    })
    .prependField({
      name: "favicon",
      type: "favicon",
      faviconSize: 32
    })
    .setTagFilter(sTagFilter)
    .show();
}