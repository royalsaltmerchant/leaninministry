// INIT

// header
$('?header').innerHTML = /*html*/ `
  <img src="/assets/flowers1edit.webp" style="width: 140px;">
  <p>Tabitha Ministries</p>
  <i id="hamburger" style="font-size: 30px; cursor: pointer;" class="fa fa-bars mobile-nav"></i>
`

// nav
$('?nav').innerHTML = /*html*/ `
  <div>
  <a href="/index.html">Home</a>
  <a href="">About</a>
  <a href="/categories.html">Categories</a>
  <a href="">Recent</a>
  </div>
`

// footer
$('?footer').innerHTML = /*html*/ `
  <p>Contact me etc etc...</p>
  <a href="">Privacy Policy or Whatever</a>
`

// Globals
var postOffset = 0
var numberOfPosts = 0
var currentLocation = window.location.pathname.split('?')[0]
// on page loads
switch(currentLocation) {
  case '/index.html':
    getPost()
    break
  case '/categories.html':
    getCategories()
    break
  case '/category.html':
    getPostsbyCategory()
    break
}

// if(window.location.pathname === '/index.html') getPost()

/////////////// POSTS ///////////////
async function getPost() {
  $('#latest-post').innerHTML = ''
  try {
    spinner(true)
    var res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/?number=1&offset=${postOffset}`)
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    console.log(data)
    // set number of posts
    numberOfPosts = data.found
    // format post date
    var dataDate = data.posts[0].date
    var formattedDate = getFormattedDate(dataDate)
    // get categories for post
    var categoriesData = Object.values(data.posts[0].categories)
    // format html
    var html = /*html*/ `
      <section>
        <h2>${data.posts[0].title}</h2>
        <small class="date-time">${formattedDate}</small>
        <small id="categories-list">Categories: </small>
        <div>${data.posts[0].content}</div>
      </section>
    `
    $('#latest-post').innerHTML = html
    // set categories list
    categoriesData.forEach(category => {
      if(category.name !== "Uncategorized") {
        var element = document.createElement('a')
        element.innerHTML = `[${category.name}]`
        element.href = `/category.html?title=${category.name}`
        element.style.marginLeft = '10px'
        $('#categories-list').appendChild(element)
      }
    })
    // remove categories if none
    if($('#categories-list').children.length === 0) {
      $('#categories-list').remove()
    }
  } catch(err) {
    spinner(false)
    console.log(err)
    var html = /*html*/ `<p>Error loading content...</p>`
    $('#latest-post').innerHTML = html
  }
}

// get posts by category
async function getPostsbyCategory() {
  var category = window.location.search.split('=')[1]
  try {
    spinner(true)
    var res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/?category=${category}&number=1&offset=${postOffset}`)
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    console.log(data)
    data.posts.forEach(post => {
      var element = document.createElement('section')
      // format post date
      var formattedDate = getFormattedDate(post.date)
      // format html
      var html = /*html*/ `
        <h2>${post.title}</h2>
        <small class="date-time">${formattedDate}</small>
        <div>${post.content}</div>
      `
      element.style.marginBottom = '20px'
      element.innerHTML = html
      $('#posts').appendChild(element)
    })

  } catch(err) {
    spinner(false)
    console.log(err)
  }
}

function handlePrevious(mod, callback) {
  if(postOffset !== 0) {
    postOffset -= mod
    callback()
  }
}

function handleNext(mod, callback) {
  if(postOffset === numberOfPosts - 1) return
  postOffset += mod
  callback()
}

// get Categories
async function getCategories() {
  try {
    spinner(true)
    var res = await fetch('https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/categories')
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    console.log(data)
    data.categories.forEach(category => {
      var element = document.createElement('h2')
      element.innerHTML = /*html*/ `<a href="/category.html?title=${category.name}">${category.name}</a>`
      $('#categories').appendChild(element)
    })

  } catch(err) {
    spinner(false)
    console.log(err)
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