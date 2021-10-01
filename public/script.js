const messageForm = document.querySelector("#send-message");
const socket = io();

socket.on("message", addMesagges);

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = formData();
  if (!data) return;
  postMessage(data).then(() => {
    console.log("Message sent");
  });
});

function addMesagges(message) {
  const messagesArea = document.querySelector(".messages");
  messagesArea.prepend(formatMesage(message));
}

function formatMesage(message) {
  const { name, text, time } = message;
  const listElement = document.createElement("li");
  listElement.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-start"
  );
  const messageElement = document.createElement("div");
  messageElement.classList.add("ms-2", "me-auto");
  const messageHeader = document.createElement("div");
  messageHeader.classList.add("fw-bold");
  messageHeader.innerHTML = `<h4>${name}</h4>`;
  const timeSpan = document.createElement("span");
  timeSpan.innerText = time;
  messageElement.append(messageHeader, text);
  listElement.append(messageElement, timeSpan);
  return listElement;
}

async function getMessages() {
  const newMessages = await axios.get("/messages");
  for (let message of newMessages.data) {
    addMesagges(message);
  }
}
async function postMessage({ name, text }) {
  await axios.post("/messages", { name, text });
}
const formData = function () {
  const nameInput = document.querySelector("#name");
  const textMessage = document.querySelector("#text");
  const response = {};
  for (let input of [nameInput, textMessage]) {
    const { name, value } = input;
    if (!value) return false;
    response[name] = value;
  }
  textMessage.value = "";
  return response;
};
getMessages();
