const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const ADMIN_PASSWORD = 'yourpassword'; // 관리자 비밀번호 설정

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// 계산 데이터를 파일에 저장하는 엔드포인트
app.post('/submit-calculation', (req, res) => {
  const calcData = req.body;
  fs.appendFile('calculations.txt', JSON.stringify(calcData) + "\n", err => {
    if (err) {
      console.error('Error saving calculation:', err);
      return res.status(500).send('Error saving calculation.');
    }
    res.sendStatus(200);
  });
});

// 관리자가 계산 데이터를 조회하는 엔드포인트
app.get('/api/calculations', (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).send('Unauthorized');
  }
  fs.readFile('calculations.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading calculations:', err);
      return res.status(500).send('Error reading calculations');
    }
    const calculations = data.trim().split("\n").map(line => JSON.parse(line));
    res.json(calculations);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
