/**
 * App object
 */
let app = {

  info: {
    uid: 'amAppBase',
    name: 'amAppBase v1.0',
    author: 'Anne Meinema'
  },

  user: {
    name: 'xxx',
    password: 'yyy',
    status: ''
  },

  settings: {
    theme: 'blue',  // where used: amCards.js
    dbLocation: 'local',
    textEditor: 'tinymce',
    sideNavMiniEnabled: true,
    sideNavMiniWidth: 80,
    sideNavMiniBreakpoint: 480,
    sideNavMaxiEnabled: true,
    sideNavMaxiBreakpoint: 800,
    sideNavMaxiWidth: 200
  },

  pages: [
    { page: "home", image: "media/icons/96x96/home.png", text: "Home", tooltip: 'Home' },
    { page: "bookmarksList", image: "media/icons/96x96/bookmarks.png", text: "Bookmarks", tooltip: 'Bookmarks' },
    { page: "about", image: "media/icons/96x96/info.png", text: "About", tooltip: 'About' },
    { page: "settings", image: "media/icons/96x96/settings.png", text: "Instellingen", tooltip: 'Instellingen' }
  ],

  data: {
    prevWindowWidth: 0,
    pageParam: ""
  },

  init: function () {
    console.log('app.init()')

    app.loadSettings();
    app.createAppTopNav();
    app.createAppSideNav();
    app.setTheme();
    app.updateSideNav();

    // Indien aanwezig gotoPage(<url hash>), ander gotoPage('home')
    let page = location.hash.slice(1)
    if (page !== "") {
      console.log('hash = ', page)
      app.gotoPage(page);
    } else {
      app.gotoPage('home');
    }

  },

  loadSettings: function () {
    app.settings = new amLocalStorage().get(this.info.uid, 'settings', this.settings);
    app.user = new amLocalStorage().get(this.info.uid, 'user', this.user);
  },

  saveSettings: function () {
    app.settings = new amLocalStorage().set(this.info.uid, 'settings', this.settings);
    app.user = new amLocalStorage().set(this.info.uid, 'user', this.user);
    app.updateSideNav()
  },

  createAppTopNav: function () {

    console.log('app.createAppTopNav()')
    app.data.appTopNav = new amBar({
      theme: app.settings.theme,
      container: '#div-app-top-nav',
      height: 52,
      title: app.info.name,

      // Wordt in app.css verborgen bij schermbreedte <= 480px 
      menuLeft: {
        action: 'menu-left'
      },

      buttons: [
        { icon: 'account-outline', action: 'user' },
        { icon: 'palette', action: 'theme' }
      ],

      menuRight: {
        // icon: 'more_vert',
        // action: 'right-menu', /* indien geen items voor een dropdown menu */
        // iconSize: 24, /* default icon size voor items in dropdown menu */
        items: [
          { icon: 'cog', text: 'Instellingen', action: 'settings' },
          { icon: 'information-outline', text: 'Over deze app', action: 'about' }
        ]
      },

      onAction: function (data) {

        let el = app.data.appTopNav.getActionId(data.action)

        switch (data.action) {

          case "menu-left":
            let list = new amList({
              theme: app.settings.theme,
              container: "popup",
              maxHeight: 800,
              noBorders: true,
              values: app.pages,

              tools: [],
              popup: {
                width: 240,
                x: 0,
                y: 52
              },

              closeOnAction: true,

              onAction: function (data) {
                list.close();
                app.gotoPage(data.page)
              }
            })
              .hideAllFields()
              .showFields(['image', 'text'])
              .changeField({ name: "image", type: "image", imageWidth: "36px", imageHeight: "auto", css: "width:55px" })
              .show();

            break;

          case "settings":
            app.gotoPage('settings')
            break;

          case "about":
            app.gotoPage('about')
            break;

          case "theme":

            let listTheme = new amList({
              theme: app.settings.theme,
              container: "popup",
              noBorders: true,
              values: ['blank', 'black', 'blue', 'red', 'teal'],
              popup: {
                title: 'Thema',
                width: 160,
                target: el,
                targetAlignX: 'right',
                targetOffsetY: 10
              },
              onAction: function (data, action) {
                if (action !== 'cancel') {
                  app.settings.theme = data.value;
                  app.saveSettings();
                  app.setTheme();
                }
                listTheme.close()
              }
            })
              .show();

            break;

          case "user":

            let formUser = new amForm({
              theme: app.settings.theme,
              container: 'popup',
              popup: {
                title: 'User',
                width: 250,
                target: el,
                targetAlignX: 'right',
                targetOffsetY: 10
              },
              labelSave: "Log in",
              fields: [
                { name: "name", label: "Naam", value: app.user.name },
                { name: "password", label: "Wachtwoord", type: 'password', value: app.user.password }
              ],
              onAction: function (data, action) {
                if (action !== "cancel") {
                  app.user = data;
                  app.saveSettings();
                  if (app.isAdmin()) {
                    amToast("Ingelogged als admin")
                  } else {
                    amToast("Onbekende user")
                  }
                  formUser.close()
                }
              }
            })
              .show();

            break;

          default:
            new amToast('appTopNav - onbekende action: ', data.action)

        }
      }
    }).show();
  },

  createAppSideNav: function () {

    console.log('app.createAppSideNav()')

    app.data.appSideNav = new amList({
      theme: app.settings.theme,
      container: "#div-app-side-nav",
      title: "",
      maxHeight: 1500,
      noBorders: true,
      values: app.pages,

      closeOnAction: false,
      onAction: function (data) {

        if (data.page != 'toolkit') {

          app.gotoPage(data.page)

        } else {

          let list = new amList({
            container: 'popup',
            theme: app.settings.theme,
            noBorders: true,
            values: [
              { text: 'Overzicht', page: 'toolkit' },
              { text: 'amBar', page: 'amBar' },
              { text: 'amCards', page: 'amCards' },
              { text: 'amDialog', page: 'amDialog' },
              { text: 'amForm', page: 'amForm' },
              { text: 'amList', page: 'amList' },
              { text: 'amMenu', page: 'amMenu' }
            ],
            popup: {
              // xxx
              title: 'Mijn toolkit',
              width: 200,
              x: window.event.pageX,
              y: window.event.pageY
            },
            onAction(data) {
              list.close()
              app.gotoPage(data.page);
            }
          })
            .hideField('page')
            .show()
        }

      }
    })
      .hideFields(['page', 'tooltip'])
      .changeField({ name: "image", type: "image", imageWidth: "36px", imageHeight: "auto", css: "width:46px; max-width: 46px" })
      .show();
  },

  sideNavHide: function () {
    console.log('app.sideNavHide()')

    $("td[data-type='menu-left']").show()

    $('.am-app-side-nav').css({
      display: 'none'
    })

    $('.am-app-main').css({
      left: '0px',
      width: '100%'
    })
  },

  sideNavMini: function () {
    console.log('app.sideNavMini()')

    if (this.settings.sideNavMiniEnabled == false) {
      this.sideNavHide();
      return;
    }

    app.data.appSideNav.hideField('text').redraw();

    $("td[data-type='menu-left']").hide()

    let w = parseInt(app.settings.sideNavMiniWidth) + 'px';

    $('.am-app-side-nav').css({
      display: 'block',
      width: w
    })

    $('.am-app-main').css({
      left: w,
      width: "calc(100% - " + w + ")"
    })
  },

  sideNavMaxi: function () {
    console.log('app.sideNavMaxi()')

    if (this.settings.sideNavMaxiEnabled == false) {
      this.sideNavMini();
      return;
    }

    app.data.appSideNav.showField('text').redraw();

    $("td[data-type='menu-left']").hide()

    let w = parseInt(app.settings.sideNavMaxiWidth) + 'px';

    $('.am-app-side-nav').css({
      display: 'block',
      width: w
    })

    $('.am-app-main').css({
      left: w,
      width: "calc(100% - " + w + ")"
    })
  },

  updateSideNav: function () {
    console.log('app.updateSideNav()')

    let windowWidth = window.innerWidth;

    if (windowWidth > app.settings.sideNavMaxiBreakpoint) {
      app.sideNavMaxi();
    }

    if (windowWidth <= app.settings.sideNavMaxiBreakpoint && windowWidth > app.settings.sideNavMiniBreakpoint) {
      app.sideNavMini();
    }

    if (windowWidth <= app.settings.sideNavMiniBreakpoint) {
      app.sideNavHide();
    }
  },

  isAdmin: function () {
    if (this.user.name === "admin" && amMd5(this.user.password) === "ee3f967fdb5643c8cb2e49a2e8c2ec85")
      return true;
    else
      return false;
  },

  isTrue: function (value) {
    if (value == true || value == 'true')
      return true;
    else
      return false;
  },

  /**
   * Private method _isApp
   * 
   * Retourneert true (app) of false (desktop of mobile browser)
   */
  isApp: function () {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      if (document.URL.indexOf("http://") === -1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  /**
   * gotoPage
   */
  gotoPage: function (page, param) {

    if (page == this.data.prevPage) {
      return
    }

    console.log('gotoPage', page)

    // Bijwerken sideNav
    app.data.appSideNav.setValue(page)

    // Optionele parameter met waarde voor tagFilter opslaan
    app.data.pageParam = (param !== undefined) ? param : "";

    // Hide alle pages
    $(".page").hide();

    // Als deze nog niet bestaat, append div voor page in div-app-main
    if ($("#div-page-" + page).length == 0) {
      $('#div-app-main').append("<div id='div-page-" + page + "' data-init=0 style='display: none' class='page'></div>");
    }

    let sDiv = "#div-page-" + page
    let sHtmlFile = "./pages/" + page + ".html"
    let el = $(sDiv)

    // Als page nog niet geinitialiseerd of met optionele param wordt aangeroepen ...
    if (el.attr('data-init') == 0 || app.data.pageParam !== "") {

      el.empty() // Mogelijk inhoud aanwezig na wisseling theme
      el.attr('data-init', 1)

      // Laden optionele <page>.html
      $(sDiv).load(sHtmlFile, function (response, status, xhr) {

        if (status == 'error') {
          // console.log(xhr.statusText + ' ' + sHtmlFile)
        }

        // Call optionele function initPage<Page> in <page>.js
        let fnString = "initPage" + page.charAt(0).toUpperCase() + page.slice(1);
        let fnName = window[fnString];
        if (typeof fnName === 'function') {
          console.log("Calling", fnString);
          fnName(param);
        }

      });

    }

    // Change hash
    window.location.hash = page;
    this.data.prevPage = page;

    // Show page
    el.show();

  },

  getTheme: function () {
    return this.setting.theme;
  },

  setTheme: function () {

    console.log('app.setTheme()')

    // Aanpassen appTopNav
    this.data.appTopNav.setTheme(this.settings.theme);

    let bgc = 'transparent';
    let bw = '0px';
    switch (this.settings.theme) {
      case 'blank':
        bgc = 'transparent';
        bw = '2px';
        break;
      case 'black':
        bgc = getCssVariable('black'); //'#F5F5F5';
        bw = '1px';
        break;
      case 'blue':
        bgc = getCssVariable('black'); // 'aliceblue';
        bw = '1px';
        break;
      case 'red':
        bgc = getCssVariable('red'); // '#F5F5F5';
        bw = '1px';
        break;
      case 'teal':
        bgc = getCssVariable('teal'); // '#F5F5F5';
        bw = '1px';
        break;
    }

    // Aanpassen appSideNav
    $('.am-app-side-nav').css({
      backgroundColor: bgc,
      borderWidth: 0,
      borderRightWidth: bw
    })

    // Aanpassen topNav
    $('.am-app-top-nav').css({
      border: 'solid 0px lightgrey'
    })
    if (this.settings.theme == 'blank') {
      $('.am-app-top-nav').css({ borderBottomWidth: '2px' })
    }

    // Aanpasssen pages
    // Zet data-init van alle pages op 0 om een re-init te forceren
    for (let i = 0; i < this.pages.length; i++) {
      $("#div-page-" + this.pages[i].page).attr('data-init', 0)
    }

  }

} // app

/**
 * Listener window hashchange
 */
window.addEventListener('hashchange', function (e) {

  let page = location.hash.slice(1)

  this.console.log('hashchange ', page)
  page = (page == "") ? 'home' : page
  app.gotoPage(page);
});

/**
 * Listener window resize
 */
window.addEventListener('resize', function (e) {

  let windowWidth = window.innerWidth;

  if ((windowWidth <= app.settings.sideNavMiniBreakpoint) && (app.data.prevWindowWidth >= app.settings.sideNavMiniBreakpoint || app.data.prevWindowWidth == 0)) {
    app.sideNavHide()
  }

  if ((windowWidth > app.settings.sideNavMiniBreakpoint) && (app.data.prevWindowWidth <= app.settings.sideNavMiniBreakpoint)) {
    app.sideNavMini()
  }

  if ((windowWidth <= app.settings.sideNavMaxiBreakpoint) && (app.data.prevWindowWidth > app.settings.sideNavMaxiBreakpoint)) {
    app.sideNavMini()
  }

  if ((windowWidth > app.settings.sideNavMaxiBreakpoint) && (app.data.prevWindowWidth <= app.settings.sideNavMaxiBreakpoint)) {
    app.sideNavMaxi()
  }

  app.data.prevWindowWidth = windowWidth;

});
/**
 * Init app
 */
app.init()