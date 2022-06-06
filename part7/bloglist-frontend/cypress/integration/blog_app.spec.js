describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Testy McTesterson",
      username: "testuser",
      password: "testpassword",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("login form is shown", function () {
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  it("user can login", function () {
    cy.contains("login to application").click();
    cy.get("#username").type("testuser");
    cy.get("#password").type("testpassword");
    cy.get("#login-button").click();
    cy.contains("Testy McTesterson logged in");
  });

  it("login fails with wrong password", function () {
    cy.contains("login to application").click();
    cy.get("#username").type("root");
    cy.get("#password").type("wrongpassword");
    cy.get("#login-button").click();
    cy.get(".error").should("contain", "password");
    cy.get("html").should("not.contain", "Testy McTesterson logged in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "testuser", password: "testpassword" });
    });

    it("a new blog can be created", function () {
      cy.wait(500);
      cy.get(".toggleButtonShow").click();
      cy.get("#title").type("Test Title");
      cy.get("#author").type("Test Author");
      cy.get("#url").type("www.test-url.com");
      cy.get("#createNewBlog").click();
      cy.get("html").contains("Test Title Test Author");
    });

    it("an existing blog can be liked", function () {
      cy.createBlog({
        title: "Existing Blog Title",
        author: "Some Author",
        url: "www.google.com",
      });
      cy.contains("view").click();
      cy.contains("like").click();
      cy.contains("view").click();
      cy.get("html").contains("likes: 1");
    });

    it("a blog can be deleted by the user who created it", function () {
      cy.createBlog({
        title: "Existing Blog Title",
        author: "Some Author",
        url: "www.google.com",
      });
      cy.contains("view").click();
      cy.contains("delete").click();
      cy.get("html").should("not.contain", "Existing Blog Title Some Author");
    });

    it("the listed blogs are ordered according to likes with the most liked first", function () {
      cy.createBlog({
        title: "Title #1",
        author: "Author A",
        url: "www.google.com",
        likes: 1,
      });
      cy.createBlog({
        title: "Title #2",
        author: "Author B",
        url: "www.google.com",
        likes: 2,
      });
      cy.createBlog({
        title: "Title #3",
        author: "Author C",
        url: "www.google.com",
        likes: 3,
      });

      // Find all blog elements
      cy.contains("Title #1").parent().as("blog1");
      cy.contains("Title #2").parent().as("blog2");
      cy.contains("Title #3").parent().as("blog3");

      // Extract likes from blog elements
      cy.get("@blog1").contains("view").click();
      cy.get("@blog1").contains("like").as("like1");

      cy.get("@blog2").contains("view").click();
      cy.get("@blog2").contains("like").as("like2");

      cy.get("@blog3").contains("view").click();
      cy.get("@blog3").contains("like").as("like3");

      // Check order
      cy.get(".blog").then((b) => {
        cy.wrap(b[0]).contains("3");
        cy.wrap(b[1]).contains("2");
        cy.wrap(b[2]).contains("1");
      });
    });
  });
});
