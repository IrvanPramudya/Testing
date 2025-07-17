describe("API Testing with Fixture - Single Flow", () => {
  let authData;
  let createdUserId;

  before(() => {
    cy.fixture("auth.json").then((auth) => {
      authData = auth;
    });
  });

  it("Complete User CRUD Flow", () => {
    // 1. Generate random data
    const randomId = Date.now();
    const userData = {
      email: `user${randomId}@example.com`,
      name: `User${randomId}`,
      gender: "male",
      status: "active",
    };

    // 2. POST - Create User
    cy.request({
      method: "POST",
      url: `${Cypress.config("baseUrl")}/public/v2/users`,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "application/json",
      },
      body: userData,
    }).then((postResponse) => {
      expect(postResponse.status).to.eq(201);
      createdUserId = postResponse.body.id;

      // 3. GET - Verify Created User
      cy.request({
        method: "GET",
        url: `${Cypress.config("baseUrl")}/public/v2/users/${createdUserId}`,
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.body.email).to.eq(userData.email);

        // 4. PUT - Update User
        const updatedData = {
          name: `UpdatedUser${randomId}`,
          email: `updated${randomId}@example.com`,
          gender: "female",
          status: "inactive",
        };

        cy.request({
          method: "PUT",
          url: `${Cypress.config("baseUrl")}/public/v2/users/${createdUserId}`,
          headers: {
            Authorization: `Bearer ${authData.token}`,
            "Content-Type": "application/json",
          },
          body: updatedData,
        }).then((putResponse) => {
          expect(putResponse.status).to.eq(200);
          expect(putResponse.body.email).to.eq(updatedData.email);

          // 5. DELETE - Clean Up
          cy.request({
            method: "DELETE",
            url: `${Cypress.config(
              "baseUrl"
            )}/public/v2/users/${createdUserId}`,
            headers: {
              Authorization: `Bearer ${authData.token}`,
            },
          }).then((deleteResponse) => {
            expect(deleteResponse.status).to.eq(204);
          });
        });
      });
    });
  });
});
