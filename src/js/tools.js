// Tools JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initJWTTool();
});

// Navigation functionality
function initNavigation() {
    // Set active navigation link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if ((currentPage === 'tools.html' && href === 'tools.html') ||
            (currentPage === 'index.html' && href === 'index.html') ||
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Initialize JWT tabs
function initJWTTabs() {
    const tabButtons = document.querySelectorAll('.jwt-tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchJWTTab(targetTab);
        });
    });
}

// Initialize JWT tool
function initJWTTool() {
    initJWTTabs();
    initJWTSignatureStatus();
    
    // Initialize default values for JWT encoder
    clearJWTGenerator();
    
    // Initialize JWT subsections to be collapsed
    const jwtSubHeaders = document.querySelectorAll('.jwt-sub-header');
    jwtSubHeaders.forEach(header => {
        const content = header.nextElementSibling;
        if (content && content.classList.contains('widget-content')) {
            content.style.display = 'none';
            header.classList.add('collapsed');
        }
    });
}

// Initialize JWT signature status
function initJWTSignatureStatus() {
    const signatureStatus = document.getElementById('jwt-signature-status');
    if (signatureStatus) {
        signatureStatus.textContent = 'Enter a JWT token to validate';
        signatureStatus.className = 'jwt-signature-status jwt-signature-unknown';
    }
}

// Clear JWT form function
function clearJWTGenerator() {
    document.getElementById('jwt-header').value = '{"alg": "HS256", "typ": "JWT"}';
    document.getElementById('jwt-payload').value = '{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}';
    document.getElementById('jwt-secret').value = 'your-256-bit-secret';
    document.getElementById('jwt-token-output').value = '';
    clearError(document.getElementById('jwt-header'));
}

function clearJWTValidator() {
    document.getElementById('jwt-token-input').value = '';
    document.getElementById('jwt-validate-secret').value = '';
    clearJWTDecodedOutput();
    clearError(document.getElementById('jwt-token-input'));
}

// Base64 Encode Function (called by HTML onclick)
function encodeBase64() {
    const input = document.getElementById('base64-encode-input').value.trim();
    const outputElement = document.getElementById('base64-encode-output');
    
    if (!input) {
        showError(document.getElementById('base64-encode-input'), 'Please enter text to encode');
        return;
    }
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        outputElement.value = encoded;
        clearError(document.getElementById('base64-encode-input'));
    } catch (error) {
        showError(document.getElementById('base64-encode-input'), 'Error encoding text: ' + error.message);
    }
}

// Base64 Decode Function (called by HTML onclick)
function decodeBase64() {
    const input = document.getElementById('base64-decode-input').value.trim();
    const outputElement = document.getElementById('base64-decode-output');
    
    if (!input) {
        showError(document.getElementById('base64-decode-input'), 'Please enter Base64 text to decode');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        outputElement.value = decoded;
        clearError(document.getElementById('base64-decode-input'));
    } catch (error) {
        showError(document.getElementById('base64-decode-input'), 'Invalid Base64 input');
    }
}

// SHA256 Hash Function (called by HTML onclick)
async function generateSHA256() {
    const input = document.getElementById('sha256-input').value.trim();
    const outputElement = document.getElementById('sha256-output');
    
    if (!input) {
        showError(document.getElementById('sha256-input'), 'Please enter text to hash');
        return;
    }
    
    try {
        const hash = await sha256(input);
        outputElement.value = hash;
        clearError(document.getElementById('sha256-input'));
    } catch (error) {
        showError(document.getElementById('sha256-input'), 'Error generating hash: ' + error.message);
    }
}

// URL Encode Function (called by HTML onclick)
function encodeURL() {
    const input = document.getElementById('url-encode-input').value.trim();
    const outputElement = document.getElementById('url-encode-output');
    
    if (!input) {
        showError(document.getElementById('url-encode-input'), 'Please enter text to encode');
        return;
    }
    
    try {
        const encoded = encodeURIComponent(input);
        outputElement.value = encoded;
        clearError(document.getElementById('url-encode-input'));
    } catch (error) {
        showError(document.getElementById('url-encode-input'), 'Error encoding URL: ' + error.message);
    }
}

