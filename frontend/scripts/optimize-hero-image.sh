#!/bin/bash

# Script to create optimized versions of hero image for different screen sizes
# Requires ImageMagick (brew install imagemagick) or sharp-cli (npm install -g sharp-cli)

SOURCE_IMAGE="public/images/hero/layer01.png"
OUTPUT_DIR="public/images/hero"

echo "Optimizing hero image for responsive loading..."

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "Using ImageMagick..."
    
    # Mobile version (320px width, maintains aspect ratio)
    convert "$SOURCE_IMAGE" -resize 320x -strip -quality 90 "$OUTPUT_DIR/layer01-mobile.png"
    echo "✓ Created mobile version (320px)"
    
    # Tablet version (400px width)
    convert "$SOURCE_IMAGE" -resize 400x -strip -quality 90 "$OUTPUT_DIR/layer01-tablet.png"
    echo "✓ Created tablet version (400px)"
    
    # Desktop version (500px width) - optimize original
    convert "$SOURCE_IMAGE" -resize 500x -strip -quality 90 "$OUTPUT_DIR/layer01-desktop.png"
    echo "✓ Created desktop version (500px)"
    
    echo ""
    echo "Optimization complete! File sizes:"
    ls -lh "$OUTPUT_DIR"/layer01-*.png | awk '{print $9, $5}'
    
elif command -v sharp &> /dev/null; then
    echo "Using sharp-cli..."
    
    # Mobile version
    sharp -i "$SOURCE_IMAGE" -o "$OUTPUT_DIR/layer01-mobile.png" resize 320 --png
    echo "✓ Created mobile version (320px)"
    
    # Tablet version
    sharp -i "$SOURCE_IMAGE" -o "$OUTPUT_DIR/layer01-tablet.png" resize 400 --png
    echo "✓ Created tablet version (400px)"
    
    # Desktop version
    sharp -i "$SOURCE_IMAGE" -o "$OUTPUT_DIR/layer01-desktop.png" resize 500 --png
    echo "✓ Created desktop version (500px)"
    
    echo ""
    echo "Optimization complete! File sizes:"
    ls -lh "$OUTPUT_DIR"/layer01-*.png | awk '{print $9, $5}'
    
else
    echo "Error: Neither ImageMagick nor sharp-cli is installed."
    echo ""
    echo "To install ImageMagick:"
    echo "  brew install imagemagick"
    echo ""
    echo "Or install sharp-cli:"
    echo "  npm install -g sharp-cli"
    echo ""
    echo "Alternatively, you can use online tools like:"
    echo "  - https://squoosh.app/ (browser-based)"
    echo "  - https://tinypng.com/ (PNG compression)"
    exit 1
fi

