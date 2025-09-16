type AuthResponse = {
  jwt: string;
};

type User = {
  email: string;
  firstName: string;
  lastName: string;
  id: number;
};

const protectedRoute = "/";
const loginRoute = "/login";

describe("The Login Page Flow", () => {
  it("successfully loads", () => {
    cy.visit(Cypress.env("apiUrl")); // change URL to match your dev URL
  });

  const mockUser = {
    email: Cypress.env("testEmail"),
    password: Cypress.env("testPassword"),
    firstName: "Test User",
    lastName: "user",
  };

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.visit(Cypress.env("apiUrl"));

    const mockAuthResponse: AuthResponse = {
      jwt: Cypress.env("testJwt"),
    };

    cy.intercept("POST", Cypress.env("graphQlUrl"), (req) => {
      if (req.body.query.includes("mutation userLogin")) {
        req.alias = "loginRequest";
        req.reply({
          statusCode: 200,
          body: {
            data: {
              login: mockAuthResponse,
            },
          },
        });
      }

      if (req.body.query.includes("query userData")) {
        req.alias = "userDataRequest";
        req.reply({
          statusCode: 200,
          body: {
            data: { user: mockUser },
          },
        });
      }
    });
  });

  it("should display login form correctly", () => {
    // cy.get("form").should("exist");
    cy.get('[data-cy="email"]').should("exist");
    cy.get('[data-cy="password"]').should("exist");
    cy.get('[data-cy="submit"]').should("exist").and("contain", "Login");
  });

  it("should check mandatory fields", () => {
    cy.get('[data-cy="submit"]').click();
    // cy.get('[data-cy="email"]').should("have.attr", "aria-invalid", "true");
    cy.contains("Field is required");
  });

  it("should show error for invalid email format", () => {
    cy.get('[data-cy="email"]').type("invalid-email@");
    cy.get('[data-cy="password"]').type(Cypress.env("testPassword"));
    cy.get('[data-cy="submit"]').click();

    cy.contains("invalid email address");
  });

  it("should handle login failure", () => {
    cy.intercept("POST", Cypress.env("graphQlUrl"), (req) => {
      if (req.body.query.includes("mutation userLogin")) {
        req.reply({
          statusCode: 200,
          body: {
            errors: [
              {
                message: "Bad Request",
                path: ["login"],
                extensions: {
                  code: "VALIDATION_ERROR",
                  field: "email",
                },
              },
            ],
            data: null,
          },
        });
      }
    }).as("failedLogin");

    cy.get('[data-cy="email"]').type("wrong@email.com");
    cy.get('[data-cy="password"]').type("wrongpassword");
    cy.get('[data-cy="submit"]').click();

    cy.wait("@failedLogin");
    cy.contains("Invalid user or password").should("be.visible");
    cy.url().should("include", loginRoute);
  });

  it("should successfully login with typed credentials", () => {
    cy.get<HTMLInputElement>('[data-cy="email"]')
      .type(mockUser.email)
      .should("have.value", mockUser.email);

    cy.get<HTMLInputElement>('[data-cy="password"]').type(mockUser.password);

    cy.get<HTMLButtonElement>('[data-cy="submit"]').click();

    cy.wait("@loginRequest").then((interception) => {
      const requestJwt: AuthResponse = interception.response.body.data.login;
      expect(requestJwt.jwt).to.equal(Cypress.env("testJwt"));
    });

    cy.window().its("localStorage.token").should("exist");

    cy.wait("@userDataRequest").then((interception) => {
      expect(interception.request.headers).to.have.property("authorization");
      expect(interception.request.headers.authorization).to.include("Bearer");
    });

    cy.contains(mockUser.email).should("be.visible");
    cy.contains(mockUser.firstName).should("be.visible");
    cy.contains(mockUser.lastName).should("be.visible");
    cy.get("button").contains("Logout").should("exist");
  });

  it("should logout successfully", () => {
    cy.get('[data-cy="email"]').type(mockUser.email);
    cy.get('[data-cy="password"]').type(mockUser.password);
    cy.get('[data-cy="submit"]').click();

    cy.wait("@loginRequest");
    cy.url().should("include", protectedRoute);

    cy.get("button").contains("Logout").click();

    cy.window().its("localStorage.token").should("not.exist");

    cy.url().should("include", loginRoute);
  });

  it("should redirect to login when accessing protected route without token", () => {
    cy.visit(protectedRoute);
    cy.url().should("include", loginRoute);
  });
});
