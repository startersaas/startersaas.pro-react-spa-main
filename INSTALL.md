npx create-react-app startersaas.pro
npm install \
  axios \
  multer \
  @mui/material \
  @mui/x-data-grid \
  @emotion/react \
  @emotion/styled \
  @mui/lab \
  @opentelemetry/api \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/resources \
  @opentelemetry/sdk-trace-base \
  @opentelemetry/semantic-conventions \
  @opentelemetry/exporter-jaeger \
  react-force-graph \
  react-router-dom \
  react-slick \
  @mui/icons-material \
  @mui/x-tree-view \
  @hookform/resolvers \
  yup \
  react-query \
  react-hook-form \
  @stripe/stripe-js \
  @stripe/react-stripe-js \
  moment \
  react-confirm-alert \
  react-i18next \
  i18next@23.7.11 \
  papaparse \
  lodash \
  swagger-parser \
  @fortawesome/free-solid-svg-icons \
  @fortawesome/react-fontawesome \
  svg-loaders-react \
  three \
  mathjs \
  mysql2
npm install --save-dev \
  react-app-rewired \
  process \
  stream-browserify \
  stream-http \
  https-browserify \
  url \
  buffer \
  assert \
  browserify-zlib \
  util \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  web-vitals


npx create-react-app startersaas.pro           
cd startersaas.pro
npm install react@18 react-dom@18
npm dedupe
npm install web-vitals
npm install react-app-rewired

--no-audit
--save-dev

npx create-react-app startersaas.pro
cd startersaas.pro
npm install react@18 react-dom@18
npm dedupe
npm install \
  axios \
  multer \
  @mui/material \
  @mui/x-data-grid \
  @emotion/react \
  @emotion/styled \
  @mui/lab \
  @opentelemetry/api \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/resources \
  @opentelemetry/sdk-trace-base \
  @opentelemetry/semantic-conventions \
  @opentelemetry/exporter-jaeger \
  react-force-graph \
  react-router-dom \
  react-slick \
  @mui/icons-material \
  @mui/x-tree-view \
  @hookform/resolvers \
  yup \
  react-query \
  react-hook-form \
  @stripe/stripe-js \
  @stripe/react-stripe-js \
  moment \
  react-confirm-alert \
  react-i18next \
  i18next@23.7.11 \
  papaparse \
  lodash \
  swagger-parser \
  @fortawesome/free-solid-svg-icons \
  @fortawesome/react-fontawesome \
  svg-loaders-react \
  three \
  mathjs \
  mysql2
npm install --save-dev \
  react-app-rewired \
  process \
  stream-browserify \
  stream-http \
  https-browserify \
  url \
  buffer \
  assert \
  browserify-zlib \
  util \
  @testing-library/jest-dom \
  @testing-library/react \
  @testing-library/user-event \
  web-vitals
rm -rf node_modules package-lock.json
npm install
nano config-overrides.js
npm start
npm uninstall react-app-rewired
rm -rf node_modules package-lock.json
npm install
npm start

npm install -g \
  pm2
pm2 -v
pm2 start npm \
  --name development \
  -- run start
pm2 start node \
  --name frontend \
  -- server.js
pm2 start node \
  --name backend \
  -- index.js
pm2 start node \
  --name server \
  -- server-function-hub.js

 node test-seed-server-code.js
Connecting to database...
Connected to database!
Dropping existing table and creating new one...
Table created successfully!
Generating 500 customer records...Inserted 50 records...
Inserted 100 records...
Inserted 150 records...
Inserted 200 records...
Inserted 250 records...
Inserted 300 records...
Inserted 350 records...
Inserted 400 records...
Inserted 450 records...
Inserted 500 records...
Successfully inserted 500 customer records!
Closing database connection...
Connection closed.