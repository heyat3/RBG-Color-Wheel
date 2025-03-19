// Create color wheel
// Create 24 petals
const numPetals = 24;
const centerX = 250;
const centerY = 250;
const innerRadius = 0; // Changed to 0 so all points meet at center
const outerRadius = 180;

// Calculate petal dimensions for perfect rhombus
const angleStep = (Math.PI * 2) / numPetals;

// Create petals
const petalsGroup = document.getElementById('petals');

for (let i = 0; i < numPetals; i++) {
    // Calculate angle for this petal
    const angle = i * angleStep;
    
    // Calculate colors to match reference image more closely
    let hue, saturation, lightness;
    
    // Adjust hue distribution to match reference image
    // Reference image has more emphasis on red-orange-yellow-green regions
    // and blue-purple regions with fewer cyans
    hue = i * (360 / numPetals);
    
    // Adjust saturation and lightness based on color region
    if (hue >= 0 && hue < 60) { 
        // Reds to oranges - vibrant in reference image
        saturation = 100;
        lightness = 65;
    } else if (hue >= 60 && hue < 120) {
        // Yellows to greens - bright in reference image
        saturation = 95;
        lightness = 68;
    } else if (hue >= 120 && hue < 180) {
        // Greens to cyans
        saturation = 90;
        lightness = 65;
    } else if (hue >= 180 && hue < 240) {
        // Cyans to blues - more saturated in reference image
        saturation = 100;
        lightness = 60;
    } else if (hue >= 240 && hue < 300) {
        // Blues to magentas - deep and rich in reference image
        saturation = 95;
        lightness = 60;
    } else {
        // Magentas to reds - vibrant in reference image
        saturation = 100;
        lightness = 62;
    }
    
    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
    
    // Calculate points for rhombus
    // Inner point (center-facing)
    const innerX = centerX; // All meet at exact center
    const innerY = centerY; // All meet at exact center
    
    // Outer point (away from center)
    const outerX = centerX + outerRadius * Math.cos(angle);
    const outerY = centerY + outerRadius * Math.sin(angle);
    
    // Side points (perpendicular to radius)
    const perpAngle = angle + Math.PI / 2;
    const sideLength = 50; // Controls width of the rhombus
    
    // Calculate midpoint between inner and outer points
    const midX = (innerX + outerX) / 2;
    const midY = (innerY + outerY) / 2;
    
    // Calculate side points using perpendicular direction
    const rightX = midX + sideLength * Math.cos(perpAngle);
    const rightY = midY + sideLength * Math.sin(perpAngle);
    const leftX = midX - sideLength * Math.cos(perpAngle);
    const leftY = midY - sideLength * Math.sin(perpAngle);
    
    // Create rhombus path
    const rhombus = document.createElementNS("http://www.w3.org/2000/svg", "path");
    rhombus.setAttribute("d", `M ${innerX} ${innerY} L ${rightX} ${rightY} L ${outerX} ${outerY} L ${leftX} ${leftY} Z`);
    rhombus.setAttribute("fill", color);
    // Removed stroke attribute to eliminate white outlines
    
    // Add rhombus to the petals group
    petalsGroup.appendChild(rhombus);
}

// Add the white diamond markers
// Red region diamond
const redMarker = document.createElementNS("http://www.w3.org/2000/svg", "path");
redMarker.setAttribute("d", "M 175,180 L 205,150 L 235,180 L 205,210 Z");
redMarker.setAttribute("fill", "none");
redMarker.setAttribute("stroke", "white");
redMarker.setAttribute("stroke-width", "3");
document.querySelector("svg").appendChild(redMarker);

// Green region diamond
const greenMarker = document.createElementNS("http://www.w3.org/2000/svg", "path");
greenMarker.setAttribute("d", "M 325,180 L 355,150 L 385,180 L 355,210 Z");
greenMarker.setAttribute("fill", "none");
greenMarker.setAttribute("stroke", "white");
greenMarker.setAttribute("stroke-width", "3");
document.querySelector("svg").appendChild(greenMarker);

// Blue region diamond
const blueMarker = document.createElementNS("http://www.w3.org/2000/svg", "path");
blueMarker.setAttribute("d", "M 175,320 L 205,290 L 235,320 L 205,350 Z");
blueMarker.setAttribute("fill", "none");
blueMarker.setAttribute("stroke", "white");
blueMarker.setAttribute("stroke-width", "3");
document.querySelector("svg").appendChild(blueMarker);

