
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

### KILT Sporran Dev Wallet
```bash
git clone https://github.com/KILTprotocol/sporran-extension.git
cd sporran-extension
yarn install && yarn dev
```
Note: Sporran dev wallet has included breaking API changes in the past, it might not work

- Navigate to chrome://extensions
- Enable developer mode
- Click "Load Unpacked"
- Load /dist folder from built extension
- Setup wallet using existing seed phrase: "rural legal price degree hole coin park rude wheat knock tent ten"
- Import email credential into sporran from:
```
<mono repo>/packages/minecraft-oracle-api/kilt_test_claimer_credentials/peregrine email.json
```
- Navigate to http://localhost:3030/api/v1/auth/kilt/did_configuration to get json, this is like a ssl certificate for KILT
- Copy json from above to:
```
<mono repo>/packages/minecraft-oracle-ui/public/.well-known/did-configuration.json
```
- Verify file is hosted: http://localhost:3000/.well-known/did-configuration.json
- Browser reset, extension reset might be required if you tried to do a KILT login before did-configuration.json was in place