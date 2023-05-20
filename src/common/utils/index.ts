export function trimAddress(address: string) {
  if (address.length < 15) {
    return address;
  }
  return address.slice(0, 10) + "..." + address.slice(-4);
}
