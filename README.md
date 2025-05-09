# Slidr: Adobe Express Add-on for Slide Generation

## Purpose
Slidr is an Adobe Express add-on designed to streamline the creation of visually appealing slides from text input. It enables users to quickly generate slides with customizable themes, fonts, and left-aligned text, making it ideal for presentations, pitches, and educational content.

## Features
- **Theme Selection:** Choose from multiple professionally designed themes.
- **Real-Time Theme Switching:** Instantly update slide appearance by selecting a new theme in the UI.
- **Seamless UI-to-Sandbox Communication:** The selected theme is communicated from the UI to the sandbox for accurate slide rendering.

## Usage
1. **Launch the Add-on:** Open Adobe Express and start the Slidr add-on.
2. **Enter Your Content:** Input your slide text (titles, bullet points, etc.) in the provided fields.
3. **Select a Theme:** Use the UI to pick your preferred theme. The preview updates in real time.
4. **Generate Slides:** Click the generate button to create slides with your chosen theme and left-aligned text.
5. **Export or Use Slides:** Download or insert the generated slides into your Adobe Express project.

## Setup
1. **Install Dependencies:**
   ```sh
   npm install
   ```
2. **Build the Application:**
   ```sh
   npm run build
   ```
3. **Start the Application:**
   ```sh
   npm run start
   ```
4. **Load the Add-on in Adobe Express:**
   - Follow Adobe's instructions to load your local add-on into Adobe Express for development and testing.

## Project Structure
- `src/ui/` – UI components and logic (theme selection, user input)
- `src/sandbox/` – Slide generation logic, theme/font application, and text alignment
- `src/index.html` – Main HTML entry point
- `manifest.json` – Add-on manifest for Adobe Express
- `README.md` – Project documentation

## Requirements
- Node.js (v16 or later recommended)
- npm
- Adobe Express (for add-on usage and testing)

## Contributing
Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request. For major changes, open an issue first to discuss your ideas.

