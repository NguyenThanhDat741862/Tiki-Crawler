const fs = require('fs')
const { fetchData } = require('../../helper')

const api = 'https://tiki.vn/api/v2/reviews?product_id='

async function crawlReview (productIDs, writer) {
  const errorProductIDs = []

  for (const id of productIDs) {
    const crawledURL = `${api}${id}`

    const data = await fetchData(crawledURL)

    if (data) {
      writer(data)
    } else {
      errorProductIDs.push(id)
    }
  }

  return errorProductIDs
}

async function main () {
  console.log(`${Date.now()} - Crawling review`)

  const file = process.argv[2]
  const crawledProductIDs = JSON.parse(fs.readFileSync(`data/productID/${file}`))
  const amountProductID = crawledProductIDs.length
  const now = Date.now()
  
  try {
    const writeStream = fs.createWriteStream(`data/review/output/review-${now}.json`, { flags: 'a' })
    writeStream.write('[')

    const errorProductIDs = await crawlReview(crawledProductIDs, record => writeStream.write(JSON.stringify(record) + ','))
    const amountErrorProductID = errorProductIDs.length

    writeStream.write(']')
    writeStream.end()

    fs.writeFileSync(`data/review/error/review-${now}-error.json`, `[${errorProductIDs.toString()}]`)
    
    console.log(`${Date.now()} - Crawling review done: ${amountProductID} (success: ${amountProductID - amountErrorProductID} - error: ${amountErrorProductID})`)
  } catch (e) {
    console.error(`Error: ${e}`)
  }
}

main()
