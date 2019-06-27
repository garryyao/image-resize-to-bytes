/* eslint-disable no-await-in-loop,max-params */
'use strict';
const sharp = require('sharp');

// Make best guess of width that produces a target bytes,
// dimension based on the two samples (width, bytes) supplied.
function approximateWidth(targetBytes, w1, s1, w2 = 0, s2 = 0) {
  if (s1 === s2) return w1;
  const ratio = (w1 - w2) / (s1 - s2);
  const baseWidth = Math.min(w1, w2);
  const baseBytes = Math.min(s1, s2);
  return baseWidth + (targetBytes - baseBytes) * ratio;
}

/**
 * Down sizing the given image in {@param imageBuffer} to the finest quality for the allowed {@param bytesLimit},
 * returns the new image buffer.
 * The image is returned as is, if it's already smaller than the designated size.
 * @param {ArrayBuffer} imageBuffer - Original image buffer representing the image data
 * @param {Number} bytesLimit - Produce image should be smaller than this size
 * @param {Object} [options] - List of options
 * @param {Number} [options.deviation] - Preferred deviation to {@param bytesLimit} of the produced image, which means
 * the image will be no smaller than %x of the destination size. Note that a smaller deviation will have performance impact, use it cautiously. Default to 10%.
 * @returns {Promise<null|*|Buffer|*>} The down sized new image (in array buffer)
 */
const resizeToBytes = async (
  imageBuffer,
  bytesLimit,
  { deviation = 0.1 } = {}
) => {
  let img = sharp(imageBuffer);
  let { width: w2, size: s2 } = await img.metadata();
  // Already a good size, nothing to do
  if (s2 < bytesLimit) return imageBuffer;

  let i = 0;
  let w1 = 0;
  let s1 = 0;
  let bestGuess = null;
  while (i++ < 10) {
    const newWidth = approximateWidth(bytesLimit, w2, s2, w1, s1);
    const newImg = await img.resize(Math.floor(newWidth)).toBuffer();

    const { size: newSize } = await sharp(newImg).metadata();

    if (newSize < bytesLimit) {
      bestGuess = newImg;
      // A good enough result
      if (bytesLimit - newSize <= bytesLimit * deviation) {
        return newImg;
      }
    }

    // Not good enough, make another attempt
    s1 = s2;
    w1 = w2;
    s2 = newSize;
    w2 = newWidth;
  }

  // Use the best guess if we have one
  return bestGuess || imageBuffer;
};

module.exports = resizeToBytes;
