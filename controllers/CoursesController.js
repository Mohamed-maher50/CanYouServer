const Playlist = require("../model/playlists/playlists");
const Comment = require("../model/playlists/coments");
const CourseSubject = require("../model/playlists/Videos");

// create new playList
const createPlayList = async (req, res) => {
  try {
    // new Playlist model and insert data into it
    const newPlaylist = await new Playlist({
      author: req.userId,
      ...req.body,
    }).save();
    // save new Playlist
    //return new Playlist
    return res.status(200).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
// create new video into playList
const createSubject = async (req, res) => {
  try {
    // find author of this playlist
    const { author } = await Playlist.findById(req.body.playListId);
    //check if is owner of play list if true then allow to add
    // if not return 403 forbidden
    if (author != req.userId)
      return res.status(403).json({ msg: "some error" });
    // create new subject  and insert data into it
    const newCourseSubject = await new CourseSubject({
      ...req.body,
      author: req.userId,
    }).save();
    // return data in response status 200 ok
    return res.status(200).json(newCourseSubject);
  } catch (error) {
    res.status(500).json({ msg: "error" });
  }
};
// get all videos in specific playList
const getSubjects = async (req, res) => {
  try {
    const { students } = await Playlist.findById(req.params.id).select(
      "-_id students"
    );
    if (!students?.includes(req.userId))
      return res.status(403).json({ msg: "you are not from students" });
    let AllData = await CourseSubject.find({
      playListId: req.params.id,
    }).sort({ updatedAt: 1 });
    console.log(students);

    res.status(200).json(AllData);
  } catch (error) {
    res.status(501).json({ msg: "error happened" });
  }
};
const getMyPlayList = async (req, res) => {
  try {
    const allMyPlaylist = await Playlist.find({ author: req.userId }).select(
      "_id title"
    );
    res.status(200).json(allMyPlaylist);
  } catch (error) {
    res.status(500).json({ msg: "error happened" });
  }
};
// search in any playList
const SearchPlayList = async (req, res) => {
  try {
    // get query from url
    const query = req.query.playLists;
    //find any playlist his title or description  include query
    const allMyPlaylist = await Playlist.find({
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
    //if find then return result
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
      model: "Playlist",
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
    console.log(error);
    res.status(500).json({ msg: "error" });
  }
};
// enroll specific playlist
const enrollCourse = async (req, res) => {
  try {
    // find playList and this user to student
    // if user already join to this playlist will not allow to join author time
    await Playlist.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        students: req.userId,
      },
    });
    // response ok
    res.sendStatus(200);
  } catch (er) {
    res.status(500).json({ msg: "error" });
  }
};
const getPlayList = async (req, res) => {
  try {
    const playList = await Playlist.findById(req.params.id).populate({
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
    const playlists = await Playlist.find({
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
