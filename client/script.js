// EL for WebSocket connection open
ws.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

// EL for WebSocket messages
ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'highlight') {
        applyHighlight(data.start, data.end);
    }
});

// EL for WebSocket connection close
ws.addEventListener('close', () => {
    console.log('Disconnected from WebSocket server');
});

//  send highlighted text to the server
function sendHighlight(start, end) {
    const highlightData = { type: 'highlight', start, end };
    ws.send(JSON.stringify(highlightData));
}

function applyHighlight(start, end) {
   
}
 // EL for the "Join" button
 document.getElementById('join-btn').addEventListener('click', function() {
    const username = document.getElementById('username-input').value;
    if (username.trim() !== '') {
        // Send the username to the server via WebSocket
        ws.send(JSON.stringify({ type: 'join', username }));
    } else {
        alert('Please enter a username.');
    }
});

require.config({
    paths: {
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@latest/min/vs'
    }
});

require(['vs/editor/editor.main'], function () {
    const editorContainer = document.getElementById("editorContainer");
    if (!editorContainer) {
        console.error("Editor container not found.");
    } else {
        const editor = monaco.editor.create(editorContainer, {
            value: "", 
            language: "plaintext", 
            theme: "vs-dark", 
            automaticLayout: true 
        });

   
        function updateCursorPosition(cursorPosition) {
          
            const existingCursorIndicator = document.querySelector('.cursor-indicator');
            if (existingCursorIndicator) {
                existingCursorIndicator.remove();
            }
          
            const cursorIndicator = document.createElement('div');
            cursorIndicator.classList.add('cursor-indicator');
            cursorIndicator.style.top = `${cursorPosition.lineNumber * 18}px`; 
            cursorIndicator.style.left = `${cursorPosition.column * 8}px`;
            editorContainer.appendChild(cursorIndicator);
        }
    }
});
