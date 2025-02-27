const textInput = document.getElementById('textInput');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const enviarButton = document.getElementById('enviarButton');
const inputValidation = document.getElementById("inputValidation");

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
recognition.continuous = true;

startButton.addEventListener('click', () => {
    textInput.value = "";
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
    console.error('Error en el reconocimiento de voz: ', event.error);
};

recognition.onspeechend = () => {
  console.log("Speech has stopped being detected");
};


enviarButton.addEventListener("click", async () => {
  const text = textInput.value.trim();

  inputValidation.textContent = "";
  if (!text) {
      inputValidation.textContent = "Por favor, ingrese un texto.";
      textInput.focus()
      return;
  }

  enviarButton.disabled = true;
  
  fetchData("/text-analysis/analyze", "POST", { text })
    .then(() => {
      alert("Texto enviado");
      //window.location.href = getSuccessUrl(text);
      enviarButton.disabled = true;
    })
    .catch(() => {
      enviarButton.disabled = false;
    });
});