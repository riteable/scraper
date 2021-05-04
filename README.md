# Scraper

A basic website scraper.

## Usage

A simple example:

```javascript
const Scraper = require('@riteable/scraper')

async function run () {
  const scraper = new Scraper()

  scraper
    .setIndexUrl('https://example.com')
    .setLinkSelector('.article .title a')

  return scraper.fetchPages()
}

run()
  .then(console.log)
  .catch(console.error)
```

The above example would output something like the following:

```javascript
[
  {
    title: 'Some article',
    description: 'A description of the article.',
    image: 'https://example.com/path/to/an/image.jpg',
    url: 'https://example.com/some-article'
  }
]
```

An instance of `Scraper` will try to extract the above data by default.

If you need to extract more data, or don't need the above, you can use the `setDataMap()` method to specify what you need:

```javascript
scraper.setDataMap({
  ...scraper.helpers,
  publishedAt: ({ $ }) => $('meta[property="article:published_time"]').attr('content')
})
```

The helpers have certain fallbacks built-in to look for data. See `helpers.js` for the implementations.

## API

The following properties and methods are available:

`helpers`: This property contains helper functions to extract commonly needed data. Currently implemented:

- `title()`
- `description()`
- `image()`
- `url()`

`setIndexUrl(url)`: Set the URL of a page which contains a list of articles/pages that you want to scrape.

`setLinkSelector(selector)`: Set the selector of the `<a>` elements which link to the pages to be scraped. This module uses [cheerio](https://github.com/cheeriojs/cheerio) for parsing and traversing documents.

`setDataMap(object)`: Determine how data should be extracted and mapped to fields. The object only accepts callback functions as values. The callbacks receive an object parameter, which contains a document parsed by [cheerio](https://github.com/cheeriojs/cheerio) aliased as `$`, so you can easily query data within the document. The rest of the parameter object contains a [needle](https://github.com/tomas/needle) response from the requested page.

`setThrottle(object)`: You can throttle requests with a `delay` and `concurrent` setting. For example:

```javascript
scraper.setThrottle({
  delay: 500, // milliseconds between requests
  concurrent: 1 // amount of requests at a time
})
```

`async fetchIndex()`: Parse data only from the index URL, determined by `setIndexUrl()`.

`async fetchPages()`: Extract data from linked pages, found by setting `setLinkSelector()`.
