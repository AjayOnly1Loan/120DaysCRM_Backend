// Function to extract Aadhaar ID from URL
function getIdFromUrl() {
    const urlParts = window.location.pathname.split("/");
    return urlParts[urlParts.length - 1];
}

// Function to request OTP
async function requestOtp() {
  const requestButton = document.querySelector("#requestOtpBtn")
  // Disable the button and show the loader
  requestButton.disabled = true;
  requestButton.textContent = "Requesting...";

    try {
        // request for otp
        const response = await fetch(`/api/verify/aadhaar`);
        const result = await response.json();

        if (response.ok && result.success) {
            alert("OTP sent successfully! Redirecting to OTP page...");
            const { codeVerifier, transactionId, fwdp } = result;
            const aadhaarInfo = {
                codeVerifier,
                transactionId,
                fwdp,
            };

            localStorage.setItem("aadhaarInfo", JSON.stringify(aadhaarInfo));
            window.location.href = `/otp-page`;
        } else {
            alert(result.message || "Failed to request OTP. Please try again.");
        }
    } catch (error) {
        console.error("Error requesting OTP:", error);
        alert("An error occurred. Please try again later.");
    } finally {
        // Re-enable the button and reset its text
        requestButton.disabled = false;
        requestButton.textContent = "Request OTP";
      }
}

// Attach event listener to the button
document.getElementById("requestOtpBtn").addEventListener("click", requestOtp);
