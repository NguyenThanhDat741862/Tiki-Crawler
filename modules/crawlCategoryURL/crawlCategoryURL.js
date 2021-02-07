const fs = require('fs')
const puppeteer = require('puppeteer')

const url = 'https://tiki.vn/'

async function main () {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.goto(url)
  
  let links = []

  await page.hover('a.Menu-button')

  await page.waitForSelector('[data-view-id="main_navigation_item"]')

  const mainNavigationItems = await page.$$('[data-view-id="main_navigation_item"]')
  
  const mainNavigationURLs = await page.$$eval(
    '[data-view-id="main_navigation_item"]',
    links => links.map(i => ({
      'category': i.innerText,
      'url': i.getAttribute('href'),
      'parent': null
    }))
  )

  links = [...mainNavigationURLs]

  for (let i = 1; i <= mainNavigationItems.length; i++) {
    await page.hover(`li.MenuItem-sc-181aa19-0:nth-child(${i})`)

    await page.waitForSelector('[data-view-id="main_navigation_sub_item"] a')

    let subNavigationURLs = await page.$$eval(
      '[data-view-id="main_navigation_sub_item"] a',
      links => links.map(i => ({
        'category': i.innerText,
        'url': i.getAttribute('href')
      }))
    )

    const parent = mainNavigationURLs[i - 1]['category']

    subNavigationURLs = subNavigationURLs.map(i => ({ ...i, parent }))

    links = [...links, ...subNavigationURLs]
  }

  browser.close()

  console.log(`${Date.now()} - Amount of crawled URLs: ${links.length}`)

  fs.writeFileSync('./data/categoryURL/categoryURL.json', JSON.stringify(links, null, 2))
}

main()
