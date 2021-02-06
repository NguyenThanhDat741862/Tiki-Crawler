const fs = require('fs')
const { fetchData } = require('../../helper')

const api = 'https://tiki.vn/api/v2/products'

async function crawlProduct (productIDs, writer) {
  const errorProductIDs = []

  for (const id of productIDs) {
    const crawledURL = `${api}/${id}`

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
  console.log(`${Date.now()} - Crawling product`)

  const file = process.argv[2]
  const crawledProductIDs = JSON.parse(fs.readFileSync(`./data/ProductID/${file}`))
  const amountProductID = crawledProductIDs.length
  const now = Date.now()

  try {
    const writeStream = fs.createWriteStream(`./data/product/output/product-${now}.json`, { flags: 'a' })
    writeStream.write('[')

    const errorProductIDs = await crawlProduct(crawledProductIDs, record => writeStream.write(JSON.stringify(record) + ','))
    const amountErrorProductID = errorProductIDs.length

    writeStream.write(']')
    writeStream.end()

    fs.writeFileSync(`./data/product/error/product-${now}-error.json`, `[${errorProductIDs.toString()}]`)
    
    console.log(`${Date.now()} - Crawling product done: ${amountProductID} (success: ${amountProductID - amountErrorProductID} - error: ${amountErrorProductID})`)
  } catch (e) {
    console.error(`${Date.now()} - Error: ${e}`)
  }
}

main()
