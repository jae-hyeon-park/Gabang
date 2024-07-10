
describe('채팅 테스트', () => {
    beforeEach(() => {
        const userId = 'jin';
        const password = 'asdf123!';

        cy.visit('/signin');
        cy.get('input[name="userId"]').type(userId);
        cy.get('input[name="userPwd"]').type(password);
        cy.get('button[type="submit"]').click();  
    });
  
    it('헤더에 있는 채팅목록 클릭 시 채팅목록 모달 열리는지 확인', () => {
        cy.get('[data-cy="open-chatList-button"]').should('not.be.disabled');
        cy.get('[data-cy="open-chatList-button"]').click();
    });


    it ('상품 상세페이지에서 채팅하기 클릭 시 채팅화면 나오는지 확인', () => {
        cy.get('[data-cy="main-product"]').first().click({ force: true });
        cy.get('[data-cy="open-chat-button"]').should('not.be.disabled');
        cy.get('[data-cy="open-chat-button"]').click({ force: true });
        cy.wait(2000);
        cy.get('[data-cy="chat-modal"]').should('be.visible');
    });    
  });