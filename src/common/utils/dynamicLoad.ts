
/**
 * Helper function to recursively request url
 * and send data to callback. Url will be requested
 * for maxCount of times till it is success.
 * 
 * @param url url to request
 * @param setState set state action function
 * @param callback function be passed response json
 * @param maxCount number of times this should be called,
 * defaults to 5
 * @returns void
 */
export const dynamicLoader = async (url: string, setState: (data: any) => void, callback: (data: any) => void, maxCount = 5) => {
  setState(false)

  if (maxCount <= 0) return;

  const response = await fetch(url)
  if (!response.ok) {
    setTimeout(async () => dynamicLoader(url, setState, callback, --maxCount), 10000)
    console.log("Retrying... in 10 seconds")
    return
  }
  callback(await response.json())
  setState(true)
}