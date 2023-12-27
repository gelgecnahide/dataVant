///<reference types = "cypress"/>
const { format, addDays } = require("date-fns");

//locators
const trainTimesMenuLink = ".first-menu [href*='train-times']";
const buyTicketsMenuLink = ".first-menu [href*='buy-tickets']";
const buyLeisureMenuLink = ".first-menu [href*='buy-leisure']";
const howToTravelMenuLink = ".first-menu [href*='how-to-travel']";
const discountsAndBenefitsMenuLink = ".first-menu [href*='discounts-benefits']";
const logoImageMenuLink = ".navbar-brand [alt*='logo']";
const searchFieldMenuLink = "[placeholder='Search']";
const buyTicketsLink = ".second-menu [href*='buy-tickets']";
const onlineTicketsText = "Online Tickets";
const onlineTicketOfficeTermsAndConditionsText =
  "Online ticket office terms and conditions";
const discountsOverlay = ".carousel-swipe";
const fromPlaceField = "[placeholder*='From'][title*='From']";
const toPlaceField = "[placeholder*='To'][title*='To']";
const submitButton = "[value*='Submit']";
const departDate = "[name='departDate']";
const returnDate = "[name='returnDate']";
const onlineTicketOffice = "Online Ticket Office";
const searchText = "Search";
const serviceText = "Service";
const optionsText = "Options";
const seatsText = "Seats";
const dataText = "Data";
const paymentText = "Payment";
const ticketsText = "Tickets";
const outwardText = "OUTWARD";
const inwardText = "INWARD";
const tableCell = ".table-search-results td";
const cancelButton = "[value*='Cancel']";
const comfortType = "#option1";
const touristType = "#option2";
const alfaPendular = "[name='AP']";
const intercidades = "[name='IC']";
const regional = "[name='R']";
const urban = "[name='U']";
const passengersFieldForSinglePassenger = "[data-id*='passageiros']";
const placeDropdown = ".typeahead.dropdown-menu";
const returnDateSibling = ".picker.picker--focused.picker--opened";
const passengersFieldForMultiplePassengers = '.dropdown-menu [role="menu"]';
const passengerCountInDetails = ".reserveDiv";
const dateCell = "[role='gridcell']";
const dateCells =
  "[class*='opened'] tbody [class*='picker__day picker__day--infocus']";
const dateField = '[placeholder="Date"]';
const todayBtn = ".picker--opened .picker__button--today";
const currentMonth = "#datepicker-first_root .picker__month";
const currentYear = "#datepicker-first_root .picker__year";
const activeDay = '#datepicker-first_root [aria-activedescendant="true"]';
const cookieBtn = ".btn-sm.btn-primary.btn-green";
const nextMonthButton = "[class*='opened'] .picker__nav--next";

//commands

Cypress.Commands.add("getCurrentFulldate", () => {
  cy.get(activeDay)
    .invoke("text")
    .then((day) => {
      cy.get(currentMonth)
        .invoke("text")
        .then((month) => {
          cy.get(currentYear)
            .invoke("text")
            .then((year) => {
              const value = `${day} ${month}, ${year}`;
              cy.wrap(value).as("todayDate");
            });
        });
    });
});

Cypress.Commands.add("getDateWithOffset", (dateFormat, offset) => {
  cy.get("@todayDate").then((data) => {
    const currentDate = data;
    const futureDate = addDays(currentDate, offset);
    const formattedDate = format(futureDate, dateFormat);
    cy.wrap(formattedDate).as("formattedDate");
  });
});

Cypress.Commands.add("launchURL", (URL) => {
  cy.visit(URL);
  cy.url().should("contain", URL);
  cy.get(trainTimesMenuLink).should("be.visible");
  cy.get(buyTicketsMenuLink).should("be.visible");
  cy.get(buyLeisureMenuLink).should("be.visible");
  cy.get(howToTravelMenuLink).should("be.visible");
  cy.get(discountsAndBenefitsMenuLink).should("be.visible");
  cy.get(logoImageMenuLink).should("be.visible");
  cy.get(searchFieldMenuLink).should("be.visible");
  cy.get(cookieBtn).should("exist").click();
});

Cypress.Commands.add("verifyIsBuyTicketsURLLaunchedWithDefaultData", () => {
  cy.get(buyTicketsLink).should("be.visible");
  cy.contains(onlineTicketsText).should("be.visible");
  cy.contains(onlineTicketOfficeTermsAndConditionsText).should("be.visible");
  cy.get(discountsOverlay).should("be.visible");
  cy.get(fromPlaceField).should("be.visible");
  cy.get(toPlaceField).should("be.visible");
  cy.get(submitButton).should("be.visible").should("be.disabled");
  cy.get(departDate).should("be.visible");
  cy.get(returnDate).should("be.visible");
  cy.get(touristType)
    .parent()
    .invoke("attr", "class")
    .should("contain", "active");
  cy.get(comfortType)
    .parent()
    .invoke("attr", "class")
    .should("not.contain", "active");
  cy.get(alfaPendular).should("be.visible").should("be.checked");
  cy.get(intercidades).should("be.visible").should("be.checked");
  cy.get(regional).should("be.visible").should("be.checked");
  cy.get(urban).should("be.visible").should("be.checked");
  cy.get(toPlaceField).should("be.empty");
  cy.get(fromPlaceField).should("be.empty");
  cy.getCurrentFulldate();
  cy.get("@todayDate").then(($el) => {
    const currentDate = $el;
    cy.get(departDate).should("have.value", currentDate);
  });

  cy.get(returnDate).should("be.empty");
});

