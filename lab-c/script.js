navigator.geolocation.getCurrentPosition(() => {}, () => {});

if ('Notification' in window) {
    Notification.requestPermission();
}

const map = L.map('map').setView([52.2297, 21.0122], 13);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
}).addTo(map);

let marker;
document.getElementById('locationBtn').addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        console.log(`Współrzędne: ${latitude}, ${longitude}`);
        if (marker) map.removeLayer(marker);
        marker = L.marker([latitude, longitude]).addTo(map);
        map.setView([latitude, longitude], 13);
    }, err => {
        if (err.code === 1) {
            alert('Odmówiono dostępu do lokalizacji. Aby korzystać z tej funkcji, zezwól na dostęp do lokalizacji w ustawieniach przeglądarki.');
        } else {
            alert('Błąd podczas pobierania lokalizacji: ' + err.message);
        }
    }); // if else dadało AI
});

document.getElementById('downloadBtn').addEventListener('click', () => {
    leafletImage(map, function(err, canvas) {
        divideAndShuffle(canvas);
    });
});

function divideAndShuffle(canvas) {
    const piecesContainer = document.getElementById('puzzlePieces');
    piecesContainer.innerHTML = '';
    const board = document.getElementById('puzzleBoard');
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {  // pętle dla 16-siatki pisało AI
            const spot = document.createElement('div');
            spot.className = 'puzzle-spot';
            spot.style.left = `${j * 100}px`;
            spot.style.top = `${i * 100}px`;
            spot.dataset.row = i;
            spot.dataset.col = j;
            board.appendChild(spot);
        }
    }
    const pieces = [];
    const size = 100;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = size;
            pieceCanvas.height = size;
            const ctx = pieceCanvas.getContext('2d');
            ctx.drawImage(canvas, j * size, i * size, size, size, 0, 0, size, size);
            pieceCanvas.draggable = true;
            pieceCanvas.dataset.id = `${i}-${j}`;
            pieces.push(pieceCanvas);
        }
    }
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => {
        piece.style.left = `${Math.random() * 300}px`;
        piece.style.top = `${Math.random() * 300}px`;
        piece.addEventListener('dragstart', e => e.dataTransfer.setData('text', piece.dataset.id));
        piecesContainer.appendChild(piece);
    });
    // Drop na planszy trochę pomagał Copilot
    board.addEventListener('dragover', e => e.preventDefault());
    board.addEventListener('drop', e => {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const piece = document.querySelector(`[data-id="${id}"]`);
        let spot = e.target.closest('.puzzle-spot');
        if (!spot) {
            const rect = board.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const col = Math.round(x / 100);
            const row = Math.round(y / 100);
            spot = board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        }
        if (spot) {
            const existingPiece = spot.querySelector('canvas');
            if (existingPiece) {
                piecesContainer.appendChild(existingPiece);
                existingPiece.style.left = `${Math.random() * 300}px`;
                existingPiece.style.top = `${Math.random() * 300}px`;
            }
            spot.appendChild(piece);
            piece.style.left = '0px';
            piece.style.top = '0px';
            piece.style.position = 'relative';
        }
        checkCompletion();
    });
}

function checkCompletion() {
    const board = document.getElementById('puzzleBoard');
    const spots = board.querySelectorAll('.puzzle-spot');
    let complete = true;
    spots.forEach(spot => {
        const piece = spot.querySelector('canvas');
        if (!piece || piece.dataset.id !== `${spot.dataset.row}-${spot.dataset.col}`) {
            complete = false;
        }
    });
    if (complete) {
        if (!board.querySelector('.completion-message')) {
            const message = document.createElement('div');
            message.className = 'completion-message';
            message.textContent = 'Udało ci się ułożyć puzzle!';
            board.appendChild(message);
        }
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Gratulacje! Układanka ukończona!');
        }
    }
}
