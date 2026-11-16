export function validateImageBytes(bytes: Uint8Array, mime: string) {
  const starts = (signature: number[]) => signature.every((byte, index) => bytes[index] === byte);
  const jpeg = starts([0xff, 0xd8, 0xff]);
  const png = starts([137, 80, 78, 71, 13, 10, 26, 10]);
  const webp = starts([82, 73, 70, 70]) && [87, 69, 66, 80].every((byte, index) => bytes[index + 8] === byte);
  return (mime === 'image/jpeg' && jpeg) || (mime === 'image/png' && png) || (mime === 'image/webp' && webp);
}
