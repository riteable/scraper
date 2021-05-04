function title ({ $ }) {
  let content = $('meta[property="og:title"]').attr('content')

  if (!content) {
    content = $('meta[name="og:title"]').attr('content')
  }

  if (!content) {
    content = $('meta[property="twitter:title"]').attr('content')
  }

  if (!content) {
    content = $('head title').text()
  }

  return content || null
}

function description ({ $ }) {
  let content = $('meta[property="og:description"]').attr('content')

  if (!content) {
    content = $('meta[name="og:description"]').attr('content')
  }

  if (!content) {
    content = $('meta[name="description"]').attr('content')
  }

  return content
}

function image ({ $ }) {
  let content = $('meta[property="og:image"]').attr('content')

  if (!content) {
    content = $('meta[name="og:image"]').attr('content')
  }

  if (!content) {
    content = $('meta[property="twitter:image:src"]').attr('content')
  }

  return content || null
}

function url (res) {
  let content = res.$('meta[property="og:url"]').attr('content')

  if (!content) {
    content = res.$('link[rel="canonical"]').attr('href')
  }

  return content || null
}

module.exports = {
  title,
  description,
  image,
  url
}
