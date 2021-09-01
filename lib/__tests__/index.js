const imageResizeToBytes = require('../index.js');
const sharp = require('sharp');

describe('imageResizeToBytes', () => {
  jest.setTimeout(10e3);

  it('verify image - portrait', async () => {
    const img = sharp('lib/__tests__/fixtures/1.jpg');
    const { format, width, height } = await img.metadata();
    expect(format).toEqual('jpeg');
    expect(width).toEqual(3842);
    expect(height).toEqual(5762);
    const imageSize = (await img.toBuffer()).byteLength;
    expect(imageSize).toBeGreaterThan(4e6);
  });

  it('verify image - landscape', async () => {
    const img = sharp('lib/__tests__/fixtures/2.jpg');
    const { format, width, height } = await img.metadata();
    expect(format).toEqual('jpeg');
    expect(width).toEqual(4098);
    expect(height).toEqual(2732);
    const imageSize = (await img.toBuffer()).byteLength;
    expect(imageSize).toBeGreaterThan(2e6);
  });

  it('no image resize - image already fits', async () => {
    const img = await sharp('lib/__tests__/fixtures/1.jpg').toBuffer();
    // 5mb
    const targetSize = 5e6;
    const resizedImg = await imageResizeToBytes(img, targetSize);
    expect(resizedImg.byteLength).toEqual(img.byteLength);
  });

  it('resize portrait image (to 2mb)', async () => {
    const img = await sharp('lib/__tests__/fixtures/1.jpg').toBuffer();
    // 2mb
    const targetSize = 2e6;
    const resizedImg = await imageResizeToBytes(img, targetSize);
    const finalSize = resizedImg.byteLength;
    expect(targetSize - finalSize).toBeGreaterThan(0);
    expect(targetSize - finalSize).toBeLessThan(2e5);
  });

  it('resize landscape image to 500k with deviation 2%', async () => {
    const img = await sharp('lib/__tests__/fixtures/2.jpg').toBuffer();
    const targetSize = 5e5; // 500k
    const resizedImg = await imageResizeToBytes(img, targetSize, {
      deviation: 0.01,
    });
    const finalSize = resizedImg.byteLength;
    expect(targetSize - finalSize).toBeGreaterThan(0);
    expect(targetSize - finalSize).toBeLessThan(5e3);
  });

  it('resize landscape image (to 500k) unreachable deviation', async () => {
    const img = await sharp('lib/__tests__/fixtures/2.jpg').toBuffer();
    const targetSize = 5e5; // 500k
    const resizedImg = await imageResizeToBytes(img, targetSize, {
      deviation: 0.00005,
    });
    const finalSize = resizedImg.byteLength;
    expect(targetSize - finalSize).toBeGreaterThan(0);
    expect(finalSize).toBeLessThan(targetSize);
  });
});