Cypress.Commands.add(
  "inputPlacesIntoOnlineTickets",
  (departurePlace, returnPlace) => {
    cy.get(fromPlaceField).should("be.visible").type(departurePlace);
    cy.get(placeDropdown).eq(0).click();
    cy.get(fromPlaceField)
      .should("be.visible")
      .should("have.value", departurePlace);
    cy.get(toPlaceField).should("be.visible").type(returnPlace);
    cy.get(placeDropdown).eq(1).click();
    cy.get(toPlaceField).should("be.visible").should("have.value", returnPlace);
  }
);

function selectDate(departureOffset, row, column) {
  let dateClicked = false;
  const dateSelector = `[class*='opened'] tr:nth-child(${row}) td:nth-child(${column}) div`;
  cy.get(dateSelector)
    .invoke("text")
    .then(($dateVal) => {
      cy.log($dateVal);
      cy.get(dateSelector)
        .invoke("attr", "class")
        .then(($classVal) => {
          if (
            $dateVal === departureOffset &&
            $classVal === "picker__day picker__day--infocus"
          ) {
            cy.get(dateSelector).click({ force: true });
            dateClicked = true;
          } else {
            if (column < 7 && !dateClicked && $dateVal !== departureOffset) {
              selectDate(departureOffset, row, column + 1);
            } else if (row <= 6 && !dateClicked) {
              if (
                $classVal === "picker__day picker__day--outfocus" &&
                !$classVal.includes("disabled")
              ) {
                cy.log("************************", $classVal);
                cy.get(nextMonthButton).should("be.visible").click();
                selectDate(departureOffset, 1, 1);
              } else {
                selectDate(departureOffset, row + 1, 1);
              }
            }
          }
        });
    });
}

Cypress.Commands.add(
  "inputDepartDateIntoOnlineTickets",
  (formattedDate, fullDate) => {
    cy.get(departDate).should("be.visible").click({ force: true });
    const day = formattedDate.replace(/^0*/, "");
    selectDate(day, 1, 1);
    const fullDay = fullDate.replace(/^0*/, "");
    cy.get(departDate).should("be.visible").should("have.value", fullDay);
  }
);

Cypress.Commands.add(
  "inputReturnDateIntoOnlineTickets",
  (formattedDate, fullDate) => {
    cy.get(returnDate).should("be.visible").click({ force: true });
    const day = formattedDate.replace(/^0*/, "");
    selectDate(day, 1, 1);
    const fullDay = fullDate.replace(/^0*/, "");
    cy.get(returnDate).should("be.visible").should("have.value", fullDay);
  }
);

Cypress.Commands.add("inputNumberOfPassengers", (passengerNumber) => {
  cy.get(passengersFieldForSinglePassenger).should("be.visible").click();
  if (passengerNumber === String(1)) {
    cy.get(passengersFieldForSinglePassenger)
      .contains(passengerNumber + " passenger", { matchCase: false })
      .should("exist")
      .click();
  } else {
    cy.get(passengersFieldForMultiplePassengers)
      .contains(passengerNumber + " passengers", { matchCase: false })
      .should("exist")
      .click();
  }
});

Cypress.Commands.add("clickOnSubmitButton", () => {
  cy.get(submitButton).should("be.visible").should("be.enabled").click();
});

Cypress.Commands.add(
  "verifyDetailsAfterSubmittingRequest",
  (fulldate3, fulldate5, passengerCount) => {
    cy.contains(onlineTicketOffice).should("be.visible");
    cy.contains(searchText).should("be.visible");
    cy.contains(serviceText)
      .should("exist")
      .parent()
      .invoke("attr", "class")
      .should("contain", "active");
    cy.contains(optionsText).should("exist");
    cy.contains(seatsText).should("exist");
    cy.contains(dataText).should("exist");
    cy.contains(paymentText).should("exist");
    cy.contains(ticketsText).should("exist");
    cy.contains(outwardText).should("exist");
    cy.contains(inwardText).should("exist");
    cy.get(tableCell)
      .contains("lagos", { matchCase: false })
      .should("be.visible");
    cy.get(tableCell)
      .contains("porto - campanha", { matchCase: false })
      .should("exist");
    cy.get(tableCell).contains(fulldate3).should("be.visible");
    cy.get(tableCell).contains(fulldate5).should("exist");
    cy.get(passengerCountInDetails)
      .contains(passengerCount)
      .should("be.visible");
  }
);

Cypress.Commands.add("clickOnCancelButton", () => {
  cy.get(cancelButton).should("be.visible").should("be.enabled").click();
});

Cypress.Commands.add(
  "verifyDetailsAfterCancellingRequest",
  (fromPlace, toPlace, formattedDate3, formattedDate5, passengerCount) => {
    cy.get(fromPlaceField).should("be.visible").should("have.value", fromPlace);
    cy.get(toPlaceField).should("be.visible").should("have.value", toPlace);
    const day = formattedDate3.replace(/^0*/, "");
    cy.get(departDate).should("be.visible").should("have.value", day);
    const fullDay = formattedDate5.replace(/^0*/, "");
    cy.get(returnDate).should("be.visible").should("have.value", fullDay);
    cy.get(touristType)
      .parent()
      .invoke("attr", "class")
      .should("contain", "active");
    cy.get(comfortType)
      .parent()
      .invoke("attr", "class")
      .should("not.contain", "active");
    cy.get(alfaPendular).should("be.visible").should("be.checked");
    cy.get(intercidades).should("be.visible").should("be.checked");
    cy.get(regional).should("be.visible").should("be.checked");
    cy.get(urban).should("be.visible").should("be.checked");
    cy.contains(passengerCount).should("exist");
  }
);
