async function getSpeechPostRequest(input) {
  let voiceId = "VR6AewLTigWG4xSOukaG";
  if (Math.random(1) > 0.5)
      voiceId = "AZnzlk1XvdvUeBnXmlld";
  // let apikey = "2d34e46fd3cc31e189f0a79c026b4f6c";
  // let apikey = "1cbff90f47a5910c298abbacf4133def";
  // let apikey = "40713ade0445f084bb87a62d88d6569f";
  let apikey = "05e9fa610722fa3e570e33afeb9423eb";
  let url = "https://api.elevenlabs.io/v1/text-to-speech/";
  let exampleBody = {
    "text": input,
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0,
      "similarity_boost": 0
    }
  };

  var config = {
      method: 'post',
      url: url + voiceId,
      headers: {
        'accept': 'audio/mpeg',
        'xi-api-key': apikey,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      responseType: 'arraybuffer',
      data: JSON.stringify(exampleBody)
  };

  return new Promise(resolve => {
    axios(config).then(res => {
      return resolve(res)
    })
  })
}

async function getSpeech(input) {
  return new Promise(resolve => {
    getSpeechPostRequest(input)
    .then(res => {
      if (res.status === 200) {
        let blob = handleAudioFetch(res.data)
        return resolve(blob);
      } else {
        console.log("error on eleven labs api request");
      }
    })
    .catch(err => {
      return resolve(err);
    })
  })
}

function handleAudioFetch(data) {
  // Create a new Blob object from the audio data with MIME type 'audio/mpeg'
  const blob = new Blob([data], { type: 'audio/mpeg' });
  // Create a URL for the blob object
  const url = URL.createObjectURL(blob);
  return url
}