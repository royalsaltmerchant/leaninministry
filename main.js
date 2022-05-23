// INIT
if(window.location.pathname === '/index.html') getLatestPost()

/////////////// POSTS ///////////////
async function getLatestPost() {
  try {
    spinner(true)
    var res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/?number=1')
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    // format post date
    var dataDate = data.posts[0].date
    let formattedDate = getFormattedDate(dataDate)
    var html = /*html*/ `
      <section>
        <h2>${data.posts[0].title}</h2>
        <small class="date-time">${formattedDate}</small>
        <div>${data.posts[0].content}</div>
      </section>
    `
    $('#latest-post').innerHTML = html
  } catch(err) {
    spinner(false)
    console.log(err)
    var html = /*html*/ `<p>Error loading content...</p>`
    $('#latest-post').innerHTML = html
  }
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

// format date
function getFormattedDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: "2-digit",
    minute: "2-digit",
    hour12: true

  })
}