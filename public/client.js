document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  const urlParams = new URLSearchParams(window.location.search);
  const roomCode = urlParams.get('roomCode');
  const userName = urlParams.get('userName');

  // Show the correct room code
  document.getElementById('roomHeader').textContent = `Room Code: ${roomCode}`;

  // Join the room
  socket.emit('joinRoom', { roomCode, userName }, (response) => {
    if (response.error) {
      alert(response.error);
      window.location.href = '/';
    }
  });

  // Card selection
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

    // Clear the container
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = '';

    // Prepare to compute min, max, average if reveal is true
    let estimates = [];
    for (let socketId in users) {
      const { estimate } = users[socketId];
      if (estimate !== null) {
        estimates.push(estimate);
      }
    }

    let minEstimate = null;
    let maxEstimate = null;
    let avg = null;

    if (reveal && estimates.length > 0) {
      minEstimate = Math.min(...estimates);
      maxEstimate = Math.max(...estimates);
      const sum = estimates.reduce((acc, val) => acc + val, 0);
      avg = (sum / estimates.length).toFixed(2); // 2 decimals
    }

    // Update the UI for each user
    Object.values(users).forEach((user) => {
      const tile = document.createElement('div');
      tile.classList.add('user-tile');

      // Title with user name
      const nameEl = document.createElement('h3');
      nameEl.textContent = user.name;
      tile.appendChild(nameEl);

      // The guess area
      const guessEl = document.createElement('div');
      guessEl.classList.add('user-guess');

      if (user.estimate === null) {
        // No selection yet
        guessEl.textContent = reveal ? '?' : '—';
      } else {
        // If revealed, show actual number; else show '?'
        guessEl.textContent = reveal ? user.estimate : '?';
      }

      tile.appendChild(guessEl);

      // If reveal is true, highlight min/max
      // (If user.estimate===null, skip highlighting.)
      if (reveal && user.estimate !== null) {
        if (user.estimate === minEstimate) {
          tile.classList.add('lowest'); 
        }
        if (user.estimate === maxEstimate) {
          tile.classList.add('highest');
        }
      }

      usersContainer.appendChild(tile);
    });

    // Display average if we have at least one user with a selection
    const resultsDiv = document.getElementById('results');
    if (reveal && estimates.length > 0) {
      resultsDiv.textContent = `Average: ${avg}`;
    } else {
      // Clear it on reset or if not revealed
      resultsDiv.textContent = '';
    }

    // If all estimates are the same (min === max) and we actually have at least one estimate
    if (reveal && estimates.length > 0 && minEstimate === maxEstimate) {
      // Launch fireworks (confetti)
      launchConfetti();
    }
  });
});

/**
 * Launch a burst of confetti.
 * canvas-confetti is loaded from the <script> in room.html
 */
function launchConfetti() {
  // For a quick “burst”:
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 }
  });
}
