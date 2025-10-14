# Vipul Sharma - Software Engineer Portfolio

A pixel-perfect, responsive portfolio website built with semantic HTML5, modern CSS, and vanilla JavaScript. This professional portfolio showcases Vipul Sharma's experience as a Software Engineer with a dark theme, interactive collapsible widgets, smooth animations, and full responsiveness across all devices.

## 🚀 Project Structure

```
# Vipul Sharma - Portfolio Website

A modern, responsive portfolio website showcasing professional experience and developer tools.

## 🚀 Features

- **Responsive Design**: Optimized for all device sizes
- **Dark Theme**: Professional dark color scheme
- **Interactive Collapsibles**: Smooth animations for content sections
- **Developer Tools**: Built-in utilities for developers
  - Base64 Encoder/Decoder
  - URL Encoder/Decoder
  - SHA256 Hash Generator
  - JWT Encoder/Decoder with signature verification
  - Text Case Converter
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance Optimized**: Minified assets and optimized images

## 📁 Project Structure

```
portfolio/
├── index.html                 # Main portfolio page
├── src/                      # Source files
│   ├── css/
│   │   └── main.css         # Main stylesheet
│   ├── js/
│   │   ├── main.js          # Main JavaScript functionality
│   │   └── tools.js         # Developer tools functionality
│   └── pages/
│       └── tools.html       # Developer tools page
├── public/                   # Public assets
│   └── assets/
│       ├── images/          # Image files
│       └── documents/       # PDF and other documents
├── dist/                     # Build output (generated)
├── package.json             # Dependencies and scripts
├── .eslintrc.js            # ESLint configuration
└── README.md               # This file
```

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, CSS Animations
- **Security**: Web Crypto API for JWT signatures
- **Build Tools**: PostCSS, UglifyJS, ESLint
- **Development**: Live Server, HTTP Server

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vipul-sharma/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Alternative (Python Server)
If you don't have Node.js:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

### Deploy to GitHub Pages
```bash
npm run deploy
```

### Code Quality
```bash
# Lint JavaScript
npm run lint

# Format code
npm run format

# Validate HTML
npm run validate
```

## 🧰 Developer Tools

The portfolio includes a comprehensive set of developer tools:

### Base64 Encoder/Decoder
- Encode text to Base64
- Decode Base64 strings
- Copy results to clipboard

### URL Encoder/Decoder
- URL encode special characters
- Decode URL-encoded strings
- Preserve formatting

### SHA256 Hash Generator
- Generate SHA256 hashes
- Secure client-side processing
- Copy hash results

### JWT Encoder/Decoder
- Create JWT tokens with HMAC-SHA256
- Decode and verify JWT tokens
- Visual header/payload separation
- Signature verification status

### Text Case Converter
- UPPERCASE conversion
- lowercase conversion
- Title Case conversion
- Sentence case conversion

## 🎨 Customization

### Colors
The color scheme is defined in CSS custom properties:
```css
:root {
    --bg-primary: #0a0b0d;
    --accent-blue: #007bff;
    --text-primary: #ffffff;
    --text-secondary: #b8bcc8;
}
```

### Fonts
Using system fonts for optimal performance:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- Client-side processing only
- No data sent to external servers
- Secure cryptographic implementations
- Content Security Policy ready

## 📈 Performance

- Optimized images
- Minified CSS and JavaScript
- Efficient animations
- Lazy loading ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Vipul Sharma**
- Email: rexvips1@gmail.com
- LinkedIn: [ivipulsharma](https://www.linkedin.com/in/ivipulsharma)
- Current Role: Software Development Engineer II at Kotak Mahindra Bank

## 🙏 Acknowledgments

- Design inspiration from modern portfolio trends
- Icons and visual elements from CSS-only implementations
- JWT implementation following RFC 7519 standards
- Crypto API usage following Web Standards

---

⭐ Star this repository if you find it helpful!
├── index.html          # Main HTML file with semantic structure
├── styles.css          # Complete CSS styling with responsive design
├── script.js           # JavaScript for interactivity and animations
├── assets/             # Folder for images and media files
│   ├── john-carter-hero.jpg        # Hero section profile image
│   ├── portfolio-preview.jpg       # Portfolio preview image
│   └── (additional image files)
└── README.md           # Project documentation
```

## 🎨 Design Features

