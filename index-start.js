//
// Recording Setup
//

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
// const submitBtn = document.querySelector('form button');
const submitBtn = document.getElementById('createButton');

// record buttons
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

recordButton.addEventListener("pointerdown", startRecording);
recordButton.addEventListener("pointerup", stopRecording);
// stopButton.addEventListener("click", stopRecording);

navigator.mediaDevices.getUserMedia({ audio: true })
      .then(function(stream) {
        console.log('You let me use your mic!')
      })
      .catch(function(err) {
        console.log('No mic for you!')
      });


function detectClick(event) {
    if (event) {
      stopButton.innerHTML = event.pointerType;
    }
    // switch(event.pointerType) {
    //     case "mouse":
    //         /* mouse input detected */
    //         stopButton.innerHTML = "mouse click";
    //         break;
    //     case "pen":
    //         /* pen/stylus input detected */
    //         stopButton.innerHTML = "pen click"
    //         break;
    //     case "touch":
    //         /* touch input detected */
    //         stopButton.innerHTML = "touch click";
    //         break;
    //     default:
    //         /* pointerType is empty (could not be detected)
    //         or UA-specific custom type */
    // }
}
function detectRelease(event) {
    if (event) {
        stopButton.innerHTML = "release";
    }
    // switch(event.pointerType) {
    //     case "mouse":
    //         /* mouse input detected */
    //         stopButton.innerHTML = "mouse release";
    //         break;
    //     case "pen":
    //         /* pen/stylus input detected */
    //         stopButton.innerHTML = "pen release"
    //         break;
    //     case "touch":
    //         /* touch input detected */
    //         stopButton.innerHTML = "touch release";
    //         break;
    //     default:
    //         /* pointerType is empty (could not be detected)
    //         or UA-specific custom type */
    // }
}

// audio file
var blobToSave;

// Create an instance of a db object for us to store the open database in
let db;

