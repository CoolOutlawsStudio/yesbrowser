const joinCard = document.getElementById('joinCard');
const chatCard = document.getElementById('chatCard');
const joinForm = document.getElementById('joinForm');
const roomCodeInput = document.getElementById('roomCode');
const displayNameInput = document.getElementById('displayName');
const profilePicInput = document.getElementById('profilePic');
const profilePreview = document.getElementById('profilePreview');

const roomTitle = document.getElementById('roomTitle');
const userBadge = document.getElementById('userBadge');
const leaveBtn = document.getElementById('leaveBtn');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const stickerUpload = document.getElementById('stickerUpload');
const stickerTray = document.getElementById('stickerTray');
const messageTemplate = document.getElementById('messageTemplate');

const state = {
  roomCode: '',
  name: '',
  avatar: '',
  stickers: [],
};

profilePicInput.addEventListener('change', async () => {
  const file = profilePicInput.files?.[0];
  if (!file) return;
  const dataUrl = await fileToDataUrl(file);
  state.avatar = dataUrl;
  profilePreview.src = dataUrl;
  profilePreview.classList.remove('hidden');
});

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!state.avatar) {
    alert('Please upload a profile picture.');
    return;
  }

  state.roomCode = roomCodeInput.value.trim().toUpperCase();
  state.name = displayNameInput.value.trim();
  if (!state.roomCode || !state.name) return;

  roomTitle.textContent = `Room ${state.roomCode}`;
  userBadge.textContent = `You joined as ${state.name}`;

  joinCard.classList.add('hidden');
  chatCard.classList.remove('hidden');

  appendTextMessage(`joined the room 🎉`, 'System', state.avatar, true);
});

leaveBtn.addEventListener('click', () => {
  joinCard.classList.remove('hidden');
  chatCard.classList.add('hidden');
  messages.innerHTML = '';
  stickerTray.innerHTML = '';
  state.stickers = [];
  messageInput.value = '';
});

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;

  appendTextMessage(text, state.name, state.avatar);
  messageInput.value = '';
});

stickerUpload.addEventListener('change', async () => {
  const files = [...(stickerUpload.files || [])];
  for (const file of files) {
    const dataUrl = await fileToDataUrl(file);
    state.stickers.push(dataUrl);
    addStickerButton(dataUrl);
  }
  stickerUpload.value = '';
});

function addStickerButton(src) {
  const button = document.createElement('button');
  button.className = 'sticker-btn';
  button.type = 'button';
  button.title = 'Send sticker';

  const image = document.createElement('img');
  image.src = src;
  image.alt = 'custom sticker';
  button.appendChild(image);

  button.addEventListener('click', () => {
    appendStickerMessage(src, state.name, state.avatar);
  });

  stickerTray.appendChild(button);
}

function appendTextMessage(text, name, avatar, isSystem = false) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector('.avatar').src = avatar;
  node.querySelector('.meta').textContent = `${name} • ${new Date().toLocaleTimeString()}`;
  node.querySelector('.content').textContent = isSystem ? `✨ ${text}` : text;
  messages.appendChild(node);
  messages.scrollTop = messages.scrollHeight;
}

function appendStickerMessage(stickerSrc, name, avatar) {
  const node = messageTemplate.content.firstElementChild.cloneNode(true);
  node.querySelector('.avatar').src = avatar;
  node.querySelector('.meta').textContent = `${name} • ${new Date().toLocaleTimeString()}`;

  const image = document.createElement('img');
  image.src = stickerSrc;
  image.alt = 'sticker message';
  node.querySelector('.content').appendChild(image);

  messages.appendChild(node);
  messages.scrollTop = messages.scrollHeight;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
