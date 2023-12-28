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


/*
Please find the below points

Oddities noticed from the website from a functional or UX perspective:

1. Font in ticket submission flow has moderate UX.



2. Duration format should be modified from 09h29 to 09h 29m.



3. When we click on cancel button on options section page it navigated to home page - Is it expected?



4. The "Submit" button is not even visible when it is in a disabled state.



Changes to be made to the website for ease of implementation of a FE automation test suite:

1. The cookies should be presented at the bottom part



2. On the page where user purchase tickets the majority of the page is occupied by the headers, logo, and menu items
we must adjust these alignments to provide the user to choose user actions from application.



3. The homepage logo and header buttons are not properly aligned, there are extra spaces causing a misalignment.



4. And, if we have the customized locators for each field it would be good for automation scripts to identify the elements and perform user actions without any synchronization errors




Design & Architecture:

Design depends on the size of the project but in given project did some separation of selector by making mapping.js file in which user will define the all application input controls selector so if any change occur in future can handle from one file.



UI/UX: 

Have some issues like on home age ‘Online ticket’ is cutting background image. Moreover, some controls missing ids, classes for automation. Few errors in console.
For ease in automation define some classes/ids or custom attribute so developers can work on their concerns. Expose some backend API so can validate the data and other aspects better.
*/