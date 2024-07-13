# Contributing

## Environment

- Git
- Node.js >= 17.0.0
- Package Manager: pnpm(recommended)、npm、yarn or any other modern package manager of your choice
- Editor：Visual Studio Code or any other code editor of your choice
- LeviLamina and BDS

## Setup

1. Fork the repository to your GitHub account.
2. Clone your forked repository and open it in your editor.
3. Install the dependencies by running `pnpm install` in the terminal.
4. Start to code and run `pnpm dev`.
5. Commit changes and push them to your GitHub repository.
6. Create a pull request to the original repository.
7. Wait for the review and merge.

## Env Variables

Base on `Dotenv` package, you can create `.env` file in the root directory to store your environment variables. Such as `.env`:

```ini
START_BDS=on
BDS_PATH=./server
```

- `START_BDS`: Set to `on` to start BDS automatically when running `pnpm dev`, default is `off`.
- `BDS_PATH`: Set to the path of BDS root directory, default is `./server`.

## File Structure

```text
.
├── src
│   ├── components
│   ├── utils
│   ├── index.ts
│   ├── constants.ts
│   ├── global.d.ts
│   ├── Sirius.ts
│   └── template.ts
├── static
│   └── gui
├── scripts
│   └── bds.ts
├── schema
│   └── gui.json
├── biome.json
├── CONTRIBUTING.md
├── README.md
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Package.json Meta

```json
{
  /* ... */
  "keywords": [
    "sirius",
    "plugin",
    "levilamina",
    "minecraft",
    "bedrock",
    "minecraft-bedrock",
    "bds",
    "server"
  ],
  /* ... */
  "levilamina": {
    "type": "lse-quickjs",
    "dependencies": [
      {
        "name": "legacy-script-engine-quickjs"
      }
    ]
  }
}
```

- `keywords`: A list of keywords to help users find the package about LeviLamina plugins.
- `levilamina`: A meta field for LeviLamina and it will divide to tsup when building.
