// create a new express router
const express = require("express");
const router = express.Router();
const mainController = require("./controllers/main.controller");
const eventsController = require("./controllers/events.controller");
const { check } = require("express-validator");
// export router
module.exports = router;

// define routes
// main routes
router.get("/", mainController.showHome);

// events routes
router.get("/events", eventsController.showEvents);

// seed events
router.get("/events/seed", eventsController.seedEvents);

// create events
router.get("/events/create", eventsController.showCreate);
router.post(
  "/events/create",
  [
    check("name", "Name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
  ],
  eventsController.processCreate
);
// edit event
router.get("/events/:slug/edit", eventsController.showEdit);
router.post(
  "/events/:slug",
  [
    check("name", "Name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
  ],
  eventsController.processEdit
);
// delete events
router.get("/events/:slug/delete", eventsController.deleteEvent);
// show a single event
router.get("/events/:slug", eventsController.showSingle);
