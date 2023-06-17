# React Image Annotation Tool

This project is a Proof of Concept (POC) for an image annotation tool built with React, using React DnD for drag and drop functionality.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/RickvanRooij/image-annotator
```

2. Navigate to the project directory:

```bash
cd react-image-annotation-tool
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm start
```

## Usage

- The application provides a text input field for entering an image URL. Once an image URL is entered, the image is displayed on the page.
- Click on the image to create a new annotation. A dot will appear on the image, and a new draggable card will appear to the right of the image.
- Drag the card onto the corresponding dot to complete the annotation.
- The application also allows loading and saving annotations in a JSON format.

## Built With

- [React](https://reactjs.org/) - The web framework used
- [React DnD](https://react-dnd.github.io/react-dnd/about) - Drag and Drop API for React
- [Create React App](https://create-react-app.dev/) - Used to bootstrap the development setup

## Authors

Rick van Rooij
