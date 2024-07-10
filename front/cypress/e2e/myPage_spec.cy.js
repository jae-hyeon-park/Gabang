describe('my-page test', () => {
  beforeEach('로그인 후 마이 페이지 접속', () => {
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
    // 마이 페이지 접속
    cy.wait(200);
    cy.visit(`/my/${userId}`);
  });

  it('판매 내역 탭이 기본으로 선택', () => {
    cy.get('[data-cy=selecteMenu-my]').should('contain', '판매 내역');
  });

  it('판매 상품 검색하기', () => {
    // 검색 입력란에 "텀" 입력
    cy.get('[data-cy=search-input-my]').type('텀', { force: true });
    // 검색 아이콘 클릭
    cy.get('[data-cy=search-btn-my]').click({ force: true });
    // 검색 결과에 "텀블러" 있음
    cy.contains('텀블러').should('exist');
  });
});