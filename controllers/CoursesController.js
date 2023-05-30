const Courses = require("../model/Courses");
const Comment = require("../model/CourseComents");
const CourseSubject = require("../model/course");

// create new playList
const createPlayList = async (req, res) => {
  try {
    const newPlaylist = await new Courses({
      author: req.userId,
      ...req.body,
    }).save();
    return res.status(200).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
// create new video into playList
const createSubject = async (req, res) => {
  console.log(req.body.playListId);
  try {
    const { author } = await Courses.findById(req.body.playListId);

    if (author != req.userId)
      return res.status(403).json({ msg: "some error" });

    const newCourseSubject = await new CourseSubject({
      ...req.body,
      author: req.userId,
    }).save();

    return res.status(200).json(newCourseSubject);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error" });
  }
};
// get all videos in specific playList
const getSubjects = async (req, res) => {
  try {
    const { students } = await Courses.findById(req.params.playListId).select(
      "-_id students"
    );

    if (!students?.includes(req.userId))
      return res.status(403).json({ msg: "you are not from students" });
    let AllData = await CourseSubject.find({
      playListId: req.params.playListId,
    }).sort({ updatedAt: 1 });

    res.status(200).json(AllData);
  } catch (error) {
    res.status(501).json({ msg: "error happened" });
  }
};
const getMyPlayList = async (req, res) => {
  try {
    const allMyPlaylist = await Courses.find({ author: req.userId }).select(
      "_id title"
    );
    res.status(200).json(allMyPlaylist);
  } catch (error) {
    res.status(501).json({ msg: "error happened" });
  }
};
// search in any playList
const SearchPlayList = async (req, res) => {
  try {
    const query = req.query.playLists;
    const allMyPlaylist = await Courses.find({
      $or: [
        {
          title: {
            $regex: `^((?!${query}).)*$`,
            $options: "i",
          },
        },
        {
          desc: {
            $regex: `^((?!${query}).)*$`,
            $options: "i",
          },
        },
      ],
    });
    res.status(200).json(allMyPlaylist);
  } catch (error) {
    res.status(501).json({ msg: "error happened" });
  }
};
const completed = async (req, res) => {
  try {
    // check if this user already from students
    const { playListId } = await CourseSubject.findById(
      req.params.courseId
    ).populate({
      path: "playListId",
      select: "students",
      model: "CoursesPlaylist",
    });

    if (!playListId.students.includes(req.userId))
      return res.status(401).json({ msg: "not authorized" });
    // push him into completed
    await CourseSubject.findByIdAndUpdate(req.params.courseId, {
      $addToSet: {
        completed: req.userId,
      },
    });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
const enrollCourse = async (req, res) => {
  try {
    await Courses.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        students: req.userId,
      },
    });
    res.sendStatus(200);
  } catch (er) {
    res.status(500).json({ msg: "error" });
  }
};
const getPlayList = async (req, res) => {
  try {
    const playList = await Courses.findById(req.params.playlistId).populate({
      path: "author",
      select: "fullName",
      model: "Users",
    });

    res.status(200).json(playList);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { stars, feedBack } = req.body;
    const course = await CourseSubject.findById(id)
      .select("-_id playListId")
      .populate("playListId");
    if (!course.playListId?.students?.includes(req.userId))
      return res.status(403).json({ msg: "unauthorized access" });
    await new Comment({
      author: req.userId,
      Course: id,
      stars,
      feedBack,
    }).save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const getComments = async (req, res) => {
  try {
    const { CourseId } = req.params;

    const course = await CourseSubject.findById(CourseId)
      .select("-_id playListId")
      .populate("playListId");
    if (!course.playListId?.students?.includes(req.userId))
      return res.status(403).json({ msg: "unauthorized access" });

    const data = await Comment.find({ Course: CourseId }).populate({
      path: "author",
      select: "fullName AvatarUrl",
      model: "Users",
    });

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};
const getMyEnrolledPlayLists = async (req, res) => {
  try {
    const playlists = await Courses.find({
      students: { $in: [req.userId] },
    });

    res.status(200).send(playlists);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
module.exports = {
  getMyEnrolledPlayLists,
  getPlayList,
  completed,
  enrollCourse,
  getMyPlayList,
  getSubjects,
  SearchPlayList,
  createPlayList,
  createSubject,
  addComment,
  getComments,
};
