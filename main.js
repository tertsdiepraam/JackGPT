
const messages = document.getElementById("messages");
const prompt_input = document.getElementById("prompt");
const send_button = document.getElementById("send");

let introduction = "";
let responses = []; 
let ready_for_input = false;

fetch("./answers.txt").then((r) => r.text()).then((r) => {
    const lines = r.split("\n\n");
    introduction = lines.shift();
    responses = lines;
    ready_for_input = true;

    add_message("bot", introduction);
})


const add_message = (cls, msg) => {
    const p = document.createElement("p");
    p.innerText = msg

    const message_text = document.createElement("div");
    message_text.className = "message-text";
    message_text.appendChild(p);

    const message = document.createElement("div");
    message.classList.add("message");
    message.classList.add(cls);
    message.appendChild(message_text);

    messages.appendChild(message)

    messages.scrollTo(0, messages.scrollHeight);
}

const random_element = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const respond = () => {
    let response = random_element(responses);
    add_message("bot", response);
    ready_for_input = true;
}

const send_message = () => {
    if (!ready_for_input) {
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

// add_message("human", "booooom!");