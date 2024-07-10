describe('admin-page test', () => {
  beforeEach('로그인 후 관리자 페이지 접속', () => {
    const userId = 'jin';
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
    cy.visit(`/admin/${userId}`);
  });

  it('사용자 조회 메뉴가 기본으로 선택', () => {
    cy.get('[data-cy=selecteMenu-admin]').should('contain', '사용자 조회');
  });

  it('사용자 검색하기', () => {
    // 검색 입력란에 "텀" 입력
    cy.get('[data-cy=search-input-admin]').type('user', { force: true });
    // 검색 아이콘 클릭
    cy.get('[data-cy=search-btn-admin]').click({ force: true });
    // 검색 결과에 "텀블러" 있음
    cy.contains('user').should('exist');
  });
});