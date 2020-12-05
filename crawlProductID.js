const fs = require('fs')
const axios = require('axios')

const api = 'https://tiki.vn/api/v2/products'

const categoryUrls = JSON.parse(fs.readFileSync('./data/categoryURL.json', 'utf8')).filter(i => i.category === 'Xe Máy, Ô tô, Xe Đạp' || i.parent === 'Xe Máy, Ô tô, Xe Đạp')

const crawledCategoryCode = categoryUrls.map(i => i.url.match(/c{1}\d{4,5}/g) && i.url.match(/c{1}\d{4,5}/g)[0].replace('c', '')).filter(i => i)

async function fetchData(url) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' } })

    return res.data
  } catch (error) {
    return null
  }
}

async function crawlProductID () {
  const productIDs = []

  for (const code of crawledCategoryCode) {
    for (let i = 1; ; i++) {
      const crawledURL = `${api}?limit=100&category=${code}&page=${i}`
  
      const { data } = await fetchData(crawledURL)
  
      if (!data || !data.length) break

      data.forEach(i => { productIDs.push(i['id']) })
    }
  }

  return [...new Set(productIDs)]
}

async function main () {
  await crawlProductID(record => writeStream.write(JSON.stringify(record) + ','))
  const productIDs = await crawlProductID()

  fs.writeFileSync('./data/productID.json', JSON.stringify(productIDs))
}

main()