// URL Decode Function (called by HTML onclick)
function decodeURL() {
    const input = document.getElementById('url-decode-input').value.trim();
    const outputElement = document.getElementById('url-decode-output');
    
    if (!input) {
        showError(document.getElementById('url-decode-input'), 'Please enter URL-encoded text to decode');
        return;
    }
    
    try {
        const decoded = decodeURIComponent(input);
        outputElement.value = decoded;
        clearError(document.getElementById('url-decode-input'));
    } catch (error) {
        showError(document.getElementById('url-decode-input'), 'Invalid URL-encoded input');
    }
}

// Text Case Converter Function (called by HTML onclick)
function convertCase(caseType) {
    const input = document.getElementById('case-input').value;
    const outputElement = document.getElementById('case-output');
    
    if (!input) {
        showError(document.getElementById('case-input'), 'Please enter text to convert');
        return;
    }
    
    let converted = '';
    
    switch (caseType) {
        case 'upper':
            converted = input.toUpperCase();
            break;
        case 'lower':
            converted = input.toLowerCase();
            break;
        case 'title':
            converted = input.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            break;
        case 'sentence':
            converted = input.toLowerCase().replace(/(^\w|\. \w)/g, l => l.toUpperCase());
            break;
        default:
            converted = input;
    }
    
    outputElement.value = converted;
    clearError(document.getElementById('case-input'));
}

// Clear Text Converter Input
function clearTextConverter() {
    document.getElementById('case-input').value = '';
    document.getElementById('case-output').value = '';
    clearError(document.getElementById('case-input'));
}

// Clear Text Converter Output Only
function clearCaseOutput() {
    document.getElementById('case-output').value = '';
}

// JWT Encoder Function
async function encodeJWTToken() {
    const headerText = document.getElementById('jwt-encode-header').value.trim();
    const payloadText = document.getElementById('jwt-encode-payload').value.trim();
    const secret = document.getElementById('jwt-encode-secret').value.trim();
    const output = document.getElementById('jwt-encoded-output');
    
    if (!headerText || !payloadText || !secret) {
        showError(document.getElementById('jwt-encode-header'), 'All fields are required');
        return;
    }
    
    try {
        // Parse JSON inputs
        const headerObj = JSON.parse(headerText);
        const payloadObj = JSON.parse(payloadText);
        
        // Create JWT with proper base64url encoding
        const encodedHeader = base64urlEscape(btoa(JSON.stringify(headerObj)));
        const encodedPayload = base64urlEscape(btoa(JSON.stringify(payloadObj)));
        
        // Create signature using HMAC SHA256
        const message = `${encodedHeader}.${encodedPayload}`;
        const signature = await createHMACSignature(message, secret);
        
        const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
        output.value = jwt;
        
        clearError(document.getElementById('jwt-encode-header'));
    } catch (error) {
        showError(document.getElementById('jwt-encode-header'), 'Invalid JSON format: ' + error.message);
    }
}

// JWT Decoder Function
async function decodeJWTToken() {
    const token = document.getElementById('jwt-decode-input').value.trim();
    const secret = document.getElementById('jwt-decode-secret').value.trim();
    
    if (!token) {
        showError(document.getElementById('jwt-decode-input'), 'Please enter a JWT token');
        return;
    }
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        
        // Decode header and payload with proper base64url decoding
        const header = JSON.parse(atob(base64urlUnescape(parts[0])));
        const payload = JSON.parse(atob(base64urlUnescape(parts[1])));
        
        // Display decoded parts
        document.getElementById('jwt-decoded-header-output').textContent = JSON.stringify(header, null, 2);
        document.getElementById('jwt-decoded-payload-output').textContent = JSON.stringify(payload, null, 2);
        
        // Signature validation (if secret provided)
        const signatureStatus = document.getElementById('jwt-signature-status-output');
        if (secret) {
            try {
                const message = `${parts[0]}.${parts[1]}`;
                const expectedSignature = await createHMACSignature(message, secret);
                
                if (expectedSignature === parts[2]) {
                    signatureStatus.textContent = '✓ Signature Valid';
                    signatureStatus.className = 'jwt-signature-status jwt-signature-valid';
                } else {
                    signatureStatus.textContent = '✗ Signature Invalid';
                    signatureStatus.className = 'jwt-signature-status jwt-signature-invalid';
                }
            } catch (sigError) {
                signatureStatus.textContent = '✗ Signature Verification Failed';
                signatureStatus.className = 'jwt-signature-status jwt-signature-invalid';
            }
        } else {
            signatureStatus.textContent = 'Enter secret key to verify signature';
            signatureStatus.className = 'jwt-signature-status jwt-signature-unknown';
        }
        
        clearError(document.getElementById('jwt-decode-input'));
    } catch (error) {
        showError(document.getElementById('jwt-decode-input'), 'Invalid JWT token: ' + error.message);
        clearJWTDecodedOutput();
    }
}

