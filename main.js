const fs = require('fs')
const { exec, execSync, spawn } = require('child_process')
const { chunkArray } = require('./helper')

process.on('uncaughtException', function (e) {
  console.error(`${Date.now()} - Error: ${e}`)
  process.exit(1)
})

// // Crawl Category URL
// console.log(`${Date.now()} - Crawl category URL`)

// try {
//   execSync('node ./modules/crawlCategoryURL/crawlCategoryURL.js', { stdio: 'inherit' })
// } catch (e) {
//   console.error(`${Date.now()} - Error: ${e}`)
//   process.exit(1)
// }


// // Generate crawled Category Code
// console.log(`${Date.now()} - Split category code into chunks`)

// const categoryUrls = JSON.parse(fs.readFileSync('./data/categoryURL/categoryURL.json', 'utf8'))
// const crawledCategoryCode = Array.from(new Set(categoryUrls.map(i => i.url.match(/c{1}\d{4,5}/g) && i.url.match(/c{1}\d{4,5}/g)[0].replace('c', '')).filter(i => i)))

// chunkArray(crawledCategoryCode, 50).forEach((chunk, i) => {
//   try {
//     fs.writeFileSync(`./tmp/categoryURL-${Date.now()}.json`, `[${chunk.toString()}]`)
//   } catch (e) {
//     console.error(`${Date.now()} - Error: ${e}`)
//   }
// })


// // Crawl Prodict ID
// console.log(`${Date.now()} - Crawl product ID`)

// const categoryCodeFiles = fs.readdirSync('./tmp')

// categoryCodeFiles.forEach(file => {
//   try {
//     execSync(`node ./modules/crawlProductID/crawlProductID.js ${file}`, { stdio: 'inherit' })
//   } catch (e) {
//     console.error(`${Date.now()} - Error: ${e}`)
//     process.exit(1)
//   }
// })


// Crawl Product, Review
console.log(`${Date.now()} - Crawl product, review by productID`)

const productIDFiles = fs.readdirSync('./data/productID')

productIDFiles.forEach(file => {
  console.log(`${Date.now()} - Crawled file productID: ${file}`)

  try {
    execSync(`node ./modules/crawlProduct/crawlProduct.js ${file}`, { stdio: 'inherit' })
    execSync(`node ./modules/crawlReview/crawlReview.js ${file}`, { stdio: 'inherit' })
  } catch (e) {
    console.error(`${Date.now()} - Error: ${e}`)
    process.exit(1)
  }
})