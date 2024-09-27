const express = require('express');
const app = express();
const dotenv = require('dotenv');
const config = require('./config/config').config();
dotenv.config({ path: config });
const router = require('./routes/routes');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
var http = require('http').Server(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.use('/', router);

const { PORT, MONGODB_URL } = process.env;

async function main() {
  try {
    mongoose.connect(MONGODB_URL).then(() => {
      console.log('Connection Successful');
      app.listen(PORT, () => {
        console.log(`Server is Up at PORT ${PORT}`);
      });
    });
  } catch (e) {
    console.log(e);
  }
}

main().catch((err) => console.log(err));