// Clear functions for JWT Encoder
function clearJWTEncoder() {
    document.getElementById('jwt-encode-header').value = '{"alg": "HS256", "typ": "JWT"}';
    document.getElementById('jwt-encode-payload').value = '{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}';
    document.getElementById('jwt-encode-secret').value = 'your-256-bit-secret';
    document.getElementById('jwt-encoded-output').value = '';
    clearError(document.getElementById('jwt-encode-header'));
}

function clearJWTEncodedOutput() {
    document.getElementById('jwt-encoded-output').value = '';
}

// Clear functions for JWT Decoder
function clearJWTDecoder() {
    document.getElementById('jwt-decode-input').value = '';
    document.getElementById('jwt-decode-secret').value = '';
    clearJWTDecodedOutput();
    clearError(document.getElementById('jwt-decode-input'));
}

function clearJWTDecodedOutput() {
    document.getElementById('jwt-decoded-header-output').textContent = '';
    document.getElementById('jwt-decoded-payload-output').textContent = '';
    const signatureStatus = document.getElementById('jwt-signature-status-output');
    signatureStatus.textContent = 'Enter a JWT token to verify';
    signatureStatus.className = 'jwt-signature-status jwt-signature-unknown';
}

function clearJWTDecodedOutput() {
    document.getElementById('jwt-decoded-header').textContent = '';
    document.getElementById('jwt-decoded-payload').textContent = '';
    const signatureStatus = document.getElementById('jwt-signature-status');
    signatureStatus.textContent = 'Enter a JWT token to validate';
    signatureStatus.className = 'jwt-signature-status jwt-signature-unknown';
}

// Copy to Clipboard Function (called by HTML onclick)
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value;
    
    if (!text) {
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        // Find the copy button related to this element
        const copyButton = element.parentNode.querySelector('.tool-button-secondary');
        if (copyButton) {
            const originalText = copyButton.textContent;
            copyButton.style.background = '#28a745';
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copy-success');
            
            setTimeout(() => {
                copyButton.style.background = '';
                copyButton.textContent = originalText;
                copyButton.classList.remove('copy-success');
            }, 1500);
        }
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const copyButton = element.parentNode.querySelector('.tool-button-secondary');
            if (copyButton) {
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = originalText;
                }, 1500);
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textArea);
    });
}

// Utility Functions
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function showError(element, message) {
    element.classList.add('tool-error');
    
    // Remove existing error message
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        clearError(element);
    }, 3000);
}

function clearError(element) {
    element.classList.remove('tool-error');
    const errorMessage = element.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Utility Functions
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalBg = button.style.background;
        const originalText = button.textContent;
        
        button.style.background = '#28a745';
        button.textContent = 'Copied!';
        button.classList.add('copy-success');
        
        setTimeout(() => {
            button.style.background = originalBg;
            button.textContent = originalText;
            button.classList.remove('copy-success');
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = 'Copy';
            }, 1500);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textArea);
    });
}

function showError(element, message) {
    element.classList.add('tool-error');
    
    // Remove existing error message
    const existingError = element.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    element.parentNode.appendChild(errorDiv);
    
    // Remove error after 3 seconds
    setTimeout(() => {
        clearError(element);
    }, 3000);
}

function clearError(element) {
    element.classList.remove('tool-error');
    const errorMessage = element.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});