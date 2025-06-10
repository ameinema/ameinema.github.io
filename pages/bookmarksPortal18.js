/**
 * Page home
 */

function initPageBookmarksPortal18() {

    let cardsDaily = new amCards({
      container: '#div-page-bookmarksPortal18',
      dbLocation: app.settings.dbLocation,
      cardBorderWidth: 1
    })
    .addAmBookmarks({
      theme: 'blue-gradient',
      width: 250,
      header: 'Live cams',
      data: bookmarksJsonData18,
      tags: 'cam-live',
      borderBottomTheme: 'blue' 
    })
    .addAmBookmarks({
      theme: 'teal-gradient',
      width: 250,
      header: 'Cam recordings',
      data: bookmarksJsonData18,
      tags: 'cam-recording favorieten',        
      borderBottomTheme: 'teal' 
    })
    .addAmBookmarks({
      theme: 'red-gradient',
      width: 250,
      header: 'Tube',
      data: bookmarksJsonData18,
      tags: 'tube favorieten',        
      borderBottomTheme: 'red' 
    })
    .addAmBookmarks({
      theme: 'black-gradient',
      width: 250,
      header: 'Pictures',
      data: bookmarksJsonData18,
      tags: 'pics favorieten',        
      borderBottomTheme: 'black' 
    })
  }  
