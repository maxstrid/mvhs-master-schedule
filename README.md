# Master Schedule App

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

An app to help manage scheduling conflicts at MVHS.

Made for the 23-24 Advanced Computer Science app project.

## Development

### Setup

Follow the instructions in [/flask](/flask/README.md) to create a .venv directory

Create a `.env.local` file to store the backend url
```bash
VITE_BACKEND_URL=""
```

### Running

Running `npm run dev` will start the frontend and flask server. This requires `flask/.venv` to exist.

### Deployment

Deploy a .env or .env.production file to load production constants

## Manual

Choose the current grade level using the drop down box in the top

To switch the grade level, press switch

To swap two classes, click on two classes and press the swap button

To undo, press `Ctrl-Z` and to redo, press `Ctrl-Y`

Press regenerate to clear all changes made

When the import button is clicked,
it will bring up a modal which will prompt you to
either import the grade level classes or the conflict matrix

To export the schedule, the export button will bring up another modal
which gives the option to export as class names or class ids

## Contributors

* Maxwell Henderson
* Milo Lin
