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
  
    // Room updates
    socket.on('roomUpdated', (data) => {
      const { users, reveal } = data;
      const usersList = document.getElementById('usersList');
      usersList.innerHTML = '';
  
      Object.values(users).forEach((user) => {
        const li = document.createElement('li');
        li.textContent = reveal
          ? `${user.name}: ${user.estimate !== null ? user.estimate : '?'}`
          : `${user.name}: ${user.estimate !== null ? 'Selected' : 'No selection'}`;
        usersList.appendChild(li);
      });
    });
  });
  