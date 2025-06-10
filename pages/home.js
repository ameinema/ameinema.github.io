/**
 * Page home
 */

function initPageHome() {

    let cardsDaily = new amCards({
      container: '#div-page-home',
      dbLocation: app.settings.dbLocation,
      cardBorderWidth: 1
    })
    .add({
      theme: 'blue-gradient',
      width: 150,
      header: 'Dashboard',
      content: `
        Welkom op de website van Anne Meinema.</br></br> 
        Dit dashboard bevat links voor mijn meest gebruikte websites, 
        verdeeld over diverse categorieën.</br></br>`,
      footer: `
        <img style='width:100%; max-width: 256px; height:auto;' src='./media/icons/256x256/bookmarks.png' />`,
      borderBottomTheme: 'blue'         
    })
    .add({
      theme: 'black-gradient',
      width: 250,
      maxWidth: 480,
      minHeight: 200,
      header: `${app.info.name}`,
      collapsableX: true,
      collapsed: true,
      content: ` 
          <button class='am-btn am-btn-blue am-btn-block' onclick='app.gotoPage("bookmarksJson")'>Bookmarks</button>
          <button class='am-btn am-btn-blue am-btn-block' onclick='app.gotoPage("about")'>About</button>
          <button class='am-btn am-btn-blue am-btn-block' onclick='app.gotoPage("settings")'>Instellingen</button>
        `,
      footer: `(c) 2025 ${app.info.author}`,
      borderBottomTheme: 'black' 
    })
    .addAmBookmarks({
      theme: 'teal-gradient',
      width: 250,
      header: 'Nieuws',

      /* Variant 1 met parameters data en content 
         - data bevat JSON met bookmarks
         - content bevat string met tags waarop moet worden gefilterd
      */
      data: bookmarksJsonData,
      tags: 'nieuws-algemeen favorieten',

      /* Variant 2 met alleen parameter data */
      /*
      data: [ 
        {naam: "AD", url: "https://www.ad.nl"},
        {naam: "Nu", url: "https://www.nu.nl"},
        {naam: "NOS", url: "https://www.nos.nl"},
        {naam: "Telegraaf", url: "https://telegraaf.nl"},
        {naam: "Volkskrant", url: "https://volkskrant.nl"}
      ],
      */ 

      borderBottomTheme: 'teal' 
    })
    .addAmBookmarks({
      theme: 'blue-gradient',
      width: 250,
      header: 'Zoeken',
      data: bookmarksJsonData,
      tags: 'zoekmachine favorieten',        
      borderBottomTheme: 'blue' 
    })
    .addAmBookmarks({
      theme: 'red-gradient',
      width: 250,
      header: 'Google',
      data: bookmarksJsonData,
      tags: 'google favorieten',        
      borderBottomTheme: 'red' 
    })
    .addAmBookmarks({
      theme: 'teal-gradient',
      width: 250,
      header: 'Microsoft',
      data: bookmarksJsonData,
      tags: 'microsoft favorieten',        
      borderBottomTheme: 'teal' 
    })
    .addImage({
      theme: 'black-gradient',
      width: 240,
      maxWidth: 240,
      border: true,
      header: 'Me working..',
      headerDivider: true,
      image: './media/webdeveloper.jpeg',
      borderBottomTheme: 'black'
    })
  }  
