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
  return `/sentiment_analysis/${name}`;
}

// Registrar una nueva cara
registerBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();

    nameValidation.textContent = "";
    if (!name) {
        nameValidation.textContent = "Por favor, ingrese su nombre.";
        nameInput.focus()
        return;
    }

    registerBtn.disabled = true;

    const image = captureImage();
    
    fetchData("/facial_recognition/register", "POST", { name, image })
      .then(() => {
        window.location.href = getSuccessUrl(name);
      })
      .catch(() => {
        registerBtn.disabled = false;
      });

    // try {
    //     const response = await fetch("/facial_recognition/register", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ name, image }),
    //     });
    //     if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    //     const result = await response.json();
    //     message.textContent = result.success ? `Registro exitoso: ${result.message}` : result.error;
    // } catch (error) {
    //     showAlert("Error al intentar registrar. Intente de nuevo, por favor.", "danger");
    //     // message.textContent = "Error al intentar registrar";
    //     console.error("Error en la solicitud de registro:", error);
    // }
});

// Autenticar usuario
authenticateBtn.addEventListener("click", async () => {
    const image = captureImage();

    fetchData("/facial_recognition/authenticate", "POST", { image })
      .then(data => {
        window.location.href = getSuccessUrl(data.name);
      });

    // try {
    //     const response = await fetch("/facial_recognition/authenticate", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ image }),
    //     });
    //     if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    //     const result = await response.json();
    //     if (result.name) {
    //         // message.textContent = `Bienvenido, ${result.name}!`;
    //         window.location.href = getSuccessUrl(result.name);
    //     } else {
    //         message.textContent = result.error;
    //     }
    // } catch (error) {
    //     showAlert("Error al intentar autenticar. Intente de nuevo, por favor.", "danger");
    //     // message.textContent = "Error al intentar autenticar";
    //     console.error("Error en la solicitud de autenticación.", error);
    // }
});