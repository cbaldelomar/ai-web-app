const video = document.getElementById("video");
const registerBtn = document.getElementById("register");
const authenticateBtn = document.getElementById("authenticate");
const nameInput = document.getElementById("name");
const message = document.getElementById("message");
const nameValidation = document.getElementById("name_validation");

// Acceder a la cámara
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        message.textContent = "Error al acceder a la cámara: " + err.message;
        console.error("Error al acceder a la cámara:", err);
    });

// Capturar imagen del video
const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg");
}

const getSuccessUrl = (name) => {
  return `/text-analysis/${name}`;
}

// Autenticar usuario con el rostro
authenticateBtn.addEventListener("click", () => {
  const image = captureImage();

  nameInput.classList.remove("is-invalid");
  message.textContent = "";
  nameValidation.textContent = "";

  registerBtn.disabled = true;
  authenticateBtn.disabled = true;

  fetchData("/facial_recognition/authenticate", "POST", { image })
    .then(data => {
      window.location.href = getSuccessUrl(data.name);
    })
    .catch(() => {

    })
    .finally(() => {
      registerBtn.disabled = false;
      authenticateBtn.disabled = false;
    });
});

// Registrar un nuevo rostro
registerBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();

    nameInput.classList.remove("is-invalid");
    message.textContent = "";
    nameValidation.textContent = "";

    invalid = invalidName(name);
    if (invalid) {
        nameValidation.textContent = invalid;
        nameInput.classList.add("is-invalid");
        nameInput.focus();
        return;
    }

    registerBtn.disabled = true;
    authenticateBtn.disabled = true;

    const image = captureImage();
    
    fetchData("/facial_recognition/register", "POST", { name, image })
      .then(() => {
        window.location.href = getSuccessUrl(name);
      })
      .catch(() => {

      })
      .finally(() => {
        registerBtn.disabled = false;
        authenticateBtn.disabled = false;
      });
});

const invalidName = (name) => {
  if (!name || typeof name !== "string") {
      return "Por favor, ingrese su nombre.";
  }

  // Prevent path traversal attacks
  if (name.includes("..")) {
      return "El nombre no puede contener dos puntos seguidos (..)";
  }

  // Disallow special characters that are unsafe in filenames
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
      return 'El nombre no puede contener los siguientes carácteres: < > : " / \\ | ? *';
  }

  // Limit length to prevent filesystem issues
  if (name.length < 3 || name.length > 30) {
      return "El nombre debe tener entre 3 y 30 carácteres.";
  }

  // No errors, valid filename
  return null;
}