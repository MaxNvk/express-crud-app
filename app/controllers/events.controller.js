const Event = require("../models/event");
const { validationResult } = require("express-validator");

module.exports = {
  showEvents,
  showSingle,
  seedEvents,
  showCreate,
  processCreate,
  showEdit,
  processEdit,
  deleteEvent,
};

/**
 * Show all events
 */
function showEvents(req, res) {
  // get all events
  Event.find({}, (err, events) => {
    if (err) {
      res.status(404);
      res.send("Events not found!");
    }

    // return view with data
    res.render("pages/events", {
      events,
      success: req.flash("success"),
    });
  });
}

/**
 * Show a single event
 */
function showSingle(req, res) {
  // get a single event
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    if (err) {
      res.status(404);
      res.send("Event not found!");
    }

    res.render("pages/single", {
      event,
      success: req.flash("success"),
    });
  });
}

/**
 * Seed the database
 */
function seedEvents(req, res) {
  // create some events
  const events = [
    {
      name: "Basketball",
      description: "Throwing into basket.",
    },
    {
      name: "Swimming",
      description: "Michael is the fast fish.",
    },
    {
      name: "Wrestling",
      description: "Wrestling is theatre.",
    },
    {
      name: "PingPong",
      description: "Super fast pingpong.",
    },
  ];

  // user the Event model to insert/save
  Event.remove({}, () => {
    for (event of events) {
      let newEvent = new Event(event);

      newEvent.save();
    }
  });

  // seeded!
  res.send("Database seeded!");
}

/**
 * Show the create form
 */
function showCreate(req, res) {
  res.render("pages/create", {
    errors: req.flash("errors"),
  });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
  const { name, description } = req.body;

  // if there are errors, redirect and save errors to flash
  const errors = validationResult(req);

  if (errors.errors.length) {
    req.flash(
      "errors",
      errors.errors.map((err) => err.msg)
    );
    return res.redirect("/events/create");
  }

  const event = new Event({
    name,
    description,
  });

  // save event
  event.save((err) => {
    if (err) {
      throw err;
    }

    // show a successful flash-message
    req.flash("success", "Successfuly created event!");

    // redirect to the newely created event
    res.redirect(`/events/${event.slug}`);
  });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    res.render("pages/edit", {
      event,
      errors: req.flash("errors"),
    });
  });
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
  const { name, description } = req.body;

  // if there are errors, redirect and save errors to flash
  const errors = validationResult(req);

  if (errors.errors.length) {
    req.flash(
      "errors",
      errors.errors.map((err) => err.msg)
    );
    return res.redirect(`/events/${req.params.slug}/edit`);
  }

  //finding a current event
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    // updating event
    event.name = name;
    event.description = description;

    event.save((err) => {
      if (err) {
        throw err;
      }

      req.flash("success", "Successfuly updated event.");
      res.redirect("/events");
    });
  });
}

function deleteEvent(req, res) {
  Event.remove({ slug: req.params.slug }, (err) => {
    if (err) {
      throw err;
    }

    req.flash("success", "Event deleted!");
    res.redirect("/events");
  });
}
