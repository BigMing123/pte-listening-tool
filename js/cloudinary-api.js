
async function getAudioFromCloudinary(url) {
  var config = {
      method: 'get',
      url: url,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
  };

  return new Promise(resolve => {
    axios(config).then(res => {
      return resolve(res)
    })
  })
}