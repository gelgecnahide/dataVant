/// <reference types = "cypress"/>
const testData = require("../fixtures/testData.json");

describe("comboios de portugal suite", () => {
  before(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it("verify are the input details of online tickets stored after cancelling the request", () => {
    cy.launchURL(Cypress.env("URL"));
    cy.verifyIsBuyTicketsURLLaunchedWithDefaultData();
    cy.inputPlacesIntoOnlineTickets(
      testData.startLocation,
      testData.arrivalLocation
    );

    cy.getDateWithOffset(testData.currentDay, testData.startDateOffset);
    cy.get("@formattedDate").then((currentOffsetDay) => {
      cy.getDateWithOffset(testData.StartDate, testData.startDateOffset);
      cy.get("@formattedDate").then((currentOffsetDate) => {
        cy.inputDepartDateIntoOnlineTickets(
          currentOffsetDay,
          currentOffsetDate
        );
      });
    });

    cy.getDateWithOffset(testData.currentDay, testData.returnDateOffset);
    cy.get("@formattedDate").then((returnFormattedDate) => {
      cy.getDateWithOffset(testData.StartDate, testData.returnDateOffset);
      cy.get("@formattedDate").then((returnFullDate) => {
        cy.inputReturnDateIntoOnlineTickets(
          returnFormattedDate,
          returnFullDate
        );
      });
    });

    cy.inputNumberOfPassengers(testData.passengersCount);
    cy.clickOnSubmitButton();

    cy.getDateWithOffset(testData.verifyDate, testData.startDateOffset);
    cy.get("@formattedDate").then((startDateMonth) => {
      cy.getDateWithOffset(testData.verifyDate, testData.returnDateOffset);
      cy.get("@formattedDate").then((returnDateMonth) => {
        cy.verifyDetailsAfterSubmittingRequest(
          startDateMonth,
          returnDateMonth,
          testData.passengersCount
        );
      });
    });

    cy.clickOnCancelButton();

    cy.getDateWithOffset(testData.StartDate, testData.startDateOffset);
    cy.get("@formattedDate").then((currentOffsetDate) => {
      cy.getDateWithOffset(testData.StartDate, testData.returnDateOffset);
      cy.get("@formattedDate").then((returnFullDate) => {
        cy.verifyDetailsAfterCancellingRequest(
          testData.startLocation,
          testData.arrivalLocation,
          currentOffsetDate,
          returnFullDate,
          testData.passengersCount
        );
      });
    });
  });
});
