const record = require('node-record-lpcm16');
const { Detector, Models } = require('snowboy')
const path = require('path')

const models = new Models();

models.add({
  file: path.resolve(__dirname, '..', 'resources', 'model', 'jarvis.pmdl'),
  sensitivity: '0.5',
  hotwords : 'jarvis'
})
models.add({
  file: path.resolve(__dirname, '..', 'resources', 'model', 'jarvis.pmdl'),
  sensitivity: '0.5',
  hotwords : 'Alexa'
})

const detector = new Detector({
  resource: path.resolve(__dirname, '..', 'resources', 'snowboy', 'common.res'),
  models: models,
  audioGain: 2.0,
  applyFrontend: true
})

detector.on('silence', () => {
  console.log('silence')
})

detector.on('sound', (buffer) => {
  // <buffer> contains the last chunk of the audio that triggers the "sound"
  // event. It could be written to a wav stream.
  console.log('sound')
});

detector.on('error', () => {
  console.log('error')
});

detector.on('hotword', (index, hotword, buffer) => {
  // <buffer> contains the last chunk of the audio that triggers the "hotword"
  // event. It could be written to a wav stream. You will have to use it
  // together with the <buffer> in the "sound" event if you want to get audio
  // data after the hotword.
  console.log(buffer)
  console.log('hotword', index, hotword)
});

const mic = record.start({
  sampleRate    : 16000,  // audio sample rate
  channels      : 1,      // number of channels
  threshold     : 0.5,    // silence threshold (rec only)
  thresholdStart: null,   // silence threshold to start recording, overrides threshold (rec only)
  thresholdEnd  : null,   // silence threshold to end recording, overrides threshold (rec only)
  silence       : '1.0',  // seconds of silence before ending
  verbose       : false,  // log info to the console
  recordProgram : 'arecord',  // Defaults to 'rec' - also supports 'arecord' and 'sox'
  device        : null,   // recording device (e.g.: 'plughw:1')
})
.on('error', error => {
  console.log(error)
}).pipe(detector)
