
# Metaverse oracle bridge monorepo

## Prereqs
- node 14+ LTS
- [rush](https://rushjs.io/pages/intro/get_started/)
- 1.22.15

## Setup
```
cd <monorepo root>
rush update
```

### Run API backend locally

First:
```bash
cd packages/minecraft-oracle-api
# starts local postgres & redis containers
rushx docker:deps:up 
  ```
Second:

create a `.env` file, see `.env.example`

Third:

```bash
# starts backend
rushx start
```

### How to: add a new dep
```bash
cd <subrepo folder>
yarn add <package>
yarn add-D <package>
```

### How to: execture scripts
```bash
cd <subrepo folder>
rushx <script>
```

### How to: fix deps
```bash
cd <monorepo root>
rush update --purge
```
