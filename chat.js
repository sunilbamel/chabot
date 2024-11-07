const base_url = "https://aibot.helpdigitally.com";
var chat_box = document.getElementById("chat-box");
var mic_btn = document.getElementById("mic_btn");
var chat_header = document.getElementById("chat_header");
var chat_header_container = document.getElementById("chat_header_container");
var chats_container = document.getElementById("chats_container");
var input = document.getElementById("myInput");
var submit_btn = document.getElementById("submit_btn");
var pauseButton = document.getElementById("podpause");
var playButton = document.getElementById("podplay");
var stopButton = document.getElementById("podstop");
const closer = document.getElementById('summary-loader-closer');
const summaryplay = document.getElementById('summary-play-button');
const summarypause = document.getElementById('summary-pause-button');


let voiceType = null

const synth = window.speechSynthesis;
var SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;
var recognition = new SpeechRecognition();
var voicemute = false;

window.onload = function () {
    var divToHide = document.getElementById("chat-box");
    document.onclick = function (e) {
        if (
            divToHide.contains(e.target) ||
            e.target.classList.contains("nd2chat") ||
            e.target.parentNode.classList.contains("nd2chat") ||
            e.target.id == "chat-box"
        ) {
            divToHide.classList.add("open");
            divToHide.classList.remove("closed");
        } else {
            // stopText();
            divToHide.classList.remove("open");
            divToHide.classList.add("closed");
        }
    };
};

function muteChat() {
    var e = document.getElementById("closeBtn");
    e.classList.contains("fa-volume-up")
        ? (e.classList.remove("fa-volume-up"), e.classList.add("fa-volume-mute"))
        : (e.classList.remove("fa-volume-mute"), e.classList.add("fa-volume-up"));
    speechSynthesis.cancel();
    voicemute = true;

    document.querySelectorAll(".stop_btn").forEach((element) => {
        element.classList.add("d_none");
    });

    document.querySelectorAll(".start_btn").forEach((element) => {
        element.classList.remove("d_none");
    });

    document.querySelectorAll(".pause_btn").forEach((element) => {
        element.classList.add("d_none");
    });

    document.querySelectorAll(".play_btn").forEach((element) => {
        element.classList.remove("d_none");
    });
}

function VoiceTypeHandler(type) {
    var e = document.getElementById("poscast-action");
    const selement = document.getElementById('summary-loader');
    var chat = document.getElementById("chat-box");
    speechSynthesis.cancel();

    voiceType = type;
    if (type == 'poscast') {
        selement.style.display = 'none'
        if (chat.classList.contains('open')) {
            chat.classList.remove('open');
            chat.classList.add('closed');
        }
    }
    if (type == 'chat') {
        selement.style.display = 'none'
        if (e.classList.contains('open')) {
            e.classList.remove('open')
            e.classList.add('closed')
        }
    }
    if (type == 'summary') {
        if (chat.classList.contains('open')) {
            chat.classList.remove('open');
            chat.classList.add('closed');
        }
        if (e.classList.contains('open')) {
            e.classList.remove('open')
            e.classList.add('closed')
        }
    }

}

async function toogleChat() {
    await VoiceTypeHandler('chat')
    var e = document.getElementById("chat-box");
    e.classList.add("open");
}

