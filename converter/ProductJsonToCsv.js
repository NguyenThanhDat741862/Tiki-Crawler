const fs = require('fs')
const JSONStream = require('JSONStream')

const stream = fs.createReadStream('data/json/product.json', {encoding: 'utf8'})
const parser = JSONStream.parse([{emitKey: true}])

stream.pipe(parser)

function main () {
  try {
    const writeStream = fs.createWriteStream('./data/csv/product.csv', { flags: 'a' })
    writeStream.write('id,name,price,description,specifications,productset_group_name\n')

    parser.on('data', function (data) {
      const { id, name, price, description, specifications, productset_group_name } = data.value

      writeStream.write(`${id},${JSON.stringify(name)},${price},${JSON.stringify(description)},${JSON.stringify(specifications)},${JSON.stringify(productset_group_name)}\n`)
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
