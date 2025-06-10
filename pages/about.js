/**
 * Page about
 */

function initPageAbout() {

  console.log('initPageAbout');

  let sFooter = "";
  if (app.isAdmin()) {
    sFooter = `
      <button class='am-btn am-btn-blue am-btn-outline' onclick ='app.gotoPage("home")'>Home</button>
      <button class='am-btn am-btn-blue am-btn-outline' ondblclick='app.gotoPage("bookmarksList18")'>Bookmarks</button>
      <button class='am-btn am-btn-blue am-btn-outline' ondblclick='app.gotoPage("bookmarksPortal18")'>BookmarksPortal</button>
      ` 
  } else {
    sFooter = `
      <button class='am-btn am-btn-blue am-btn-outline' onclick = 'app.gotoPage("home")'>Home</button>
      ` 
  }

  new amCards({
      container: '#div-page-about'
    })
    .add('About', { theme: app.settings.theme })
    .addBreak()    
    .add({
      header: 'About me',
      content: 'This is a placeholder for about me.', 
      width: 300,
      minHeight: 200,
      footer: sFooter 
    })
    //.addBreak()
    .add({
      header: 'About te app',
      content: 'This is a placeholder for about the app.'
    })



}