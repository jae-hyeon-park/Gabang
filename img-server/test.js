 // api test

  const TinEye = require('tineye-api');
  // TinEye API의 샌드박스 키
  const sandboxApiKey = "6mm60lsCNIB,FwOWjJqA80QZHh9BMwc-ber4u=t^";

  // TinEye 객체 생성
  const api = new TinEye("https://api.tineye.com/rest/", sandboxApiKey);

  // 검색할 이미지 URL
  const imageUrl = "https://tineye.com/images/meloncat.jpg";

  // 검색 파라미터
  const params = {
    offset: 0,
    limit: 10,
    sort: "score",
    order: "desc",
  };
  
  // 이미지 URL을 사용하여 검색을 수행
  api.searchUrl(imageUrl, params)
  .then(response => {
    console.log("Search results:", response);
  })
  .catch(error => {
    console.error("Error:", error);
  });

  