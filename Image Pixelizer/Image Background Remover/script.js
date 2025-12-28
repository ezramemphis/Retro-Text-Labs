const fileInput = document.getElementById('fileInput');
const removeBtn = document.getElementById('removeBtn');
const preview = document.getElementById('preview');
const downloadBtn = document.getElementById('downloadBtn');

// Replace with your remove.bg API key
const API_KEY = 'YOUR_API_KEY_HERE';

removeBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Select a file first");

  preview.innerHTML = "<p>Processing...</p>";

  // Only process images for now
  if (file.type.startsWith('image/')) {
    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      preview.innerHTML = "<p>Error removing background</p>";
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    preview.innerHTML = `<img src="${url}" alt="Result">`;

    downloadBtn.style.display = "inline-block";
    downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "no-background.png";
      a.click();
    };
  } else {
    preview.innerHTML = "<p>Video background removal not supported yet.</p>";
  }
});
