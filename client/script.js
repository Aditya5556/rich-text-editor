// Event listener for WebSocket connection open
ws.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

// Event listener for WebSocket messages
ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'highlight') {
        applyHighlight(data.start, data.end);
    }
});

// Event listener for WebSocket connection close
ws.addEventListener('close', () => {
    console.log('Disconnected from WebSocket server');
});

// Function to send highlighted text to the server
function sendHighlight(start, end) {
    const highlightData = { type: 'highlight', start, end };
    ws.send(JSON.stringify(highlightData));
}

// Function to apply highlight to the editor
function applyHighlight(start, end) {
    // Apply highlight to the editor from start to end
}
 // Add event listener for the "Join" button
 document.getElementById('join-btn').addEventListener('click', function() {
    const username = document.getElementById('username-input').value;
    if (username.trim() !== '') {
        // Send the username to the server via WebSocket
        ws.send(JSON.stringify({ type: 'join', username }));
    } else {
        alert('Please enter a username.');
    }
});
// Wait for Monaco Editor to be loaded
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
            value: "", // Initial value of the editor
            language: "plaintext", // Set the language to plaintext for now
            theme: "vs-dark", // Set the theme
            automaticLayout: true // Automatically adjust the editor layout
        });

        // Function to update cursor position indicator
        function updateCursorPosition(cursorPosition) {
            // Remove existing cursor indicator
            const existingCursorIndicator = document.querySelector('.cursor-indicator');
            if (existingCursorIndicator) {
                existingCursorIndicator.remove();
            }
            // Create new cursor indicator
            const cursorIndicator = document.createElement('div');
            cursorIndicator.classList.add('cursor-indicator');
            cursorIndicator.style.top = `${cursorPosition.lineNumber * 18}px`; // Adjust height as needed
            cursorIndicator.style.left = `${cursorPosition.column * 8}px`; // Adjust width as needed
            editorContainer.appendChild(cursorIndicator);
        }
    }
});