function initializesearchbox() {
    let SearchContainer = document.createElement("div");
    // SearchContainer.style.display = "none";
    SearchContainer.id = "search-container";
    SearchContainer.innerHTML = `
    <button type="button" id="opensearchlistmodal" class="btn d-none btn-primary" data-bs-toggle="modal" data-bs-target="#searchlistmodal">
    </button>
    <div class="modal fade" id="searchlistmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <div class="w-100">
                    <form class="w-100 d-flex" method="post" id="searchform">
                        <div class="input-group">
                            <input id="searchinput" class="form-control form-control-sm" style="min-height: 40px;" type="text" placeholder="Search">
                            <span class="input-group-text" id="listion-icon" style='display:none'>
                                <i class="fas fs-6 fa-volume-up"></i>
                            </span>
                            <span class="input-group-text" id="start-listion-icon">
                                <i type="button" class="fas fs-6 fa-microphone"></i>
                            </span>
                        </div>
                        <button id="search-button" class="btn btn-sm rounded-3 btn-primary mx-3" type="submit" style="height:40px;">Search</button>
                    </form>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" style="max-height: 80vh; overflow-y: scroll;">
                <div id="not-found-result" class="text-center p-3" style="display:none">
                   No result found.
                </div>
                <div id="listening-body" class="text-center p-3" style="display:none">
                    Listening...
                </div>
                <div id="empty-body" class="text-center p-3">
                    <div style="height:100px">
                        <img src="./assets/images/icon-animation/search-image-3.png" class="h-100"/>
                    </div>
                    Create your search here.
                </div>
                <div>
                     <div id="search-list-header" class="search-list-header ps-3 py-1" style="display:none"></div>
                     <div id="header-pagination" class="text-end my-1 border-bottom" style="display:none"></div>
                </div>
                <div id="modal-spin" class="justify-content-center p-3" style="display: none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>  
                    </div>
                </div>
                <div>
                    <ul id="data-body" class="px-0" type='none'></ul>
                    <div id="loadbuttonDiv" class="justify-content-center" style="display:none">
                        <button class="btn btn-sm rounded-3 btn-primary mx-3" onclick="loadmore()" style="height:40px;">Load More ...</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
`
    document.body.appendChild(SearchContainer);
}

initializesearchbox()

const startButton = document.getElementById('start-listion-icon');
const listenbutton = document.getElementById('listion-icon');
const emptybody = document.getElementById('empty-body');
const listeningbody = document.getElementById('listening-body');
const inputValue = document.getElementById('searchinput');
const searchbutton = document.getElementById('search-button');
const notfound = document.getElementById('not-found-result');

var listdata;

async function searchlist(event) {
    const databody = document.getElementById('data-body');
    const modalspinner = document.getElementById('modal-spin');
    const loabuttondiv = document.getElementById('loadbuttonDiv');
    const listheader = document.getElementById('search-list-header');
    const pagination = document.getElementById('header-pagination');

    emptybody.style.display = 'none'
    modalspinner.style.display = 'flex';
    listheader.style.display = 'none';
    loabuttondiv.style.display = 'none';
    pagination.style.display = 'none';
    databody.style.display = 'none';
    databody.innerHTML = '';
    await fetch('http://192.168.1.6:8000/searchlist', {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: event }),
    })
        .then((response) => response.json())
        .then((responseText) => {
            if (responseText?.result?.question.length > 0) {
                listdata = responseText.result;
                databody.style.display = '';
                notfound.style.display = 'none'
                modalspinner.style.display = 'none';
                listheader.style.display = '';
                loabuttondiv.style.display = 'flex';
                listheader.innerHTML = `Results for "${event}"`
                pagination.style.display = '';
                pagination.innerHTML = `Results 1 - 10 of ${responseText.result.question.length}`
                for (let i = 0; i < 10; i++) {
                    var list = document.createElement('li')
                    list.className = 'lh-1 mb-3 pb-3 px-3 border-bottom'
                    list.innerHTML = `<a href=${responseText.result.url[i]} class="fs-5 mb-1 fw-semibold" style="color: #5c62fe !important;">${responseText.result.question[i].substr(0, 60).charAt(0).toUpperCase() + responseText.result.question[i].substr(0, 60).slice(1)}...</a>
                <a href=${responseText.result.url[i]} class="my-2 fs-14"><span class="badge bg-dark fs-10 me-1">URL</span>${responseText.result.url[i]}</a>
                <div class="fs-12">${responseText.result.data[i].substr(0, 180)}...</div>`
                    databody.appendChild(list)
                }
            }else{
                modalspinner.style.display = 'none';
                notfound.style.display = ''
            }
        })
}

document.getElementById('searchform').addEventListener('submit', async (e) => {
    e.preventDefault()
    if (inputValue.value == "") {
        return false;
    }
    searchlist(inputValue.value)
})

// Creating a SpeechRecognition object
const newrecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
newrecognition.lang = 'en-US'; // Set the language for recognition

