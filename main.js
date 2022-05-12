// INIT
if(window.location.pathname === '/index.html') getLatestPost()
console.log('test')

/////////////// POSTS ///////////////
function getLatestPost() {
  api(
    'https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/?number=1',
    function success(data) {
      console.log(data)
      var html = /*html*/ `
        <section>
          <h2>${data.posts[0].title}</h2>
          <div>${data.posts[0].content}</div>
        </section>
      `
      $('#latest-post').innerHTML = html
    },
    function error() {
      console.log('Error with latest post API call')
      var html = /*html*/ `<p>Error loading content...</p>`
      $('#latest-post').innerHTML = html
    }
  )
}

//////////////////// API Old School Method ////////////////////////
function api(path, success, error) {
  var xhr = new XMLHttpRequest()

  xhr.open('GET', path, true)
  xhr.onreadystatechange = function() {
    if(this.readyState == 4) {
      spinner(false);
      var res = xhr.response;
      if(this.status == 200) success(JSON.parse(res))
      else {
        error()
      }
    }
  }

  xhr.send()
  spinner(true)
}

//////////////////// Utilities /////////////////////////////

// spinner loader
function spinner(show) {
  if (show) {
    $('#spinner').style = 'display: block'
  }
  else {
    $('#spinner').style = 'display: none'
  }
}

// JQuery Select
function $(sel) {
  switch(sel.charAt(0)) {
    case '#': return document.getElementById(sel.slice(1))
    case '.': return document.getElementsByClassName(sel.slice(1))
    case '?': return document.querySelector(sel.slice(1))
    case '&': return document.querySelectorAll(sel.slice(1))
    default: return document.getElementsByTagName(sel)
  }
}