const router = require("express").Router();

const {
  Avatar,
  SearchUsers,
  SendFollow,
  firstVisit,
  getFriends,
  UpRate,
  Details,
} = require("../../controllers/userControllers");
const { protect } = require("../../utils/protect");

router.get("/friends", protect, getFriends);
//
router.post("/done", UpRate);

//to upload user picture
router.patch("/img", protect, Avatar);

// to search on users
router.get("/search", protect, SearchUsers);

//this route provide information for first visit user
router.patch("/firstVisit", protect, firstVisit);

//deep route
router.use("/skills", require("./skills"));

// send follow or un follow this request depend on toggle behavior
router.put("/follow/:id", protect, SendFollow);

// get user details
router.get("/:id", protect, Details);

module.exports = router;