window.onload = function() {
  // Open our database; it is created if it doesn't already exist
  // (see onupgradeneeded below)
  let request = window.indexedDB.open('notes_db', 1);

  // onerror handler signifies that the database didn't open successfully
  request.onerror = function() {
    console.log('Database failed to open');
  };
  // onsuccess handler signifies that the database opened successfully
  request.onsuccess = function() {
    console.log('Database opened successfully');

    // Store the opened database object in the db variable. This is used a lot below
    db = request.result;

    // Run the displayData() function to display the notes already in the IDB
    displayData();
  };
  // Setup the database tables if this has not already been done
  request.onupgradeneeded = function(e) {
    // Grab a reference to the opened database
    let db = e.target.result;

    // Create an objectStore to store our notes in (basically like a single table)
    // including a auto-incrementing key
    let objectStore = db.createObjectStore('notes_os', { keyPath: 'id', autoIncrement:true });

    // Define what data items the objectStore will contain
    objectStore.createIndex('title', 'title', { unique: false });
    objectStore.createIndex('body', 'body', { unique: false });
    objectStore.createIndex('audio', 'audio', { unique: false });

    console.log('Database setup complete');
  };
  // Create an onsubmit handler so that when the form is submitted the addData() function is run
  form.onsubmit = addData;
  // Define the addData() function
  function addData(e) {
    console.log("addData");
    // prevent default - we don't want the form to submit in the conventional way
    e.preventDefault();

    // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
    let newItem = { title: titleInput.value, body: bodyInput.value, audio: blobToSave };

    // open a read/write db transaction, ready for adding the data
    let transaction = db.transaction(['notes_os'], 'readwrite');

    // call an object store that's already been added to the database
    let objectStore = transaction.objectStore('notes_os');

    // Make a request to add our newItem object to the object store
    let request = objectStore.add(newItem);
    request.onsuccess = function() {
      // Clear the form, ready for adding the next entry
      titleInput.value = '';
      bodyInput.value = '';
      // TODO: add audio item here.
    };

    // Report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function() {
      console.log('Transaction completed: database modification finished.');

      // update the display of data to show the newly added item, by running displayData() again.
      displayData();
    };

    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };
  }
  // Define the displayData() function
  function displayData() {
    console.log("displayData");
    // Here we empty the contents of the list element each time the display is updated
    // If you didn't do this, you'd get duplicates listed each time a new note is added
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    // Open our object store and then get a cursor - which iterates through all the
    // different data items in the store
    let objectStore = db.transaction('notes_os').objectStore('notes_os');
    objectStore.openCursor().onsuccess = function(e) {
      // Get a reference to the cursor
      let cursor = e.target.result;

      // If there is still another data item to iterate through, keep running this code
      if(cursor) {
        // Create a list item, h3, and p to put each data item inside when displaying it
        // structure the HTML fragment, and append it inside the list
        const listItem = document.createElement('li');
        const h3 = document.createElement('h3');
        const para = document.createElement('p');
        const au = document.createElement('audio');

        au.controls = true;
        au.setAttribute("style", "width: 260px; height: 40px;")
        var url = URL.createObjectURL(cursor.value.audio);
      	au.src = url;

        listItem.appendChild(h3);
        listItem.appendChild(para);
        listItem.appendChild(au);
        // add audio item here.
        list.appendChild(listItem);

        // Put the data from the cursor inside the h3 and para
        h3.textContent = cursor.value.title;
        para.textContent = cursor.value.body;

        // Store the ID of the data item inside an attribute on the listItem, so we know
        // which item it corresponds to. This will be useful later when we want to delete items
        listItem.setAttribute('data-note-id', cursor.value.id);

        // Create a button and place it inside each listItem
        const deleteBtn = document.createElement('button');
        listItem.appendChild(deleteBtn);
        deleteBtn.textContent = 'Delete';

        // Set an event handler so that when the button is clicked, the deleteItem()
        // function is run
        deleteBtn.onclick = deleteItem;

        // Iterate to the next item in the cursor
        cursor.continue();
      } else {
        // Again, if list item is empty, display a 'No notes stored' message
        if(!list.firstChild) {
          const listItem = document.createElement('li');
          listItem.textContent = 'No notes stored.';
          list.appendChild(listItem);
        }
        // if there are no more cursor items to iterate through, say so
        console.log('Notes all displayed');
      }
    };
  }
  // Define the deleteItem() function
  function deleteItem(e) {
    // retrieve the name of the task we want to delete. We need
    // to convert it to a number before trying it use it with IDB; IDB key
    // values are type-sensitive.
    let noteId = Number(e.target.parentNode.getAttribute('data-note-id'));

    // open a database transaction and delete the task, finding it using the id we retrieved above
    let transaction = db.transaction(['notes_os'], 'readwrite');
    let objectStore = transaction.objectStore('notes_os');
    let request = objectStore.delete(noteId);

    // report that the data item has been deleted
    transaction.oncomplete = function() {
      // delete the parent of the button
      // which is the list item, so it is no longer displayed
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
      console.log('Note ' + noteId + ' deleted.');

      // Again, if list item is empty, display a 'No notes stored' message
      if(!list.firstChild) {
        let listItem = document.createElement('li');
        listItem.textContent = 'No notes stored.';
        list.appendChild(listItem);
      }
    };
  }
};

var constraints = { audio: true, video:false };
function startRecording(event) {
  if(event) {
    // currentTimestamp = player.getCurrentTime();
    // player.pauseVideo();
    console.log("recordButton clicked");
    stopButton.innerHTML = event.pointerType;

    // recordButton.disabled = true;
    // stopButton.disabled = false;

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
      console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

      audioContext = new AudioContext();
      gumStream = stream;
      input = audioContext.createMediaStreamSource(stream);

      rec = new Recorder(input,{numChannels:1});
      rec.record()

      console.log("Recording started");

    }).catch(function(err) {
        //enable the record button if getUserMedia() fails
        console.log("failed start recording");
        console.log(err);
        recordButton.disabled = false;
        stopButton.disabled = true;
    });
  }
}

function stopRecording(event) {
  if(event) {
    console.log("stopButton clicked");
    stopButton.innerHTML = event.pointerType;

    //disable the stop button, enable the record too allow for new recordings
    // stopButton.disabled = true;
    // recordButton.disabled = false;

    rec.stop();
    gumStream.getAudioTracks()[0].stop();

    rec.exportWAV(createDownloadLink);
  }
}
function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  console.log(url);
  var au = document.createElement('audio');
  var navBtn = document.createElement('button')
  var li = document.createElement('li');
  var link = document.createElement('a');

  // send the audio file to speech recognition.
  websocket.send(blob);

  //   name of .wav file to use during upload and download (without extendion)
  var filename = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});

  //   save to disk link
  link.href = url;
  link.download = filename+".wav"; //download forces the browser to donwload the file using the  filename
  link.innerHTML = filename;
  li.appendChild(link);
  recordingsList.appendChild(li);

  //    what should be done here:
  //    1. save the blob in a global variable.
  //    2. go to addData() function and enable submitting audio item for storage.
  blobToSave = blob;
}
