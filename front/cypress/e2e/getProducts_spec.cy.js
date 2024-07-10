describe('Product Listing Page Tests', () => {
  beforeEach(() => {
    // 상품 조회 페이지 방문
    cy.visit('/products');
  });

  it('상품 조회 페이지 보이기', () => {
    cy.url().should('include', '/products');
  });

  it('전체 상품 보이기', () => {
    cy.get('[data-cy=product]').should('have.length.at.least', 1);
  });

  it('특정 상품 검색하기', () => {
    cy.get('input[placeholder="카테고리 내 검색"]').type('가방', { force: true });
    cy.get('[data-cy=search-button]').click({ force: true });
    cy.get('[data-cy=product]').should('have.length.at.least', 1);
  });
});
