import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '../public/figma');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const assets = [
  'b0d65b391d8866fc39b667cba893ea7b4c71e124.svg',
  '305dee135c530c364d943438f640872189d67e8a.png',
  '18714511a4b6ed16c96997a9c8a048cbc5993232.png',
  '8e9a32ac8405841c6c5fab35297bf652fbcdbef3.png',
  '0fd44c4b98d30d4a5da945e551b32bed914fcebe.png',
  'e6fb42896433e9286f0abed9abd4d1db53c872f0.png',
  '41995ef99ef2ef0a84afa875e45938dc42f2f03f.png',
  '9c57f566b1ecfa519d0baf95252f73f2ff1165d4.png',
  '4e1306367bc471614c5de034d2b7ba22204b0f0c.png',
  '6400ac4210fb3544891bb1eff7fbf3c62fa05a18.png',
  'b540666cb93a8dc680d229bc863457bb8bb7395a.png',
  'b52e666654c6d145250a5319a4b608f813e022fe.png',
  '3315ad1fb46e5b97cc0470b2e7e7334e4e6d8f44.png',
  '77338bc20a1836555ccabfacd14d3916768b60ce.svg',
  'ea58c4e23739e24c7763d46274b1d34f56059793.svg',
  'b7f3972add58be9c9d12e45fea79d82f555f6643.svg',
  '5026b122900bc1ac0c2a3cb1726f6176d5e6d9d3.svg',
  '8b4c77cd846abdce0161fb9df37e3fb43fdcd3d5.svg',
  'f4a59134c767cf4c05a7b98af1b8e703a04932aa.svg',
  '790eed190ad1a8a90a649e3f39106dc5f2682d56.svg',
  '7b42fb0bcfd6986e2cf839444cc68d8de7f67c6d.svg',
  '85d1485208e4e179073f475b6b292cf476d22e72.svg',
  'a494725bcebd1622662ed47d6cdcc49ad352983e.svg',
  'b3e52b132bc7907fa3ec985eeec73f80cf454f17.svg',
  '67a6bb81c4a554af3119eb32fbebffe0da284d61.svg',
  '4e072500f56ab5055f580074320d2394bfe66028.svg',
  'f02e438bb5ab4593c41ec32cd829fd83ffa16c1f.svg',
  'dac489a6a79abfe8219f2ffcf27d848c0cc2d187.svg',
  '7134fc76a6329a787b84d6ea98e4b21bed557fb1.svg',
  'e52b25d9e5677481789f257381e06a682c6abed2.svg',
  '9818e3559a00bb8aa7ee6198de27a3f08f5111bf.svg',
  'd46cfb035c113c6c73870cf81772ed2a9d5eb0d1.svg',
  'b456207775f61b462f09ffc74b804aadc6bd0e73.svg',
  '7e164ba8c0c859c2e25680c044e179b53fb2d6e1.svg',
  '11df3d607b3caaa88b0aebe4d72cd2d4edac5063.svg',
  'ed864017d01987d7043092711dececa377f847e4.svg',
  '594204f7f912a8791890536f0ce75016d826172d.svg',
  'b6014a0fc749c86f7882850dc73da23a8ceac921.svg',
  '824d8ca1f9880ae9fe340172b9613aa4aab84eba.svg',
  '54b8222684efaceb8dbb0c91c1e4949d032fc22d.svg'
];

async function downloadFile(filename) {
  const url = `http://localhost:3845/assets/${filename}`;
  const dest = path.join(outDir, filename);

  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: status ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

console.log(`Downloading ${assets.length} assets...`);
for (const file of assets) {
  try {
    await downloadFile(file);
    console.log(`[OK] ${file}`);
  } catch (err) {
    console.error(`[ERR] ${file}:`, err.message);
  }
}
console.log('Finished downloading assets.');
