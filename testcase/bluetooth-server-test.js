const bleno = require('bleno')

const name = 'test'
const serviceUUID = [
  'b9114d25-90b9-4922-9216-f3f65b219cea'
]

const PrimaryService = new bleno.PrimaryService({
  uuid: serviceUUID[0],
  characteristics: []
})

bleno.on('stateChange', state => {
  console.log(`on -> stateChange: ${state}, address: ${bleno.address}`)

  if (state === 'poweredOn') {
    bleno.startAdvertising(name, serviceUUID)
  } else {
    bleno.stopAdvertising()
  }
})

bleno.on('accept', address => {
  console.log(`on -> accept, client: ${address}`)

  bleno.updateRssi()
})

bleno.on('disconnect', rssi => {
  console.log(`on -> disconnect, client: ${rssi}`)
})

bleno.on('rssiUpdate', rssi => {
  console.log(`on -> rssiUpdate: ${rssi}`)
})

bleno.on('mtuChange', mtu => {
  console.log(`on -> mtuChange: ${mtu}`)
})

bleno.on('advertisingStart', error => {
  console.log(`on -> advertisingStart: ${(error ?
    'error' + error :
    'success')}`)

    if (!error) {
      bleno.setServices([
        PrimaryService
      ])
    }
})

bleno.on('advertisingStop', () => {
  console.log('on -> advertisingStop')
})

bleno.on('servicesSet', error => {
  console.log(`on -> servicesSet: ${(error ?
    'error' + error :
    'success')}`)
})