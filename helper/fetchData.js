const axios = require('axios')

module.exports = async function fetchData(url) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36' } })

    return res && res.data ? res.data : { data: null }
  } catch (e) {
    console.error(`Error: ${e}`)
  }
  return null
}
