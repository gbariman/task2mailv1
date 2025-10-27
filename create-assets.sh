#!/bin/bash
# Create placeholder icon files for Expo

cd "$(dirname "$0")/assets"

# Create a simple 1024x1024 PNG icon
python3 << 'EOF'
from PIL import Image

# Create icon
img = Image.new('RGB', (1024, 1024), color='#4F46E5')
img.save('icon.png')

# Create splash
splash = Image.new('RGB', (1024, 1024), color='#FFFFFF')
img.save('splash.png')

# Create adaptive icon
adaptive = Image.new('RGB', (1024, 1024), color='#4F46E5')
adaptive.save('adaptive-icon.png')

print("✓ Created icon files")
EOF

