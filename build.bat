@echo off
REM Production Build Script for Portfolio Website

echo 🚀 Starting production build...

REM Create dist directory
if not exist "dist\css" mkdir "dist\css"
if not exist "dist\js" mkdir "dist\js"

REM Build CSS
echo 📦 Building CSS...
call npx postcss src/css/main.css -o dist/css/main.min.css --map

REM Build JavaScript
echo 📦 Building JavaScript...
call npx uglifyjs src/js/main.js src/js/tools.js -o dist/js/bundle.min.js --source-map --mangle --compress

REM Copy HTML files
echo 📦 Copying HTML files...
copy "index.html" "dist\"
copy "src\pages\tools.html" "dist\"

REM Copy assets
echo 📦 Copying assets...
xcopy "public" "dist\public" /E /I /Y

echo ✅ Production build complete!
echo 📁 Build files are in the 'dist' directory
echo 🌐 You can now deploy the contents of the 'dist' directory

pause