// Color picker functionality
// DOM elements
const redInput = document.getElementById('redValue');
const greenInput = document.getElementById('greenValue');
const blueInput = document.getElementById('blueValue');
const alphaInput = document.getElementById('alphaValue');
const redSlider = document.getElementById('redSlider');
const greenSlider = document.getElementById('greenSlider');
const blueSlider = document.getElementById('blueSlider');
const alphaSlider = document.getElementById('alphaSlider');
const colorPreview = document.getElementById('colorPreview');
const redTooltip = document.getElementById('redTooltip');
const greenTooltip = document.getElementById('greenTooltip');
const blueTooltip = document.getElementById('blueTooltip');
const alphaTooltip = document.getElementById('alphaTooltip');
const valueDisplay = document.getElementById('valueDisplay');

// Display elements
const brightnessValue = document.getElementById('brightnessValue');
const luminosityValue = document.getElementById('luminosityValue');
const hslValue = document.getElementById('hslValue');
const hexValue = document.getElementById('hexValue');

// Format elements
const rgbFormat = document.getElementById('rgbFormat');
const rgbaFormat = document.getElementById('rgbaFormat');
const hexFormat = document.getElementById('hexFormat');
const hslFormat = document.getElementById('hslFormat');

// Calculate brightness (HSV Value)
function calculateBrightness(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    return Math.round(max * 100);
}

// Calculate luminosity (perceptual brightness) using the more accurate formula
function calculateLuminosity(r, g, b) {
    // Using the formula: 0.2126*R + 0.7152*G + 0.0722*B
    // This is based on human perception of brightness
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return Math.round(luminance * 100);
}

// RGB to HSL conversion
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        
        h /= 6;
    }
    
    return [
        Math.round(h * 360), 
        Math.round(s * 100), 
        Math.round(l * 100)
    ];
}

// RGB to Hex conversion
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Update all display values
function updateDisplayValues(r, g, b, a) {
    // Calculate brightness
    const brightness = calculateBrightness(r, g, b);
    brightnessValue.textContent = `${brightness}%`;
    
    // Calculate luminosity
    const luminosity = calculateLuminosity(r, g, b);
    luminosityValue.textContent = `${luminosity}%`;
    
    // Calculate HSL
    const [h, s, l] = rgbToHsl(r, g, b);
    hslValue.textContent = `${h}°, ${s}%, ${l}%`;
    
    // Calculate Hex
    const hex = rgbToHex(r, g, b);
    hexValue.textContent = hex;
    
    // Update format values
    rgbFormat.textContent = `rgb(${r}, ${g}, ${b})`;
    rgbaFormat.textContent = `rgba(${r}, ${g}, ${b}, ${a/100})`;
    hexFormat.textContent = hex;
    hslFormat.textContent = `hsl(${h}, ${s}%, ${l}%)`;
}

