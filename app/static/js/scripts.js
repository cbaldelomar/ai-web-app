document.addEventListener('DOMContentLoaded', function() {
    
});


const showMessage = (message, type) => {
    const messageElement = document.getElementById('message')

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message || "";

    // const alertPlaceholder = document.getElementById('alert_placeholder')

    // if (!message) {
    //     alertPlaceholder.innerHTML = "";
    //     return;
    // }

    // alertPlaceholder.innerHTML = [
    //     `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    //     `   <div>${message}</div>`,
    //     '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    //     '</div>'
    // ].join('')

    // alertPlaceholder.focus()
}

const fetchData = async (url, method = "GET", data = null) => {
    showMessage(false);

    try {
        // Define request options
        const options = {
            method,
            headers: {
                "Content-Type": "application/json"
            }
        };

        // Include body only if method is not GET/HEAD and data is provided
        if (data && method !== "GET" && method !== "HEAD") {
            options.body = JSON.stringify(data);
        }

        // Make the request
        const response = await fetch(url, options);

        // Check if response is OK (200-299)
        if (!response.ok) {
            //"Se produjo un error inesperado.";
            let errorMessage = `Error ${response.status}: ${response.statusText}`;

            // Try to parse the error response if it's JSON
            if (response.headers.get("Content-Type")?.includes("application/json")) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            }

            // Handle client errors (400-499)
            if (response.status >= 400 && response.status < 500) {
                showMessage(errorMessage, "warning");
            }
            // Handle server errors (500+)
            else if (response.status >= 500) {
                showMessage(errorMessage, "danger");
            }

            throw new Error(errorMessage);
        }

        // ✅ Handle 204 No Content (return null)
        if (response.status === 204) {
            return null;
        }

        // Parse the successful response
        return await response.json();

    } catch (error) {
        console.error("Fetch error:", error.message);
        throw error;
    }
};

// // Example usage:
// fetchData("https://api.example.com/data")
//     .then(data => {
//         console.log("API Response:", data);
//     });