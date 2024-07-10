import 'cypress-file-upload';

describe('Product Enroll Tests', () => {
    beforeEach(() => {
      const userId = 'user01';
    const password = 'asdf123!';

    // 로그인 페이지 접속
    cy.visit('/signin');
    // 아이디 입력란을 찾고 입력하기
    cy.get('input[name="userId"]').type(userId);
    // 비밀번호 입력란을 찾고 입력하기
    cy.get('input[name="userPwd"]').type(password);
    // 로그인 버튼 클릭
    cy.get('button[type="submit"]').click();

            // '판매하기' 버튼 클릭
            cy.get('button').contains('판매하기').click();

            // URL이 '/product/regist'로 변경되었는지 확인
            cy.url().should('include', '/product/regist');
      
            // 상품 등록 페이지 확인
            cy.contains('상품 정보').should('exist');
    });
  

    it('상품등록', () => {
        // 파일 두 개 선택하여 업로드
      const fileName1 = 'cider.jpg';
      const fileName2 = 'fanta.jpg';
      
      // 첫 번째 이미지 파일을 fixture로부터 읽어서 업로드
      cy.fixture(fileName1).then(fileContent => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: fileName1,
          mimeType: 'image/png'
        }, { subjectType: 'input' });
      });

      // 두 번째 이미지 파일을 fixture로부터 읽어서 업로드
      cy.fixture(fileName2).then(fileContent => {
        cy.get('input[type="file"]').attachFile({
          fileContent: fileContent.toString(),
          fileName: fileName2,
          mimeType: 'image/png'
        }, { subjectType: 'input' });
      });

      // 파일 업로드 후 검증 버튼 클릭
      cy.get('button').contains('이미지 검증').click();

      //상품명 입력
      cy.get('input[name="productName"]').type('새 상품');

      // 카테고리 선택
      cy.get('select[name="category"]').select('식품');

      // 설명 입력
      cy.get('textarea[name="description"]').type('이것은 테스트 상품입니다.');

      // 가격 입력
      cy.get('input[name="price"]').type('10000');

      // 거래 방식 체크박스 선택 (직거래)
      cy.get('[data-cy=direct-checkbox]').click();

      // 거래 장소 입력
      cy.get('input[name="transactionPlace"]').type('서울시 강남구');


      // 등록버튼 활성화 확인
      cy.get('button').contains('등록하기').should('not.be.disabled');

      //등록 - 실제 적용되므로 주석처리
      // cy.get('[data-cy=enroll-button]').click({ force: true });

    });

    it('이미지 검증으로 인한 등록불가', () => {
      // 파일 두 개 선택하여 업로드
    const fileName1 = 'checkTineye.jpg';
    const fileName2 = 'checkTineye2.jpg';
    
    // 첫 번째 이미지 파일을 fixture로부터 읽어서 업로드
    cy.fixture(fileName1).then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: fileName1,
        mimeType: 'image/png'
      }, { subjectType: 'input' });
    });

    // 두 번째 이미지 파일을 fixture로부터 읽어서 업로드
    cy.fixture(fileName2).then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: fileName2,
        mimeType: 'image/png'
      }, { subjectType: 'input' });
    });

    // 파일 업로드 후 검증 버튼 클릭
    cy.get('button').contains('이미지 검증').click();

    // 실패한 이미지 문구로 뜨는지 확인
    cy.get('[data-cy=check]').should('contain', '실패한 이미지들:');

    //등록하기 버튼 비활성화 상태인지 확인
    cy.get('button').contains('등록하기').should('be.disabled');

  });
  
   
  });