const tutorials = require("../controllers/tutorialController.js");
let router = require("express").Router();


// Create a new Tutorial
    router.post("/", tutorials.createTutorial);
  
    // Retrieve all Tutorials
    router.get("/", tutorials.findAll);
  
    // Retrieve all published Tutorials
    router.get("/published", tutorials.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne);
  
    // Update a Tutorial with id
    router.put("/update", tutorials.updateTutorial);
  
    // Delete a Tutorial with id
    router.delete("/delete", tutorials.deleteTutorial);
  
    // Delete all Tutorials
    router.delete("/", tutorials.deleteAll);
    
    
    module.exports = router