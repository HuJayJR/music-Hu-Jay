const button = document.getElementById('mainButton');
const popup = document.getElementById('popup');
const closeBtn = document.getElementById('closePopup');

button.addEventListener('click', () => {
  popup.style.display = 'flex';
  popup.classList.add('active');
  setTimeout(() => {
      window.location.href = 'https://discord.gg/4nyPNqhz8b';
  }, 3000);
});
