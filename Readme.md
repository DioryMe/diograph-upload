# Diograph Upload

```
import { DiographUpload } from "diograph-upload"

<DiographUpload
  secrets={{ "master": "kissa123" }}
  onDioryCreated={ diory => { console.log(diory) } } />
```

## Usage / Development

```
npm install -g npx
npm install
npm start
```
Then go to: http://localhost:4204/


## Tests

```
npm test
```

## Deploy

```
npx webpack
cp app/index.html dist/index.html
# Change "../dist/bundle.js" to "bundle.js" in dist/index.html
surge ./dist diograph-upload.surge.sh
```
