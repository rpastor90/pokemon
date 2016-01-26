var spritesheet = require('spritesheet-js');

spritesheet('charizard.png', {format: 'pixi.js'}, function (err) {
  if (err) throw err;

  console.log('spritesheet successfully generated');
});