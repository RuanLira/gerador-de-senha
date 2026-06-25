const passwordInput = document.querySelector("#password");
const copyButton = document.querySelector("#copyButton");
const generateButton = document.querySelector("#generateButton");
const lengthInput = document.querySelector("#length");
const lengthValue = document.querySelector("#lengthValue");
const message = document.querySelector("#message");
const themeButton = document.querySelector("#themeButton");
const strengthText = document.querySelector("#strengthText");
const strengthBar = document.querySelector("#strengthBar");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");

const options = {
  uppercase: document.querySelector("#uppercase"),
  lowercase: document.querySelector("#lowercase"),
  numbers: document.querySelector("#numbers"),
  symbols: document.querySelector("#symbols"),
};

const characters = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%&*_-+=?",
};

const themeStorageKey = "preferredTheme";
let passwordHistory = [];

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function getSelectedOptions() {
  return Object.keys(options)
    .filter((key) => options[key].checked);
}

function getSelectedCharacters() {
  return getSelectedOptions()
    .map((key) => characters[key])
    .join("");
}

function getRandomCharacter(characterList) {
  const randomIndex = Math.floor(Math.random() * characterList.length);
  return characterList[randomIndex];
}

function shuffleText(text) {
  return text
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

function updateStrength(password) {
  const selectedOptions = getSelectedOptions();
  let score = 0;

  if (password.length >= 10) score += 1;
  if (password.length >= 16) score += 1;
  if (selectedOptions.length >= 3) score += 1;
  if (selectedOptions.length === 4) score += 1;

  strengthBar.className = "strength-bar";

  if (score <= 1) {
    strengthText.textContent = "Fraca";
    strengthBar.classList.add("weak");
    return;
  }

  if (score <= 3) {
    strengthText.textContent = "Media";
    strengthBar.classList.add("medium");
    return;
  }

  strengthText.textContent = "Forte";
  strengthBar.classList.add("strong");
}

function renderHistory() {
  historyList.innerHTML = "";

  if (passwordHistory.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Nenhuma senha gerada ainda.";
    historyList.appendChild(emptyItem);
    return;
  }

  passwordHistory.forEach((password, index) => {
    const item = document.createElement("li");
    const passwordCode = document.createElement("code");
    const copyHistoryButton = document.createElement("button");

    passwordCode.textContent = password;
    copyHistoryButton.className = "history-copy-button";
    copyHistoryButton.type = "button";
    copyHistoryButton.dataset.password = password;
    copyHistoryButton.textContent = `Copiar #${index + 1}`;

    item.append(passwordCode, copyHistoryButton);
    historyList.appendChild(item);
  });
}

function addToHistory(password) {
  passwordHistory = [password, ...passwordHistory].slice(0, 5);
  renderHistory();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const temporaryInput = document.createElement("input");
    temporaryInput.value = text;
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
  }
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const selectedOptions = getSelectedOptions();
  const availableCharacters = getSelectedCharacters();

  if (!availableCharacters) {
    showMessage("Escolha pelo menos um tipo de caractere.", true);
    return;
  }

  if (length < selectedOptions.length) {
    showMessage("O tamanho precisa ser maior que a quantidade de opcoes.", true);
    return;
  }

  let password = selectedOptions
    .map((key) => getRandomCharacter(characters[key]))
    .join("");

  for (let index = 0; index < length; index += 1) {
    if (password.length === length) break;
    password += getRandomCharacter(availableCharacters);
  }

  password = shuffleText(password);
  passwordInput.value = password;
  updateStrength(password);
  addToHistory(password);
  showMessage("Senha gerada com sucesso.");
}

async function copyPassword() {
  const password = passwordInput.value;

  if (!password || password === "Clique em gerar") {
    showMessage("Gere uma senha antes de copiar.", true);
    return;
  }

  await copyText(password);
  showMessage("Senha copiada para a area de transferencia.");
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  themeButton.textContent = isDark ? "Tema claro" : "Tema escuro";
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
  updateStrength(passwordInput.value);
});

generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);
clearHistoryButton.addEventListener("click", () => {
  passwordHistory = [];
  renderHistory();
  showMessage("Historico limpo.");
});

themeButton.addEventListener("click", () => {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem(themeStorageKey, newTheme);
});

historyList.addEventListener("click", async (event) => {
  if (!event.target.classList.contains("history-copy-button")) return;

  await copyText(event.target.dataset.password);
  showMessage("Senha do historico copiada.");
});

applyTheme(localStorage.getItem(themeStorageKey) || "light");
renderHistory();
generatePassword();
