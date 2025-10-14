#!/bin/bash

# Production Build Script for Portfolio Website

echo "🚀 Starting production build..."

# Create dist directory
mkdir -p dist/css
mkdir -p dist/js

# Build CSS
echo "📦 Building CSS..."
npx postcss src/css/main.css -o dist/css/main.min.css --map

# Build JavaScript
echo "📦 Building JavaScript..."
npx uglifyjs src/js/main.js src/js/tools.js -o dist/js/bundle.min.js --source-map --mangle --compress

# Copy HTML files and update references
echo "📦 Copying and updating HTML files..."
cp index.html dist/
cp src/pages/tools.html dist/

# Update references in HTML files for production
sed -i 's|src/css/main.css|dist/css/main.min.css|g' dist/index.html
sed -i 's|src/js/main.js|dist/js/bundle.min.js|g' dist/index.html

sed -i 's|../css/main.css|../dist/css/main.min.css|g' dist/tools.html
sed -i 's|../js/main.js|../dist/js/bundle.min.js|g' dist/tools.html
sed -i 's|../js/tools.js||g' dist/tools.html

# Copy assets
echo "📦 Copying assets..."
cp -r public dist/

echo "✅ Production build complete!"
echo "📁 Build files are in the 'dist' directory"
echo "🌐 You can now deploy the contents of the 'dist' directory"