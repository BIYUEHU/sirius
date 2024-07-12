# Contributing

## Environment

- Git
- Node.js >= 17.0.0
- Package Manager: pnpm(recommended)、npm、yarn or any other modern package manager of your choice
- Editor：Visual Studio Code or any other code editor of your choice
- LeviLamina and BDS

## Setup

1. Fork the repository to your GitHub account.
2. Clone the repository `https://github.com/<your-username>/sirius.git` to your local machine.
3. Open the repository in your code editor.
4. Install the dependencies by running `pnpm install` in the terminal.
5. Start to code and run `pnpm dev`.
6. Commit changes and push them to your GitHub repository.
7. Create a pull request to the original repository.
8. Wait for the review and merge.

## Env Variables

Base on `Dotenv` package, you can create `.env` file in the root directory to store your environment variables. Such as `.env`:

```ini
START_BDS=on
BDS_PATH=./server
```

- `START_BDS`: Set to `on` to start BDS automatically when running `pnpm dev`, default is `off`.
- `BDS_PATH`: Set to the path of BDS root directory, default is `./server`.
