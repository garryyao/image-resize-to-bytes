# image-resize-to-bytes [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

Down-sizing bigger images into the best dimensions that meets the specified bytes limits,
this will try to produce a resize that has least lost in image quality, e.g. when uploading the image via APIs that has file size restriction.

It resize images using [sharp](https://sharp.pixelplumbing.com/en/stable/) which supports for all JPEG, PNG, WebP, TIFF, GIF and SVG images.

## Installation

```sh
$ npm install --save image-resize-to-bytes
```

## Usage

```js
const resizeToBytes = require('image-resize-to-bytes');
const axios = require('axios');
axios
  .get(
    'https://assets.vogue.com/photos/5ce2feec0f6084cdac2394bf/master/pass/00016-BURBERRY-RESORT-2020-LONDON.jpg',
    { responseType: 'arraybuffer' }
  )
  .then(({ data: image }) => {
    console.log(image.byteLength); // 1.05m
    // resize to ~200kb
    resizeToBytes(image, 200000).then(smallImage => {
      console.log(smallImage.byteLength); // 190kb
    });
  });
```

## License

MIT © [Garry Yao]()

[npm-image]: https://badge.fury.io/js/image-resize-to-bytes.svg
[npm-url]: https://npmjs.org/package/image-resize-to-bytes
[travis-image]: https://travis-ci.org/garryyao/image-resize-to-bytes.svg?branch=master
[travis-url]: https://travis-ci.org/garryyao/image-resize-to-bytes
[daviddm-image]: https://david-dm.org/garryyao/image-resize-to-bytes.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/garryyao/image-resize-to-bytes
