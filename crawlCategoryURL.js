const fs = require('fs')
const puppeteer = require('puppeteer')

const url = 'https://tiki.vn/'

async function main () {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  
  let links = []

  const mainNavigationItems = await page.$$('[data-view-id="main_navigation_item"]')
  
  const mainNavigationURLs = await page.$$eval(
    '[data-view-id="main_navigation_item"] > a',
    links => links.map(i => ({
      'category': i.innerText,
      'url': i.getAttribute('href')
    }))
  )

  links = [...links, ...mainNavigationURLs]

  for (let i = 1; i <= mainNavigationItems.length; i++) {
    await page.hover(`[data-view-id="main_navigation_item"]:nth-child(${i})`)

    await page.waitFor(5000)

    const subNavigationURLs = await page.$$eval(
      '[data-view-id="main_navigation_sub_item"] a',
      links => links.map(i => ({
        'category': i.innerText,
        'url': i.getAttribute('href')
      }))
    )

    links = [...links, ...subNavigationURLs]
  }

  browser.close()

  fs.writeFileSync('./data/categoryURL.json', JSON.stringify(links, null, 2))
}

main()
