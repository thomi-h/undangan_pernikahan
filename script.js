document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get("to");

  if (guestName) {
    const guestNameElement = document.getElementById("guest-name");
    if (guestNameElement) {
      guestNameElement.textContent = decodeURIComponent(
        guestName.replace(/\+/g, " ")
      );
    }
  }

  // --- KONFIGURASI ---
  const music = document.getElementById("music");
  const playButton = document.querySelector(".ytp-play-button");
  const animationElement = document.getElementById("animation");
  const bukaUndanganBtn = document.getElementById("open-invitation");
  const landingSection = document.querySelector(".landing");

  // Path SVG untuk animasi
  const pausePath =
    "M11,10 L18,13.74 18,22.28 11,26 M18,13.74 L26,18 26,18 18,22.28";
  const playPath = "M11,10 L17,10 17,26 11,26 M20,10 L26,10 26,26 20,26";

  // --- FUNGSI UPDATE IKON ---
  // Fungsi ini dipanggil untuk mengubah bentuk ikon (Play <-> Pause)
  function updateIcon(isPlaying) {
    if (!animationElement) return;

    // Jika isPlaying = true, ubah ke ikon Pause (karena lagu jalan)
    // Jika isPlaying = false, ubah ke ikon Play (karena lagu mati)
    animationElement.setAttribute("from", isPlaying ? playPath : pausePath);
    animationElement.setAttribute("to", isPlaying ? pausePath : playPath);
    animationElement.beginElement();
  }

  // --- EVENT 1: TOMBOL BUKA UNDANGAN ---
  if (bukaUndanganBtn) {
    bukaUndanganBtn.addEventListener("click", () => {
      // 1. Animasi CSS Undangan
      landingSection.classList.add("animation-rollup");

      // 2. Mainkan Musik
      music.play();

      // 3. Hilangkan Landing Page setelah animasi selesai
      setTimeout(() => {
        landingSection.style.display = "none";
      }, 800);
    });
  }

  // --- EVENT 2: TOMBOL KONTROL MUSIK (Play/Pause) ---
  if (playButton) {
    playButton.addEventListener("click", function () {
      if (music.paused) {
        music.play();
        updateIcon(false); // Ubah jadi ikon Pause
      } else {
        music.pause();
        updateIcon(true); // Ubah jadi ikon Play
      }
    });
  }

  // 1. Define the Observer FIRST (so it exists when we need it)
  const observer = new IntersectionObserver((entries) => {
    // Filter for only intersecting elements
    const intersectingEntries = entries.filter((e) => e.isIntersecting);

    intersectingEntries.forEach((entry) => {
      // Show the element
      entry.target.classList.add("show");

      // Stop observing
      observer.unobserve(entry.target);
    });
  });

  // 3. Select ALL elements at once and observe them
  const allElements = document.querySelectorAll(
    "#dalil h2, #dalil .dalil, #dalil .sambutan, #profile .profile-text, .countdown h2, .countdown .countdown-timer, .lokasi h2, .lokasi .tempat, .form h2, .form #wishes-form, .wishes h2, .wishes #wishes-list, .end h2"
  );

  allElements.forEach((el) => {
    el.classList.add("hidden"); // Initial state
    observer.observe(el); // Start watching
  });
});

const targetDate = new Date("2025 12 28 08:00:00").getTime();

const timer = setInterval(() => {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerText =
    minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerText =
    seconds < 10 ? "0" + seconds : seconds;

  if (distance < 0) {
    clearInterval(timer);
    document.querySelector(
      ".countdown-timer"
    )[0].innerHTML = `<h2>Happy Wedding Day!</h2>`;
  }
}, 1000);

const addToGoogleCalendar = () => {
  const startDate = "20251228T080000";
  const endDate = "20251228T150000";

  const title = "Akad Nikah & Resepsi Pernikahan Aulia & Thomi";
  const details = "Jangan lupa hadir di acara pernikahan kami!";
  const location =
    "Aula Pasar Bunga Rawa Belong, Jl. Sulaiman No. 10, Sukabumi Utara, Kebon Jeruk";

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title
  )}&dates=${startDate}/${endDate}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent(location)}`;

  window.open(calendarUrl, "_blank");
};

document
  .getElementById("add-to-calendar")
  .addEventListener("click", addToGoogleCalendar);

document.getElementById("guest").style.display = "none";
const inputTamu = document.querySelector("select[name='guest']");

const kehadiranButton = document.querySelectorAll("input[name='kehadiran']");
const radioHadir = document.getElementById("attend");
const radioTidakHadir = document.getElementById("not-attend");

function toggleGuestInput() {
  if (radioHadir.checked) {
    document.getElementById("guest").style.display = "grid";
    inputTamu.required = true;
    if (inputTamu.value === "0") {
      inputTamu.value = "1";
    }
  } else {
    document.getElementById("guest").style.display = "none";
    inputTamu.required = false;
    inputTamu.value = "0";
  }
}
kehadiranButton.forEach((button) =>
  button.addEventListener("change", (e) => {
    toggleGuestInput();
  })
);

toggleGuestInput();

const scriptURL =
  "https://script.google.com/macros/s/AKfycbzwCMzSAHDem4qERjsD7I_lcdGggfO6wTVSjlwRctqDAUheEjyj4t3DeC6OZsFZVaWu/exec";

const form = document.forms["wishes-form"];
const submitButton = document.getElementById("btnSubmit");
const statusMessage = document.getElementById("status-message");

statusMessage.style.display = "none";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.innerText = "Mengirim...";
  statusMessage.style.display = "none";

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      submitButton.disabled = false;
      submitButton.innerText = "Kirim";

      statusMessage.style.display = "block";
      statusMessage.innerText = "Terima kasih atas ucapan dan do'a terbaiknya!";
      statusMessage.style.color = "white";

      form.reset();
    })
    .catch((error) => {
      submitButton.disabled = false;
      submitButton.innerText = "Kirim";

      statusMessage.style.display = "block";
      statusMessage.innerText = "Terjadi kesalahan. Silakan coba lagi.";
      statusMessage.style.color = "red";
    });

  const newUcapan = document.createElement("div");
  newUcapan.classList.add("wish-item");
  newUcapan.innerHTML = `
    <p class="wish-name">${form.name.value}</p>
    <p class="wish-message">${form.message.value}</p>
  `;

  const wishesList = document.getElementById("wishes-list");
  wishesList.insertBefore(newUcapan, wishesList.firstChild);
});

async function loadUcapan() {
  const container = document.getElementById("wishes-list");

  container.innerHTML = "<p>Memuat ucapan...</p>";

  try {
    const response = await fetch(scriptURL);
    const resultJson = await response.json();

    if (resultJson && resultJson.result === "success") {
      const data = resultJson.data;
      let htmlContent = "";

      if (data.length === 0) {
        htmlContent = "<p>Belum ada ucapan yang dikirim.</p>";
      }

      data.forEach((item) => {
        htmlContent += `
          <div class="wish-item">
          <p class="wish-name">${item.nama}</p>
          <p class="wish-message">${item.ucapan}</p>
          </div>`;
      });

      container.innerHTML = htmlContent;
    } else {
      throw new Error(resultJson.error || "Failed to load wishes");
    }
  } catch (error) {
    console.error("Error loading wishes:", error);
    container.innerHTML =
      "<p>Gagal memuat ucapan. Silakan coba lagi nanti.</p>";
  }
}

window.addEventListener("load", loadUcapan);
