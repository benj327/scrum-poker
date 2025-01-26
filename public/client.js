document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get('roomCode');
  const userName = urlParams.get('userName');

  document.getElementById('roomHeader').textContent = `Room Code: ${roomCode}`;

  // Join the room
  socket.emit('joinRoom', { roomCode, userName }, (response) => {
    if (response.error) {
      alert(response.error);
      window.location.href = '/';
    }
  });

  // Handle card selection
  document.querySelectorAll('.card-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const estimateValue = parseInt(btn.getAttribute('data-value'), 10);
      socket.emit('estimate', { roomCode, estimate: estimateValue });
    });
  });

  // Reveal / Reset
  document.getElementById('revealBtn').addEventListener('click', () => {
    socket.emit('reveal', roomCode);
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    socket.emit('reset', roomCode);
  });

  // Listen for updates
  socket.on('roomUpdated', (data) => {
    const { users, reveal } = data;
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = ''; // Clear existing tiles

    Object.values(users).forEach((user) => {
      // Create a tile
      const tile = document.createElement('div');
      tile.classList.add('user-tile');

      // Create an element for the user name
      const nameEl = document.createElement('h3');
      nameEl.textContent = user.name;
      tile.appendChild(nameEl);

      // Create an element for the user's guess
      const guessEl = document.createElement('div');
      guessEl.classList.add('user-guess');

      // Decide what to show:
      // 1) If user has not selected an estimate (estimate is null), show "—" or "No selection"
      // 2) If user selected but reveal=false, show "?"
      // 3) If reveal=true, show the actual estimate or "?" if it's somehow still null
      if (user.estimate === null) {
        guessEl.textContent = reveal ? "?" : "—";
      } else {
        guessEl.textContent = reveal ? user.estimate : "?";
      }

      tile.appendChild(guessEl);

      // Append tile to container
      usersContainer.appendChild(tile);
    });
  });
});