// Update color
function updateColor() {
    const red = parseInt(redInput.value) || 0;
    const green = parseInt(greenInput.value) || 0;
    const blue = parseInt(blueInput.value) || 0;
    const alpha = parseInt(alphaInput.value) || 0;
    
    colorPreview.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${alpha/100})`;
    
    // Update all display values
    updateDisplayValues(red, green, blue, alpha);
}

function updateFromSlider(slider, input, tooltip) {
    input.value = slider.value;
    tooltip.textContent = slider.value;
    updateColor();
}

function updateFromInput(input, slider, tooltip) {
    let max = 255;
    if (input === alphaInput) max = 100;
    
    let value = parseInt(input.value) || 0;
    value = Math.max(0, Math.min(max, value));
    input.value = value;
    slider.value = value;
    tooltip.textContent = value;
    updateColor();
}

function positionTooltip(e, tooltip, slider) {
    const rect = e.target.getBoundingClientRect();
    
    // Update tooltip content to show current slider value
    tooltip.textContent = slider.value;
    
    // Position tooltip
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.opacity = '1';
}

// Event listeners for sliders
redSlider.addEventListener('input', () => {
    updateFromSlider(redSlider, redInput, redTooltip);
});

greenSlider.addEventListener('input', () => {
    updateFromSlider(greenSlider, greenInput, greenTooltip);
});

blueSlider.addEventListener('input', () => {
    updateFromSlider(blueSlider, blueInput, blueTooltip);
});

alphaSlider.addEventListener('input', () => {
    updateFromSlider(alphaSlider, alphaInput, alphaTooltip);
});

// Event listeners for text inputs
redInput.addEventListener('input', () => {
    updateFromInput(redInput, redSlider, redTooltip);
});

greenInput.addEventListener('input', () => {
    updateFromInput(greenInput, greenSlider, greenTooltip);
});

blueInput.addEventListener('input', () => {
    updateFromInput(blueInput, blueSlider, blueTooltip);
});

alphaInput.addEventListener('input', () => {
    updateFromInput(alphaInput, alphaSlider, alphaTooltip);
});

// Tooltip events
function setupTooltip(slider, tooltip) {
    slider.addEventListener('mousemove', (e) => {
        positionTooltip(e, tooltip, slider);
    });
    
    slider.addEventListener('mouseenter', (e) => {
        // Show tooltip immediately on hover
        positionTooltip(e, tooltip, slider);
    });
    
    slider.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
    
    slider.addEventListener('focus', () => {
        valueDisplay.textContent = slider.value;
    });
}

setupTooltip(redSlider, redTooltip);
setupTooltip(greenSlider, greenTooltip);
setupTooltip(blueSlider, blueTooltip);
setupTooltip(alphaSlider, alphaTooltip);

// Make format values clickable to copy
document.querySelectorAll('.format-value').forEach(element => {
    element.addEventListener('click', function() {
        const text = this.textContent;
        navigator.clipboard.writeText(text).then(
            function() {
                // Temporarily change text to indicate copying
                const originalText = element.textContent;
                element.textContent = 'Copied!';
                setTimeout(() => {
                    element.textContent = originalText;
                }, 1000);
            }
        );
    });
});

// Add Eyedropper functionality
function addEyedropperTool() {
    // Create eyedropper button
    const controlsContainer = document.querySelector('.rgb-controls');
    const eyedropperContainer = document.createElement('div');
    eyedropperContainer.className = 'eyedropper-container';
    eyedropperContainer.style.display = 'flex';
    eyedropperContainer.style.alignItems = 'center';
    eyedropperContainer.style.marginTop = '10px';
    eyedropperContainer.style.justifyContent = 'center';
    
    const eyedropperButton = document.createElement('button');
    eyedropperButton.id = 'eyedropperButton';
    eyedropperButton.innerText = '🔍 Pick Color from Screen';
    eyedropperButton.style.padding = '10px 15px';
    eyedropperButton.style.backgroundColor = '#333';
    eyedropperButton.style.color = 'white';
    eyedropperButton.style.border = 'none';
    eyedropperButton.style.borderRadius = '4px';
    eyedropperButton.style.cursor = 'pointer';
    eyedropperButton.style.display = 'flex';
    eyedropperButton.style.alignItems = 'center';
    eyedropperButton.style.gap = '5px';
    eyedropperButton.style.fontSize = '14px';
    
    eyedropperContainer.appendChild(eyedropperButton);
    controlsContainer.after(eyedropperContainer);
    
    // Check if EyeDropper API is supported
    if ('EyeDropper' in window) {
        eyedropperButton.addEventListener('click', async () => {
            try {
                const eyeDropper = new EyeDropper();
                const result = await eyeDropper.open();
                const color = result.sRGBHex;
                
                // Convert hex to RGB
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                
                // Update color inputs and sliders
                redInput.value = r;
                greenInput.value = g;
                blueInput.value = b;
                redSlider.value = r;
                greenSlider.value = g;
                blueSlider.value = b;
                
                // Update color preview
                updateColor();
                
            } catch (error) {
                console.log('EyeDropper error:', error);
                // User canceled or error occurred
            }
        });
    } else {
        // EyeDropper API not supported
        eyedropperButton.innerText = '🔍 Eyedropper (Not Supported)';
        eyedropperButton.style.backgroundColor = '#888';
        eyedropperButton.style.cursor = 'not-allowed';
        
        // Add a tooltip explaining the limitation
        eyedropperButton.title = 'The EyeDropper API is not supported in this browser. Please use Chrome, Edge, or another Chromium-based browser.';
    }
}

// Add browser compatibility warning if needed
function addBrowserWarning() {
    if (!('EyeDropper' in window)) {
        const container = document.querySelector('.container');
        const warning = document.createElement('div');
        warning.style.position = 'fixed';
        warning.style.bottom = '20px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.backgroundColor = 'rgba(255, 193, 7, 0.9)';
        warning.style.color = '#333';
        warning.style.padding = '10px 20px';
        warning.style.borderRadius = '4px';
        warning.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        warning.style.zIndex = '1000';
        warning.style.textAlign = 'center';
        warning.style.maxWidth = '90%';
        warning.innerHTML = '<strong>Note:</strong> The eyedropper tool requires Chrome, Edge, or another Chromium-based browser to work.';
        
        const closeButton = document.createElement('button');
        closeButton.innerText = '×';
        closeButton.style.marginLeft = '10px';
        closeButton.style.border = 'none';
        closeButton.style.background = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '18px';
        closeButton.style.verticalAlign = 'middle';
        closeButton.style.padding = '0 5px';
        
        closeButton.addEventListener('click', () => {
            warning.remove();
        });
        
        warning.appendChild(closeButton);
        document.body.appendChild(warning);
    }
}

// Add the eyedropper functionality
addEyedropperTool();
addBrowserWarning();

// Initialize
updateColor();