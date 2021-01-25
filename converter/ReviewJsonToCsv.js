const fs = require('fs')
const JSONStream = require('JSONStream')

const stream = fs.createReadStream('data/json/review.json', {encoding: 'utf8'})
const parser = JSONStream.parse([{emitKey: true}])

stream.pipe(parser)

function main () {
  try {
    const writeStream = fs.createWriteStream('./data/csv/review.csv', { flags: 'a' })
    writeStream.write('id,customer_id,product_id,created_at,rating,content\n')

    parser.on('data', function (data) {
      const { id, customer_id, product_id, created_at, rating, content } = data.value

      writeStream.write(`${id},${customer_id},${product_id},${created_at},${rating},${JSON.stringify(content)}\n`)
    })    

    parser.on('footer', function () {
      writeStream.write('\n')
      writeStream.end()
    }) 
  } catch (e) {
    console.log(e)
  }
}

main()
