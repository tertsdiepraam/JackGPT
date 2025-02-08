
const messages = document.getElementById("messages");
const prompt_input = document.getElementById("prompt");
const send_button = document.getElementById("send");

prompt_input.focus();

let introduction = "";
let responses = [];
let ready_for_input = false;
let rest_of_response = "";
let queued_responses = [];

fetch("./answers.txt").then((r) => r.text()).then((r) => {
    const lines = r.split("\n\n");
    introduction = lines.shift();
    responses = lines;
    ready_for_input = true;
})

const reveal_text = (element, str, idx) => {
    element.innerText = str.substring(0, idx + 1);
    messages.scrollTo(0, messages.scrollHeight);
    let delay;
    const c = str.charAt(idx);
    if (c === "." || c === "!" || c === "?") {
        delay = 200;
    } else if (c === ",") {
        delay = 150;
    } else {
        delay = Math.floor(Math.random() * 20);
    }
    if (idx + 1 < str.length) {
        setTimeout(() => reveal_text(element, str, idx + 1), delay)
    } else {
        ready_for_input = true;
    }
}

const add_message = (cls, msg) => {
    const p = document.createElement("p");

    if (cls === "bot") {
        reveal_text(p, msg, 0);
    } else {
        p.innerText = msg;
    }

    const message_text = document.createElement("div");
    message_text.className = "message-text";
    message_text.appendChild(p);

    const message = document.createElement("div");
    message.classList.add("message");
    message.classList.add(cls);
    message.appendChild(message_text);

    messages.appendChild(message);

    messages.scrollTo(0, messages.scrollHeight);
}

const shuffle = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const respond = () => {
    if (queued_responses.length === 0) {
        queued_responses = responses.slice();
        shuffle(queued_responses);
    }
    let response = queued_responses.pop();
    add_message("bot", response);
    ready_for_input = true;
}

const send_message = () => {
    if (!ready_for_input) {
        return;
    }

    if (prompt_input.value.trim() === "") {
        return;
    }

    add_message("human", prompt_input.value);
    prompt_input.value = "";
    ready_for_input = false;
    setTimeout(() => respond(), 1000);
}

prompt_input.addEventListener("keypress", (evt) => {
    if (evt.key === "Enter") {
        send_message();
    }
})

send_button.addEventListener("click", () => {
    send_message();
})
