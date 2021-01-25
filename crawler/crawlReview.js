const fs = require('fs')
const axios = require('axios')

const api = 'https://tiki.vn/api/v2/reviews'

const productIDs = fs.readFileSync('./data/productID.json', 'utf8').slice(1,-1).split(',').map(i => +i)

async function fetchData(url) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' } })

    return res.data || []
  } catch (error) {
    return null
  }
}

async function crawlReview (writer) {
  for (const id of productIDs) {
    for (let i = 1; ; i++) {
      const crawledURL = `${api}?product_id=${id}&sort=score%7Cdesc,id%7Cdesc,stars%7Call&page=${i}&limit=100&include=comments`

      const { data } = await fetchData(crawledURL)

      if (!data || !data.length) break

      data.forEach(i => { writer(i) })
    }

    console.log(id)

  }
}

async function main () {

  try {

    const writeStream = fs.createWriteStream('./data/review.json', { flags: 'a' })
    writeStream.write('[\n')

    await crawlReview(record => writeStream.write(JSON.stringify(record, null, 2) + ',\n'))

    writeStream.write(']')
    writeStream.end()

  } catch (e) {
    console.log(e)
  }
}

main()
