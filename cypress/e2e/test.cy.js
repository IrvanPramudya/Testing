describe("API Testing with Fixture", () => {
  let authData, idUser;

  before(() => {
    cy.fixture("auth.json").then((auth) => {
      authData = auth;
    });
  });
  //POST New User
  it("POST Request - Create New User", () => {
    const apiUrl = `${Cypress.config("baseUrl")}/public/v2/users`;
    const randNumber = (
      Math.floor(Math.random() * 900000000) + 100000000
    ).toString();
    const userData = {
      email: `TryUser${randNumber}New@rocketmail.com`,
      name: `NewUser${randNumber}`,
      gender: "male",
      status: "active",
    };

    // Debugging - log the full request details
    Cypress.log({
      name: "API Request",
      message: `POST ${apiUrl}`,
      consoleProps: () => ({url: apiUrl, data: userData}),
    });

    cy.request({
      method: "POST",
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${authData.token}`,
        "Content-Type": "application/json",
      },
      body: userData,
      log: true, // enable detailed logging
    }).then((response) => {
      expect(response.status).to.eq(201);
      idUser = response.body.id;
    });
  });
  //GET Detail Data User
  it("GET Request - Show Detail Data from User", () => {
    cy.request({
      method: "GET",
      url: `${Cypress.config("baseUrl")}/public/v2/users/${idUser}`,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.headers).to.have.property(
        "content-type",
        "application/json; charset=utf-8"
      );
    });
  });
  //PUT Update Existing User
  it("PUT Request - Update Existing User", () => {
    const randNumber = (
      Math.floor(Math.random() * 900000000) + 100000000
    ).toString();
    cy.request({
      method: "PUT",
      url: `${Cypress.config("baseUrl")}/public/v2/users/${idUser}`,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
      body: {
        mode: "raw",
        raw: JSON.stringify({
          name: `User${randNumber}`,
          email: `User${randNumber}@gmail.com`,
          gender: "male",
          status: "active",
        }),
      },
    }).then((response) => {
      idUser = response.body.id;
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("id");
      expect(response.headers).to.have.property(
        "content-type",
        "application/json; charset=utf-8"
      );
    });
  });
  //DELETE delete Existing User
  it("DELETE Request - delete Existing User", () => {
    cy.request({
      method: "DELETE",
      url: `${Cypress.config("baseUrl")}/public/v2/users/${idUser}`,
      headers: {
        Authorization: `Bearer ${authData.token}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(204);
    });
  });
});