### Visual Elements
- **Dark Theme**: Deep dark background (#0a0b0d) with blue accent color (#007bff)
- **Modern Typography**: Clean, readable fonts with proper hierarchy
- **Gradient Effects**: Subtle gradients for visual depth
- **Smooth Animations**: CSS and JavaScript animations for engaging UX
- **Professional Layout**: Grid and Flexbox for precise positioning

### Color Palette
- Primary Background: `#0a0b0d`
- Secondary Background: `#0f1014`
- Accent Color: `#007bff`
- Text Primary: `#ffffff`
- Text Secondary: `#b0b0b0`
- Card Background: `rgba(255, 255, 255, 0.02)`

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- **Desktop**: 1200px+ (Full layout with side-by-side sections)
- **Tablet**: 768px - 1199px (Stacked sections, adjusted spacing)
- **Mobile**: 320px - 767px (Single column, mobile navigation)

### Mobile Features
- Hamburger menu navigation
- Touch-friendly interactions
- Optimized image sizes
- Vertical layout for all sections

## 🏗️ HTML Structure

### Semantic Sections
1. **Navigation Header** (`<nav>`)
   - Fixed position with backdrop blur
   - Logo with Vipul Sharma branding
   - Mobile-responsive menu

2. **Hero Section** (`<section id="home">`)
   - Personal introduction
   - Statistics display (3+ years experience, 15+ projects)
   - Professional photo placeholder

3. **About Section** (`<section id="about">`)
   - Professional background
   - Collapsible education details
   - Collapsible technical skills
   - Collapsible certifications
   - Social media links

4. **Experience Section** (`<section id="experience">`)
   - Professional timeline layout
   - Collapsible job details
   - Company information and achievements

5. **Skills Section** (`<section id="skills">`)
   - Categorized technical skills
   - Interactive skill tags
   - Recent projects showcase
   - Contact information card

6. **Contact Section** (`<section id="contact">`)
   - Direct contact methods
   - Professional links
   - Interactive hover effects

## 🎯 CSS Architecture

### Methodology
- **Mobile-First Approach**: Base styles for mobile, enhanced for larger screens
- **Component-Based**: Modular CSS for reusability
- **CSS Grid & Flexbox**: Modern layout techniques
- **Custom Properties**: Consistent spacing and colors

### Key CSS Features
- CSS Grid layouts for complex sections
- Flexbox for component alignment
- CSS animations and transitions
- Backdrop filters for glassmorphism effects
- Hover states and interactive feedback

## ⚡ JavaScript Functionality

### Core Features
1. **Mobile Navigation**
   - Toggle hamburger menu
   - Smooth menu animations
   - Auto-close on link click

2. **Smooth Scrolling**
   - Anchor link navigation
   - Scroll-to-section functionality
   - Active navigation highlighting

3. **Interactive Elements**
   - Newsletter form validation
   - Success/error states
   - Hover animations

4. **Performance Enhancements**
   - Intersection Observer for animations
   - Throttled scroll events
   - Lazy loading preparations

### Animation Features
- Fade-in animations on scroll
- Counter animations for statistics
- Parallax effects for hero section
- Typing effect for hero title
- Smooth hover transitions

## 🖼️ Image Assets

The following placeholder images should be added to the `assets/` folder:

1. **vipul-sharma-hero.jpg** (400x500px)
   - Professional headshot for hero section
   - High-quality portrait image

2. **portfolio-preview.jpg** (flexible dimensions)
   - Screenshot of project work
   - Code editor or website preview

3. **Additional Assets** (optional)
   - Company logos
   - Project screenshots
   - Certification badges

## 🛠️ Setup Instructions

1. **Clone/Download** the project files
2. **Add Images** to the `assets/` folder with the specified names
3. **Open** `index.html` in a web browser
4. **Host** on any web server for production use

### Local Development
- No build process required
- Works with any local server (Live Server, Python's http.server, etc.)
- Compatible with GitHub Pages for hosting

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **CSS Features**: Grid, Flexbox, Custom Properties, Backdrop Filter
- **JavaScript**: ES6+ features with fallbacks for older browsers

## 📊 Performance Considerations

### Optimizations
- Minimal CSS and JavaScript footprint
- Efficient animations using transform and opacity
- Lazy loading for images (ready for implementation)
- Compressed assets for faster loading

### Best Practices
- Semantic HTML for accessibility
- ARIA labels where needed
- Keyboard navigation support
- SEO-friendly structure

## 🔧 Customization Guide

### Colors
Update the CSS custom properties in `styles.css`:
```css
:root {
  --primary-bg: #0a0b0d;
  --accent-color: #007bff;
  --text-primary: #ffffff;
}
```

### Content
- Modify text content in `index.html`
- Replace placeholder images in `assets/`
- Update social media links and contact information

### Layout
- Adjust grid layouts in respective sections
- Modify responsive breakpoints as needed
- Customize animation timings and effects

## 📝 Development Notes

### Code Quality
- Clean, commented code for maintainability
- Consistent naming conventions
- Modular CSS architecture
- Error handling in JavaScript

### Future Enhancements
- Contact form integration
- CMS integration capabilities
- Additional portfolio sections
- Blog functionality expansion
- Performance monitoring setup

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page for ways to contribute.

---

**Developer X Portfolio** - A modern, responsive portfolio website template designed for professional developers and designers.