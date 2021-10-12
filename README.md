
# Game bridge monorepo

## Prereqs
- node 14+ LTS
- [rush](https://rushjs.io/pages/intro/get_started/)
- -[pnpm](https://pnpm.io/installation)

## Setup
```
rush update
```

### Run API backend locally

First:
```bash
cd packages/minecraft-oracle-api
# starts a local postgres & redis instance
rushx docker:deps:up 
  ```
Second:

create a `.env` file, see `.env.example`

Third:

```bash
rushx docker:deps:up
rushx start
```

### Adding a new dep
```bash
cd <subrepo folder>
pnpm add <package>
```

### Executing scripts
```bash
cd <subrepo folder>
pnpm add <package>
```