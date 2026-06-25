const passwordInput = document.querySelector("#password");
const copyButton = document.querySelector("#copyButton");
const generateButton = document.querySelector("#generateButton");
const lengthInput = document.querySelector("#length");
const lengthValue = document.querySelector("#lengthValue");
const message = document.querySelector("#message");

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

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function getSelectedCharacters() {
  return Object.keys(options)
    .filter((key) => options[key].checked)
    .map((key) => characters[key])
    .join("");
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const availableCharacters = getSelectedCharacters();

  if (!availableCharacters) {
    showMessage("Escolha pelo menos um tipo de caractere.", true);
    return;
  }

  let password = "";

  for (let index = 0; index < length; index += 1) {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    password += availableCharacters[randomIndex];
  }

  passwordInput.value = password;
  showMessage("Senha gerada com sucesso.");
}

async function copyPassword() {
  const password = passwordInput.value;

  if (!password || password === "Clique em gerar") {
    showMessage("Gere uma senha antes de copiar.", true);
    return;
  }

  try {
    await navigator.clipboard.writeText(password);
    showMessage("Senha copiada para a area de transferencia.");
  } catch {
    passwordInput.select();
    document.execCommand("copy");
    showMessage("Senha copiada.");
  }
}

lengthInput.addEventListener("input", () => {
  lengthValue.textContent = lengthInput.value;
});

generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);

generatePassword();
