const wifi = require('pi-wifi')

wifi.scan((err, res) => {
  if (err) console.error(err.message)
  else {
    console.log(res)
  }
})