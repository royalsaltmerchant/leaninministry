// INIT

// header
$('?header').innerHTML = /*html*/ `
  <img src="/assets/flowers1edit.webp" style="width: 140px;">
  <h1>Lean In...</h1>
  <p class="tag-line">by Lisa Nolte</p>
  <i id="hamburger" style="font-size: 30px; cursor: pointer;" class="fa fa-bars mobile-nav" onmouseup="handleMobileNavClick()"></i>
`

// nav
$('?nav').innerHTML = /*html*/ `
  <div id="nav-main">
    <a href="/index.html">Home</a>
    <a href="/about.html">About</a>
    <a href="/categories.html">Topics</a>
    <a href="https://open.spotify.com/show/60fggeLPuS4dlGGJaSNtHJ?si=02daa795a75343cc">Podcast</a>
    <form onsubmit="handleSearch(event)">
      <input id="search" size="20"><input type="submit" value="Search">
    </form>
  </div>
`

// footer
// $('?footer').innerHTML = /*html*/ `
//   <p>~ A blog for women by Lisa Nolte ~</p>
//   <a href="">Contact Lisa</a>
// `

// Globals
var postOffset = 0
var numberOfPosts = 0
var currentLocation = window.location.pathname.split('?')[0]
// on page loads
console.log(currentLocation)
switch(currentLocation) {
  case '/':
  case '/index.html':
    getPost()
    // hide previous button on first load
    $('#previous').style.visibility = 'hidden'
    break
  case '/categories.html':
    getCategories()
    break
  case '/category.html':
    getPostsbyCategory()
    break
  case '/post.html':
    getPostByTitle()
    break
  case '/search.html':
    getPostsbySearch()
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
      <section id="post-${data.posts[0].ID}">
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
    // print button
    var printBtn = document.createElement('a')
    printBtn.innerHTML = /*html*/ `<div style="font-size:14px;margin-top:-5px;margin-bottom:-10px;">🖨 Print this post</div>`
    printBtn.addEventListener('click', () => {
      customDivPrint($(`#post-${data.posts[0].ID}`))
    })
    $(`#post-${data.posts[0].ID}`).children[0].appendChild(printBtn)
  } catch(err) {
    spinner(false)
    console.log(err)
    var html = /*html*/ `<p>Error loading content...</p>`
    $('#latest-post').innerHTML = html
  }
}

// get posts by category
async function getPostsbyCategory() {
  // get category
  var searchParams = new URLSearchParams(window.location.search)
  var category = searchParams.get('title')
  $('#category-title').innerText = category

  try {
    spinner(true)
    var res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/?category=${category.replace(/\//, '')}&number=100`)
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    console.log(data)
    data.posts.forEach(post => {
      var a = document.createElement('a')
      a.href = `/post.html?id=${post.ID}`
      var section = document.createElement('section')
      section.classList.add("post-as-btn")
      a.appendChild(section)
      // format post date
      var formattedDate = getFormattedDate(post.date)
      // format html
      var html = /*html*/ `
        <h2>${post.title}</h2>
        <small class="date-time">${formattedDate}</small>
      `
      section.innerHTML = html
      $('#posts').appendChild(a)
    })

  } catch(err) {
    spinner(false)
    console.log(err)
  }
}

// get posts by search
async function getPostsbySearch() {
  // set title for search query
  var searchParams = new URLSearchParams(window.location.search)
  var query = searchParams.get('query')
  $('#query-title').innerText = `Search: "${query}"`

  try {
    spinner(true)
    var res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/?search="${query}"`)
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    console.log(data)
    data.posts.forEach(post => {
      var a = document.createElement('a')
      a.href = `/post.html?id=${post.ID}`
      var section = document.createElement('section')
      section.classList.add("post-as-btn")
      a.appendChild(section)
      // format post date
      var formattedDate = getFormattedDate(post.date)
      // format html
      var html = /*html*/ `
        <h2>${post.title}</h2>
        <small class="date-time">${formattedDate}</small>
      `
      section.innerHTML = html
      $('#posts').appendChild(a)
    })

  } catch(err) {
    spinner(false)
    console.log(err)
  }
}

async function getPostByTitle() {
  // get category
  var searchParams = new URLSearchParams(window.location.search)
  var postId = searchParams.get('id')

  try {
    spinner(true)
    var res = await fetch(`https://public-api.wordpress.com/rest/v1.1/sites/tabithaministriesmt.wordpress.com/posts/${postId}`)
    if(!res.ok) {
      throw new Error(res.status)
    }
    spinner(false)
    var data = await res.json()
    console.log(data)
    // format post date
    var dataDate = data.date
    var formattedDate = getFormattedDate(dataDate)
    // format html
    var html = /*html*/ `
      <section id="post-${data.ID}">
        <h2>${data.title}</h2>
        <small class="date-time">${formattedDate}</small>
        <div>${data.content}</div>
      </section>
    `
    $('#post-content').innerHTML = html

    // print button
    var printBtn = document.createElement('a')
    printBtn.innerHTML = /*html*/ `<div style="font-size:14px;margin-top:-5px;margin-bottom:-10px;">🖨 Print this post</div>`
    printBtn.addEventListener('click', () => {
      customDivPrint($(`#post-${data.ID}`))
    })
    $(`#post-${data.ID}`).children[0].appendChild(printBtn)
  } catch(err) {
    spinner(false)
    console.log(err)
    var html = /*html*/ `<p>Error loading content...</p>`
    $('#post-content').innerHTML = html
  }
  
}

function handlePrevious(mod, callback) {
  if(postOffset !== 0) {
    postOffset -= mod
    callback()
    if(postOffset === 0) $('#previous').style.visibility = 'hidden'
  }
}

function handleNext(mod, callback) {
  if(postOffset === numberOfPosts - 1) return
  postOffset += mod
  callback()
  if(postOffset !== 0) $('#previous').style.visibility = 'visible'
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
      element.innerHTML = /*html*/ `<a href="/category.html?title=${category.name}">${category.name} (${category.post_count})</a>`
      $('#categories').appendChild(element)
    })

  } catch(err) {
    spinner(false)
    console.log(err)
  }
}

//////////////////// Mobile nav ////////////////////////////
function handleMobileNavClick() {
  var modal = document.createElement('div')
  modal.setAttribute('class', 'modal')
  var modalContent = document.createElement('div')
  modalContent.setAttribute('class', 'modal-content')
  modalContent.innerHTML = /*html*/ `
    <a href="/index.html">Home</a>
    <a href="/about.html">About</a>
    <a href="/categories.html">Topics</a>
    <a href="https://open.spotify.com/show/60fggeLPuS4dlGGJaSNtHJ?si=02daa795a75343cc">Podcast</a>
    <form onsubmit="handleSearch(event)" id="mobile-search">
      <input id="search" size="10"><input type="submit" value="Search">
    </form>
  `
  modal.appendChild(modalContent)
  document.body.appendChild(modal)

  document.addEventListener('mousedown', function(event) {
    if(event.target.className === 'modal') modal.remove()
  })
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

// Print div
function customDivPrint(element) {
  var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
  WinPrint.document.write(element.innerHTML);
  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();
  WinPrint.close();
}

// for search
function handleSearch(event) {
  event.preventDefault()
  var query = event.target.search.value
  window.location.href = window.location.pathname = `/search.html?query=${query}`
}