// Event handler when recognition starts
var searchdata;
newrecognition.onstart = () => {
    searchdata = ""
    inputValue.disabled = true;
    searchbutton.disabled = true;
    emptybody.style.display = 'none';
    listeningbody.style.display = 'block'
    listenbutton.style.display = 'block'
    startButton.style.display = 'none'
    notfound.style.display = 'none'
};


// Event handler when recognition produces a result
newrecognition.onresult = (event) => {
    const result = event.results[0][0].transcript;
    searchdata = result;
    inputValue.value = result;
};


// Event handler when recognition ends
newrecognition.onend = () => {
    inputValue.disabled = false;
    searchbutton.disabled = false;
    listenbutton.style.display = 'none'
    startButton.style.display = 'block'
    if (searchdata) {
        emptybody.style.display = 'block';
        listeningbody.style.display = 'none';
        searchlist(searchdata)
    } else {
        if (listdata) {
            listeningbody.style.display = 'none'
        } else {
            emptybody.style.display = 'block';
            listeningbody.style.display = 'none'
        }
    }
};

// Event listener for the button click
startButton.addEventListener('click', () => {
    if (newrecognition && newrecognition.continuous) {
        newrecognition.stop();
    } else {
        newrecognition.start();
    }
});

var loadlength = 10;
function loadmore() {
    const loadbuttonDiv = document.getElementById('loadbuttonDiv');
    const pagination = document.getElementById('header-pagination');
    const databody = document.getElementById('data-body');
    if ((loadlength + 10) >= listdata.question.length) {
        loadbuttonDiv.style.display = 'none';
        loadlength = listdata.question.length;
    } else {
        loadlength += 10;
    }
    pagination.innerHTML = `Results 1 - ${loadlength} of ${listdata.question.length}`
    for (let i = (loadlength - 10); i < loadlength; i++) {
        var list = document.createElement('li')
        list.className = 'lh-1 mb-3 pb-3 px-3 border-bottom'
        list.innerHTML = `<a href=${listdata.url[i]} class="fs-5 mb-1 fw-semibold" style="color: #5c62fe !important;">${listdata.question[i].substr(0, 60).charAt(0).toUpperCase() + listdata.question[i].substr(0, 60).slice(1)}...</a>
        <a href=${listdata.url[i]} class="my-2 fs-14"><span class="badge bg-dark fs-10 me-1">URL</span>${listdata.url[i]}</a>
        <div class="fs-12">${listdata.data[i].substr(0, 180)}...</div>`
        databody.appendChild(list)
    }
}


// 192.168.1.6:8000/searchlist
function opensearchbox() {
    const modal = document.getElementById('opensearchlistmodal');
    inputValue.value = ''
    listdata = '';
    modal.click()
}

function initializeChatWidget(e) {
    let chatContainer = document.createElement("div");
    chatContainer.style.display = "none";
    chatContainer.id = "chat-container";

    chatContainer.innerHTML = `<div id="chat-bubble">

<div id="nd1" class="nd1 nds">
    <i class="fas fa-podcast"></i>
    <div class="nd4 nds" id="nd4">
        <div class="nd4-inside shadow">
           <div class="badge badge-golden" type="button" onclick="getsummary()">Listen Summary</div>
           <div class="badge badge-golden" type="button" onclick="togglePod()">Listen Page</div>
        </div>
    </div>
</div>
<div class="nd3 nds">
    <i class="fas fa-comment"></i>
    <div class="nd2 nds" id="nd2">
        <div class="nd2-inside shadow">
           <div class="badge badge-golden nd2chat" title="Chat" type="button" onclick="toogleChat()">Chat</div>
           <div class="badge badge-golden" title="Search" type="button" onclick="opensearchbox()">Search</div>
        </div>
    </div>
</div>
<div id="floating-button">
  <p class="plus">+</p>
  <i class="edit fas fa-times"></i>
</div>

<div>`;
    document.body.appendChild(chatContainer);
    initializeChatBox(e);
    initPodcast(e);
    setTimeout(() => {
        chatContainer.style = "";
    }, 800);
}

