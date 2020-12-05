const fs = require('fs')
const axios = require('axios')

const api = 'https://tiki.vn/api/v2/products'

const productIDs = fs.readFileSync('./data/productID.json', 'utf8').slice(1,-1).split(',').map(i => +i)

async function fetchData(url) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' } })

    return res.data
  } catch (error) {
    return null
  }
}

async function crawlProduct (writer) {
  for (const id of productIDs) {
    const crawledURL = `${api}/${id}`

    const data = await fetchData(crawledURL)
    
    console.log(id)
    
    writer(data)
    
  }
}

async function main () {
  
  try {
      
    const writeStream = fs.createWriteStream('./data/product.json', { flags: 'a' })
    writeStream.write('[\n')

    await crawlProduct(record => writeStream.write(JSON.stringify(record, null, 2) + ',\n'))

    writeStream.write(']')
    writeStream.end()
    
  } catch (e) {
    console.log(e)
  }
}

main()
