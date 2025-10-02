# Mithila Games Website Prototype

This is a functional, responsive website prototype for a fictional game company, "Mithila Games".

It features a modern design with a collapsible sidebar, dynamic content loading from JSON files, and a background with subtle animations.

## Features

-   **Responsive Design**: The layout adapts to different screen sizes, with a toggleable sidebar for screens narrower than 1260px.
-   **Dynamic Content**: The "Games", "Store", and "News" sections load their content dynamically from local JSON files using the Fetch API.
-   **Modern Aesthetics**: Utilizes the "Bebas Neue" font, Google Material Symbols, a frosted glass effect, and sharp, clean lines.
-   **Animated Background**: Subtle, bouncing geometric shapes in the background add visual interest without being distracting.

## Project Structure

The project is organized into the following directories and files:

```
.
├── data/
│   ├── games.json      # Data for the Games section
│   ├── store.json      # Data for the Store section
│   └── news.json       # Data for the News section
├── public/
│   ├── css/
│   │   └── style.css   # All styles for the website
│   └── js/
│       └── script.js   # Core JavaScript for navigation and dynamic content
├── index.html          # The main HTML file
└── README.md           # This file
```

## Setup and Running the Website

Because this website uses the `fetch()` API in JavaScript to load content from local `.json` files, it must be run from a web server to function correctly. Opening the `index.html` file directly in your browser from the file system will result in a Cross-Origin Resource Sharing (CORS) error, and the dynamic content will not load.

### Instructions

1.  **Navigate to the project directory**:
    Open your terminal or command prompt and change to the `website2` directory where the `index.html` file is located.

2.  **Start a simple local web server**:
    If you have Python 3 installed (which is common on most systems), you can run the following command:

    ```bash
    python3 -m http.server
    ```

    If you have Python 2, use this command instead:
    ```bash
    python -m SimpleHTTPServer
    ```

3.  **View the website**:
    Once the server is running, open your web browser and navigate to the following address:

    [http://localhost:8000](http://localhost:8000)

You should now see the Mithila Games website up and running.
