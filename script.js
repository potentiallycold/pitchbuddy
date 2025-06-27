
const auth = firebase.auth();
const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const app = document.getElementById("app");

// Handle auth state
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("userEmail").innerText = user.email;
    document.getElementById("signInBtn").classList.add("hidden");
    document.getElementById("signOutBtn").classList.remove("hidden");
    app.classList.remove("hidden");
  } else {
    document.getElementById("userEmail").innerText = "";
    document.getElementById("signInBtn").classList.remove("hidden");
    document.getElementById("signOutBtn").classList.add("hidden");
    app.classList.add("hidden");
  }
});

function signIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  auth.signInWithPopup(provider).catch(error => alert(error.message));
}

function signOut() {
  auth.signOut().catch(error => alert(error.message));
}

document.getElementById("darkToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function getAIResponse() {
  const ai = document.getElementById("aiEngine").value;
  const input = userInput.value.trim();
  if (!input) return;

  chatBox.innerHTML += `<p><strong>You:</strong> ${input}</p>`;
  userInput.value = "";

  if (ai.includes("ChatGPT")) {
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: input }]
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("ChatGPT Response:", data);
      const reply = data.choices?.[0]?.message?.content || "No response.";
      chatBox.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
    })
    .catch(err => {
      console.error("ChatGPT Error:", err);
      chatBox.innerHTML += `<p><strong>AI:</strong> Error: ${err.message}</p>`;
    });

  } else if (ai.includes("Gemini")) {
    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCRAiKtiZ9ugx3TpBFDTDmqkFltpU6YumE", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input }] }]
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Gemini Response:", data);
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
      chatBox.innerHTML += `<p><strong>AI:</strong> ${reply}</p>`;
    })
    .catch(err => {
      console.error("Gemini Error:", err);
      chatBox.innerHTML += `<p><strong>AI:</strong> Error: ${err.message}</p>`;
    });

  } else {
    chatBox.innerHTML += `<p><strong>AI:</strong> Microsoft Copilot support coming soon.</p>`;
  }
}
