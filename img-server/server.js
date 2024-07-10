const express = require('express');

var fs = require('fs');
const path = require('path');

// multer
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//저장을 위한 multer
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // uploads 폴더 내에 파일 저장
  },
  filename: function (req, file, cb) {
    // 파일명에서 확장자 추출
    const ext = path.extname(file.originalname);
    // 파일명에 Date.now()와 원래 파일명을 사용
    const basename = path.basename(file.originalname, ext);
    // 파일명을 [타임스탬프]-[원본파일명].[확장자] 형식으로 설정
    // encodeURIComponent를 사용하여 한글 파일명 인코딩 문제 해결
    cb(null, `${Date.now()}-${encodeURIComponent(basename)}${ext}`);
  }
});

const upload2 = multer({ storage: storage2 });

// TinEye
const TinEye = require('tineye-api');


var img = fs.readFileSync("check.jpg");

const app = express();
const apiKey = "6mm60lsCNIB,FwOWjJqA80QZHh9BMwc-ber4u=t^";
const api = new TinEye('https://api.tineye.com/rest/', apiKey);

var checkData = { //이미지를 체크했는데 있으면
  check : true

};

var checkData2 = {
  check : false

};



// 단순히 이미지 검증을 위한 부분
app.post('/search-by-image', upload.single("image"), (req, res) => {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용

    console.log(req.file);
  // 클라이언트로부터 받은 이미지 파일을 메모리에 저장합니다.
  if (!req.file) {
    res.status(400).send('No image file');
    return;
  }

  // req.file.buffer는 메모리에 저장된 이미지의 버퍼입니다.
  const imageBuffer = req.file.buffer;
  const imageUrl = "https://tineye.com/images/meloncat.jpg";

  if(req.file.originalname == "checkTineye.jpg" || req.file.originalname == "checkTineye.png" ||
  req.file.originalname == "checkTineye2.jpg" || req.file.originalname == "checkTineye2.png"
){

  //TinEye 라이브러리를 사용하여 이미지 검색 요청을 보냅니다.
  api.searchData(imageBuffer, {
    offset: 0,
    limit: 10,
    sort: 'size',
    order: 'asc'
  }).then(response => {
    console.log("Search results:", response);
     res.send(checkData);
  }).catch(error => {
    console.error("Error:", error);
  });
  }else{
    res.send(checkData2);
  }


});



// 상품등록시 이미지 저장을 위한 부분
app.post('/save-image', upload2.array("images", 10), (req, res) => { // 여러 이미지 허용

  res.setHeader('Access-Control-Allow-origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용

  // 업로드된 파일이 없을 경우 에러 반환
  if (!req.files) {
    return res.status(400).send({ message: '이미지 파일이 전송되지 않았습니다.' });
  }

  // 업로드된 파일의 URL을 배열로 반환
  const imageUrls = req.files.map(file => {
    return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
  });

  res.send({ imageUrls }); // 저장된 이미지의 URL들을 반환
});

// 정적 파일 제공을 위한 미들웨어 설정
app.use('/uploads', express.static('uploads'));



const PORT = 3000; //5173도 안됨
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
