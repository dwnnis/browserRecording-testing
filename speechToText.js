var IAM_access_token = "eyJraWQiOiIyMDIwMDIyNTE4MjgiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLWJkYjk1OTE5LTU3YTMtNDcxNy1hMDJlLTA0MTRkNTg0MzA5ZCIsImlkIjoiaWFtLVNlcnZpY2VJZC1iZGI5NTkxOS01N2EzLTQ3MTctYTAyZS0wNDE0ZDU4NDMwOWQiLCJyZWFsbWlkIjoiaWFtIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC1iZGI5NTkxOS01N2EzLTQ3MTctYTAyZS0wNDE0ZDU4NDMwOWQiLCJuYW1lIjoiQXV0by1nZW5lcmF0ZWQgc2VydmljZSBjcmVkZW50aWFscyIsInN1YiI6IlNlcnZpY2VJZC1iZGI5NTkxOS01N2EzLTQ3MTctYTAyZS0wNDE0ZDU4NDMwOWQiLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsInVuaXF1ZV9pbnN0YW5jZV9jcm5zIjpbImNybjp2MTpibHVlbWl4OnB1YmxpYzpzcGVlY2gtdG8tdGV4dDp1cy1zb3V0aDphLzhjMjE2YTdhOTM3ZTQ0YmQ4Yjc1MWZjMzVkMjA5Nzg0OjE4ZWFkZTgzLTBlNWMtNGVkYS04MmY3LWJmNTI4NDg3YzExMDo6Il0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6IjhjMjE2YTdhOTM3ZTQ0YmQ4Yjc1MWZjMzVkMjA5Nzg0In0sImlhdCI6MTU4NTI0NzgyMSwiZXhwIjoxNTg1MjUxNDIxLCJpc3MiOiJodHRwczovL2lhbS5jbG91ZC5pYm0uY29tL2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.HM7pfEoGS9olIAaUBCKALZ5a4fJK4V5W8U0z7vQElv_OGtXaBcW1PSMTQJxxzUQiWu24Uhvt-PTv9DvUnshyWvYi2xJxQIJA3dKw5wKDNCCJzm2XEc4rMbcu04eC8mWbfuSRrTU1Q5vTuRRO-Dy-cqYZn9lGdQQT1ZUDnPLblJIU06FLnfMw9nPPehKg4-nJcRxAP8Lafn28AdrLWs_WOr8LYEzNFPbuRsnks-vWbZkyuDb5sQwFF2HfVBmMRsMk1W0MWhfZkjnF2n9JlxOY16Nn7Ygk3pj_6UPJDBYbe7m_Ni6_g57tGSnruFNZGPifBeEkfgMtsUzQVjcd4TTYFQ";
var wsURI = 'wss://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/18eade83-0e5c-4eda-82f7-bf528487c110/v1/recognize' + '?access-token=' + IAM_access_token + '&model=es-ES_BroadbandModel';
var websocket = new WebSocket(wsURI);

websocket.onopen = function(evt) { onOpen(evt) };
websocket.onclose = function(evt) { onClose(evt) };
websocket.onmessage = function(evt) { onMessage(evt) };
websocket.onerror = function(evt) { onError(evt) };

function onOpen(evt) {
  var message = {
    'action': 'start',
    'content-type': 'audio/l16;rate=22050'
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
