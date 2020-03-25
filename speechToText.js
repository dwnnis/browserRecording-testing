var IAM_access_token = '5ZiWthTo1O7FHyOIzIv8iNtJL8lmbjCPo_IhKXDNPoSh';
var wsURI = 'https://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/18eade83-0e5c-4eda-82f7-bf528487c110/v1/recognize'
  + '?access_token=' + IAM_access_token
  + '&model=es-ES_BroadbandModel';
var websocket = new WebSocket(wsURI);

websocket.onopen = function(evt) { onOpen(evt) };
websocket.onclose = function(evt) { onClose(evt) };
websocket.onmessage = function(evt) { onMessage(evt) };
websocket.onerror = function(evt) { onError(evt) };

function onOpen(evt) {
  var message = {
    action: 'start',
    content-type: 'audio/l16;rate=22050'
  };
  websocket.send(JSON.stringify(message));
}

function onMessage(evt) {
  console.log(evt.data);
}

function onClose(evt) {
  console.log("onClose");
  websocket.close();
}

function onError(evt) {
  console.log("onError");
}
