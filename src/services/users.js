import User from '../models/user';

const getUser = async (id) => {
  return await User.findById(id).populate(["imageProfile", "imageCover"]).select('-password');
};
module.exports = {
  getUser
}