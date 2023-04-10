export function trimAddress(address: string) {
  return address.slice(0, 10) + "..." + address.slice(-4);
}
