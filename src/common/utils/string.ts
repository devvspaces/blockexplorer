

export function capitalizeString(value: string) {
  return value.charAt(0).toUpperCase() + value.substring(1, value.length)
}

export function hex_to_ascii(value: string)
 {
	var hex  = value.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
 }