closer.addEventListener('click', function () {
    const selement = document.getElementById('summary-loader');
    selement.style.display = 'none'
    speechSynthesis.cancel();
});

summarypause.addEventListener('click', function () {
    speechSynthesis.pause();
    summarypause.style.display = "none"
    summaryplay.style.display = "block"
})

summaryplay.addEventListener('click', function () {
    speechSynthesis.resume();
    summaryplay.style.display = "none"
    summarypause.style.display = "block"
})

async function getsummary() {
    await VoiceTypeHandler('summary')
    const selement = document.getElementsByClassName('container');
    const sloader = document.getElementById('summary-loader');
    const header = document.getElementById('summary-loader-header');
    const responseText1 = document.getElementById('responseText');
    const responseloader = document.getElementById('response-loader');

    const summary = selement[3].innerText;
    sloader.style.display = 'flex'
    header.innerHTML = "Summary Analyzing ..."
    // closer.style.display = 'none'
    responseloader.style.display = 'block';

    speechVoice('We appreciate your understanding and patience during this time. Rest assured, our team is actively monitoring the process, and as soon as the API response is received, the placeholder content will transform into the dynamic, real-time data you are anticipating.');
    let blanktext = "";
    await fetch(`${base_url}/summary`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: summary }),
    })
        .then((response) => response.json())
        .then((responseText) => {
            if (responseText.status === true && voiceType == "summary") {
                speechSynthesis.cancel();
                responseloader.style.display = 'none'
                summarypause.style.display = "block"
                responseText1.innerHTML = responseText.result
                blanktext = responseText.result
                responseText1.style.display = 'block'
                header.innerHTML = "Summary"
                closer.style.display = 'block'
                speechVoice(blanktext)
                // togglePod()
            }
        })
}

function initializeChatBox() {
    let chatContainer = document.getElementById("chat-container");
    let chatBox = document.createElement("div");
    chatBox.id = "chat-box";
    chatBox.classList.add("closed");
    chatBox.innerHTML = `<div class="card shadow-lg">
      <div id="chat_header_container"
          class="d_flex flex_row  justify_content_between align_item_center pd_3 adiv text-white">

          <span id="chat_header" class="fw-semibold">Live chat</span>
          <i type="button" onclick="muteChat()" title="Mute" id="closeBtn" class="fas fs-6 fa-volume-up"></i>
      </div>
      <div id="chats_container">
        <div class="d_flex flex_row pyx_2">
            <img loading="lazy" src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
                width="30" height="30">
            <span class="chat">Hello and thankyou for visiting us.</span>
        </div>
        <div class="d_flex flex_row pyx_2">
            <img loading="lazy" src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
                width="30" height="30">
            <span class="chat">How can i help you?</span>
        </div>
      </div>
      <div class="chat_footer">
      <div class="d_flex justify_content_between align_items_center">
          <div class="chat_input">
            <form id="myChatForm">
              <input id="myInput" autocomplete="off" class="form-control" placeholder="Type your message"/>
                <button type="submit" id="submit_btn" class="fs-6 d_none" title="send">send</button>
            </form>
          </div>

          <div class="">
              <div type="button" title="Voice Speech Recognition" onclick="toggleMic()" id="mic_btn"
                  class="mic_btn border border-1 position-relative">
                  <i class="fas position-absolute fa-microphone"></i>
              </div>
          </div>
      </div>
      </div>
    </div>`;

    chatContainer.appendChild(chatBox);
    document.body.appendChild(chatContainer);
    chat_box = document.getElementById("chat-box");
    mic_btn = document.getElementById("mic_btn");
    chat_header = document.getElementById("chat_header");
    chat_header_container = document.getElementById("chat_header_container");
    chats_container = document.getElementById("chats_container");
    input = document.getElementById("myInput");
    submit_btn = document.getElementById("submit_btn");
    synth.cancel();
    handleSubmit();
}
function loadCSS() {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "./chat.css";
    document.head.appendChild(link);
}

function toggleMic() {
    if (mic_btn.classList.contains("voiceActive")) {
        stopSpeechRecog();
    } else {
        runSpeechRecog();
    }
}

