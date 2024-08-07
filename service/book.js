const db = uniCloud.database();
const _ = db.command;
const bookCollection = db.collection("account-book");

export const updateTagList = async (id, tagList) => {
  return await bookCollection.doc(id).update({
    tagList,
  });
};
