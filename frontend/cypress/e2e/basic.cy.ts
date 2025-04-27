describe("Site Actions", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("/");
    cy.get("h2").should(
      "contain",
      "Please log in to view your anime dashboard"
    );
    cy.get("button").contains("Sign In").click();
    cy.get("input[id='username']").type("admin");
    cy.get("input[id='password']").type("admin");
    cy.get("button[type='submit']").click();
  });

  it("should let the user have a watchlist", () => {
    cy.visit("/watchlist");
    cy.get("a").should("contain", "Naruto");
  });

  it("should recommend anime to the user", () => {
    cy.visit("/");
    cy.reload();

    cy.get("[data-testid='recommendations']", { timeout: 10000 })
      .should("exist")
      .find("[data-testid='mini-card']");
  });

  it.only("should let the user add an anime to their watchlist", () => {
    cy.visit("/");

    cy.reload();

    cy.get("[data-testid='recommendations']", { timeout: 10000 })
      .should("exist")
      .find("[data-testid='mini-card']");

    let firstMiniCardTitle;
    cy.get("[data-testid='mini-card']")
      .first()
      .find("a")
      .invoke("text")
      .then((text) => {
        firstMiniCardTitle = text;

        cy.get("[data-testid='mini-card']")
          .first()
          .find("a")
          .click({ force: true });

        cy.get("[data-testid='watchlist-status-select']")
          .should("exist")
          .click();
        cy.get("li").contains("Watching").click();
        cy.get("button").contains("Add").click();

        cy.visit("/watchlist");
        cy.get("a").should("contain", firstMiniCardTitle);
      });
  });
});
