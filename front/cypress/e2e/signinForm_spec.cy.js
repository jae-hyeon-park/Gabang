describe('로그인 폼 테스트', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('폼이 제대로 렌더링 되는지 확인', () => {
    cy.get('form').should('exist');
    cy.get('input[name="userId"]').should('be.visible');
    cy.get('input[name="userPwd"]').should('be.visible');
    cy.get('button[type="submit"]').contains('로그인').should('be.visible');
  });

  it('유효하지 않은 아이디와 비밀번호 입력 시 에러 메시지 보여주기', () => {
    cy.get('input[name="userId"]').type('a');
    cy.get('input[name="userPwd"]').type('1234');
    cy.get('button[type="submit"]').click();
    cy.get('form').should('contain', '아이디는 영어, 한글, 숫자 2~10자 이어야 합니다.');
    cy.get('form').should('contain', '비밀번호는 8~20자리의 영어, 숫자, 특수문자 조합이어야 합니다.');
  });

  it('유저가 성공적으로 로그인하는지 확인', () => {
    cy.get('input[name="userId"]').type('pjh');
    cy.get('input[name="userPwd"]').type('asdf123!');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/');
  });

  it('로그인 실패 시 모달이 표시되는지 확인', () => {
    cy.get('input[name="userId"]').type('wrongId');
    cy.get('input[name="userPwd"]').type('asdf123!');
    cy.get('button[type="submit"]').click();

    cy.get('[data-cy="modal-text"]').should('be.visible');
    cy.contains('가입 정보를 찾을 수 없습니다.').should('be.visible');
    cy.get('[data-cy="modal-button"]').contains('확인').click();
    cy.get('[data-cy="modal-text"]').should('not.exist');
  });
});
