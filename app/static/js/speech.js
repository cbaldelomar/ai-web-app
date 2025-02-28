const textInput = document.getElementById('textInput');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const enviarButton = document.getElementById('enviarButton');
const inputValidation = document.getElementById("inputValidation");
const activateMic = document.getElementById('activateMic');
const deactivateMic = document.getElementById('deactivateMic');
const result = document.getElementById("result");
const icon = enviarButton.querySelector("i");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;

startButton.addEventListener('click', () => {
    recognition.start();
});

stopButton.addEventListener('click', () => {
  recognition.stop();
});

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    textInput.value += transcript + " ";
};

recognition.onerror = (event) => {
  startButton.classList.remove("d-none");
  activateMic.classList.remove("d-none");
  stopButton.classList.add("d-none");
  deactivateMic.classList.add("d-none");

  const message = "Error al activar el reconocimiento de voz";
  inputValidation.textContent = `${message}. Intente de nuevo.`;
  console.error(`${message}: ${event.error}`);

  if (event.message) {
    console.log(`Additional information: ${event.message}`);
  }
};

recognition.onstart = () => {
  textInput.value = "";
  inputValidation.textContent = "";
  startButton.classList.add("d-none");
  activateMic.classList.add("d-none");
  stopButton.classList.remove("d-none");
  deactivateMic.classList.remove("d-none");
  console.log("Speech recognition service has started");
};

recognition.onend = () => {
  startButton.classList.remove("d-none");
  activateMic.classList.remove("d-none");
  stopButton.classList.add("d-none");
  deactivateMic.classList.add("d-none");
  console.log("Speech has stopped being detected");
};


enviarButton.addEventListener("click", () => {
  recognition.stop();

  textInput.classList.remove("is-invalid");
  result.classList.add("d-none");
  inputValidation.textContent = "";
  enviarButton.disabled = true;
  icon.classList.remove("d-none");

  // Esperar uns segundo para enviar el texto.
  setTimeout(() => {
    sendText();
  }, 500);
});

const sendText = () => {
  const text = textInput.value.trim();

  if (!text) {
      inputValidation.textContent = "Por favor, ingrese un texto.";
      textInput.classList.add("is-invalid");
      textInput.focus()
      enviarButton.disabled = false;
      icon.classList.add("d-none");
      return;
  }

  fetchData("/text-analysis/analyze", "POST", { text })
    .then(data => {
      const department = document.getElementById("department");
      department.textContent = data.departamento;

      const oracionesDiv = document.getElementById("oraciones");
      oracionesDiv.innerHTML = "";

      data.sentimientos.forEach(resultado => {
          oracionesDiv.innerHTML += `
              <div>
                  <p><strong>Oración:</strong> ${resultado.oracion}</p>
                  <p><strong>Sentimiento:</strong> ${resultado.sentimiento}</p>
                  <p><strong>Confianza:</strong> ${resultado.confianza}</p>
                  <img class="sticker" src="/static/img/stickers/${resultado.sticker}" alt="Sticker">
              </div>
          `;
      });

      result.classList.remove("d-none");
    })
    .catch(() => {
      
    })
    .finally(() => {
      enviarButton.disabled = false;
      icon.classList.add("d-none");
    });
}