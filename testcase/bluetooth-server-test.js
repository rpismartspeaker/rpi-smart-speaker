const server = new(require('bluetooth-serial-port')).BluetoothSerialPortServer()

const configure = {
  channel: 1,
  uuid: '0x1101'
}

server.listen((clientAddress) => {
  console.log(`Client: ${clientAddress} connected!`)

  server.on('data', buffer => {
    console.log(`Received data from client: ${buffer}`)

    server.write(new Buffer('...'), (err, bytesWriten) => {
      if (err) console.error('Error!')
      else {
        console.log(`Send ${bytesWriten} to the client`)
      }
    })
  })
}, error => {
  console.log(`Something wrong happended: ${error}`)
}, configure)
console.log('Server: Starting!')

setInterval(() => {
  console.log('bluetooth status: ' + server.isOpen())
}, 2000)