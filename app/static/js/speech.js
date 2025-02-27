const textInput = document.getElementById('textInput');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const enviarButton = document.getElementById('enviarButton');
const inputValidation = document.getElementById("inputValidation");
const activateMic = document.getElementById('activateMic');
const deactivateMic = document.getElementById('deactivateMic');

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;

startButton.addEventListener('click', () => {
    textInput.value = "";
    inputValidation.textContent = "";
    startButton.classList.add("d-none");
    activateMic.classList.add("d-none");
    stopButton.classList.remove("d-none");
    deactivateMic.classList.remove("d-none");
    recognition.start();
});

stopButton.addEventListener('click', () => {
  inputValidation.textContent = "";
  startButton.classList.remove("d-none");
  activateMic.classList.remove("d-none");
  stopButton.classList.add("d-none");
  deactivateMic.classList.add("d-none");
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

recognition.onspeechend = () => {
  console.log("Speech has stopped being detected");
};


enviarButton.addEventListener("click", () => {
  recognition.stop();

  const text = textInput.value.trim();

  textInput.classList.remove("is-invalid");
  inputValidation.textContent = "";
  if (!text) {
      inputValidation.textContent = "Por favor, ingrese un texto.";
      textInput.classList.add("is-invalid");
      textInput.focus()
      return;
  }

  enviarButton.disabled = true;
  
  fetchData("/text-analysis/analyze", "POST", { text })
    .then(() => {
      alert("Texto enviado");
      //window.location.href = getSuccessUrl(text);
    })
    .catch(() => {
      
    })
    .finally(() => {
      enviarButton.disabled = false;
    });
});