const runSpeechRecog = () => {
    recognition.start();
    recognition.onstart = () => {
        stopText();
        chat_header.innerHTML = "Listening...";
        chat_header_container.classList.add("bg-success");
        mic_btn.classList.add("voiceActive");
    };

    recognition.onerror = (e) => {
        alert(`Error : ${e.error}`);
        stopSpeechRecog();
    };

    recognition.onresult = async (e) => {
        var transcript = e.results[0][0].transcript;
        appendUserChat(transcript);
        chat_header.innerHTML = "Processing...";
        chat_header_container.classList.remove("bg-success");
        mic_btn.classList.remove("voiceActive");

        fetchResult(transcript);
    };
};

const stopSpeechRecog = (event) => {
    stopText();
    chat_header.innerHTML = "Live Chat";
    chat_header_container.classList.remove("bg-success");
    mic_btn.classList.remove("voiceActive");

    event.target.classList.add("d_none");

    const parent = event.target.parentNode;
    Array.from(parent.children).forEach((element) => {
        if (element.classList.contains("pause_btn")) {
            element.classList.add("d_none");
        }
    });
    Array.from(parent.children).forEach((element) => {
        if (element.classList.contains("play_btn")) {
            element.classList.remove("d_none");
        }
    });
};

const fetchResult = async (transcript) => {
    await fetch(`${base_url}/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: transcript }),
    })
        .then((response) => response.json())
        .then((responseText) => {
            if ("speechSynthesis" in window) {
                appendBotChat(responseText.data);
                chat_header.innerHTML = "Live Chat";
                if (voicemute == false) {
                    speechVoice(responseText.data.data);
                }
            } else {
                console.log("Speech Synthesis is not Supported");
            }
        })
        .catch((error) => {
            chat_header.innerHTML = "Error Occured";
            chat_header_container.classList.remove("bg-success");
            chat_header_container.classList.add("bg-danger");

            setTimeout(() => {
                chat_header.innerHTML = "Live Chat";
                chat_header_container.classList.remove("bg-danger");
            }, [4000]);

            console.log(error);
        });
};

const appendUserChat = (text) => {
    const mainContainer = document.createElement("div");
    mainContainer.classList.add(
        "d_flex",
        "flex_row",
        "justify_content_end",
        "pyx_2"
    );

    const innerDiv1 = document.createElement("div");
    innerDiv1.classList.add("usermsg");
    innerDiv1.innerHTML = `<span class="text_muted">${text}</span>`;

    const innerDiv2 = document.createElement("div");
    const userIcon = document.createElement("img");
    userIcon.src =
        "https://img.icons8.com/color/48/000000/circled-user-male-skin-type-7.png";
    userIcon.loading = "lazy";
    userIcon.width = 30;
    userIcon.height = 30;
    innerDiv2.appendChild(userIcon);

    mainContainer.appendChild(innerDiv1);
    mainContainer.appendChild(innerDiv2);

    chats_container.appendChild(mainContainer);
    chats_container.scrollTop = chats_container.scrollHeight;
};

const appendBotChat = (text) => {
    const mainContainer = document.createElement("div");
    mainContainer.classList.add("d_flex", "flex_row", "pyx_2");

    mainContainer.innerHTML = `<img loading="lazy" src="https://img.icons8.com/color/48/000000/circled-user-female-skin-type-7.png"
  width="30" height="30"><div class="d_flex flex_column"><div class="chat"><span>${text.data
        }</span>${text?.url
            ? `<a class="bot_url" target="_blank" href="${text?.url}">${text?.url}</a>`
            : ""
        }</div><div class="d_flex fs5 myx5"><button type="button" class="play_pause_btn pause_btn me_1 ${voicemute == true ? "d_none" : ""
        }" onclick="pauseHandler(event)">Pause</button><button type="button" onclick="playHandler(event)" class="play_pause_btn play_btn me_1 ${voicemute == false ? "d_none" : ""
        }">Play</button><button type="button" class="start_stop_btn stop_btn ${voicemute == true ? "d_none" : ""
        }" onclick="stopSpeechRecog(event)">Stop</button></div>
</div>`;

    chats_container.appendChild(mainContainer);
    chats_container.scrollTop = chats_container.scrollHeight;
};

const handleSubmit = () => {
    document.getElementById("myChatForm").addEventListener("submit", (event) => {
        event.preventDefault();

        if (input.value) {
            appendUserChat(input.value);
            fetchResult(input.value);
            input.value = "";
            submit_btn.classList.add("d_none");
        }
    });

    input.addEventListener("input", function (e) {
        e.target.value.length > 0
            ? submit_btn.classList.remove("d_none")
            : submit_btn.classList.add("d_none");
    });
};

function startHandler(event) {
    const text =
        event.target.parentNode.parentNode.firstChild.firstChild.innerText;
    speechVoice(text);

    event.target.classList.contains("d_none")
        ? event.target.classList.remove("d_none")
        : event.target.classList.add("d_none");
    const parent = event.target.parentNode;

    Array.from(parent.children).forEach((element) => {
        if (element.classList.contains("stop_btn")) {
            element.classList.contains("d_none")
                ? element.classList.remove("d_none")
                : element.classList.add("d_none");
        }
    });
}

function playHandler(event) {
    stopText();
    const text =
        event.target.parentNode.parentNode.firstChild.firstChild.innerText;
    speechVoice(text);

    event.target.classList.add("d_none");

    const parent = event.target.parentNode;
    Array.from(parent.children).forEach((element) => {
        if (element.classList.contains("pause_btn")) {
            element.classList.remove("d_none");
        }
        if (element.classList.contains("stop_btn")) {
            element.classList.remove("d_none");
        }
    });
}

function pauseHandler(event) {
    event.target.classList.add("d_none");

    const parent = event.target.parentNode;
    Array.from(parent.children).forEach((element) => {
        if (element.classList.contains("play_btn")) {
            element.classList.remove("d_none");
        }
        if (element.classList.contains("stop_btn")) {
            element.classList.add("d_none");
        }
    });
    pauseText();
}

const speechVoice = (text) => {
    var utterance = new SpeechSynthesisUtterance();
    // var voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices[2];
    utterance.text = text;
    // utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
};

loadCSS();

/* Start Podcast */
function scrapText(id = null) {
    let tagText = id
        ? document.getElementById(id).innerText
        : document.querySelector("body").innerText;
    speechVoice(tagText);
}

async function togglePod() {
    await VoiceTypeHandler('poscast')
    stopText();
    var e = document.getElementById("poscast-action");
    if (!e.classList.contains("open")) {
        e.classList.remove("closed");
        e.classList.add("open");
        speechSynthesis.cancel();
        scrapText();
    } else {
        e.classList.remove("open");
        e.classList.add("closed");
    }
}

const initPodcast = () => {
    let podContainer = document.createElement("div");
    podContainer.id = "poscast-action";
    podContainer.classList.add("closed");
    podContainer.innerHTML = `<span title="pause" id='podpause'><i class="fas fa-pause"></i></span>
  <span id='podplay' title="play" class="d_none"><i class="fas fa-play"></i></span>
  <span id='podstop' titple="Reset"><i class="fas fa-stop"></i></span>`;
    document.body.appendChild(podContainer);

    pauseButton = document.getElementById("podpause");
    playButton = document.getElementById("podplay");
    stopButton = document.getElementById("podstop");

    playButton.addEventListener("click", () => {
        playButton.className = "d_none";
        stopButton.className = "";
        pauseButton.className = "";
        scrapText();
        // speechSynthesis.paused ? speechSynthesis.resume() : scrapText();
    });

    pauseButton.addEventListener("click", (e) => {
        pauseButton.className = "d_none";
        playButton.className = "";
        pauseText();
    });

    stopButton.addEventListener("click", () => {
        playButton.className = "";
        stopButton.className = "d_none";
        pauseButton.className = "d_none";
        stopText();
    });
};

function pauseText() {
    if (speechSynthesis.speaking) speechSynthesis.pause();
}

function stopText() {
    speechSynthesis.resume();
    speechSynthesis.cancel();
}
