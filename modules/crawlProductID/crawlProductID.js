const fs = require('fs')
const { fetchData, sleep } = require('../../helper')

const api = 'https://tiki.vn/api/v2/products'

async function crawlProductID (categoryCode) {
  const productIDs = []

  for (let i = 1; ; i++) {
    const { data } = await fetchData(`${api}?limit=100&category=${categoryCode}&page=${i}`)

    if (!data || !data.length) break

    data.forEach(i => { productIDs.push(i['id']) })

    await sleep(50)
  }

  const distinctProductIDs = Array.from(new Set(productIDs))

  try {
    fs.writeFileSync(`./data/productID/productID-${categoryCode}.json`, `[${distinctProductIDs.toString()}]`)
  } catch (e) {
    console.error(`Error: ${e}`)
  }

  return distinctProductIDs.length
}

function* batchGenerateProductID (categoryCodes) {
  for (const categoryCode of categoryCodes) { yield crawlProductID(categoryCode) }
}

async function main () {
  const file = process.argv[2]
  const crawledCategoryCodes = JSON.parse(fs.readFileSync(`./tmp/${file}`))

  let amount = 0

  for await (const crawledProductIDAmount of batchGenerateProductID(crawledCategoryCodes)) {
    amount += crawledProductIDAmount
  }

  console.log(`${Date.now()} - File ${file} crawled ${amount} productIDs`)
}

main()
