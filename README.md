
# Metaverse oracle bridge monorepo

## Prereqs
- node 14+ LTS

## Setup
```
cd <monorepo root>
yarn
```

### Run API backend locally

First:
```bash
cd packages/minecraft-oracle-api
# starts local postgres & redis containers
yarn docker:deps:up 
  ```
Second:

create a `.env` file, see `.env.example`

Third:

```bash
# starts backend
yarn start
```

### How to: add a new dep
```bash
cd <subrepo folder>
yarn add <package>
yarn add -D <package>
```

### How to: execture scripts
```bash
cd <subrepo folder>
yarn <script>
```
