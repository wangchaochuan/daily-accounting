//获取数据库对象
const db = uniCloud.database();
const dbCmd = db.command;
const $ = dbCmd.aggregate;
// user表
const bookCollection = db.collection("account-book");

async function getBooks(userId) {
  if (!userId) {
    return {
      errCode: 10001,
      errMsg: "参数错误: 缺少必要的参数userId",
    };
  }
  const response = await bookCollection
    .aggregate()
    .match({
      members: dbCmd.elemMatch(dbCmd.eq(userId)),
    })
    .lookup({
      from: "account-user",
      let: {
        members: "$members",
      },
      pipeline: $.pipeline()
        .match(dbCmd.expr($.in(["$_id", "$$members"])))
        .project({
          _id: 1,
          "avatar.url": 1,
          nick_name: 1,
        })
        .done(),
      as: "members",
    })
    .end();
  return {
    errCode: 0,
    errMsg: "查询成功",
    data: response.data,
  };
}
// 检车账本名称是否唯一
async function checkName(name, userId) {
  const response = await bookCollection
    .where({
      name,
      creator: userId,
    })
    .get();
  return response.data.length > 0;
}

async function createBook(name, userId, type = "private") {
  if (!name) {
    return {
      errCode: 10001,
      errMsg: "参数错误: 缺少必要的参数name",
    };
  }
  const exist = await checkName(name, userId);
  if (exist) {
    return {
      errCode: 10002,
      errMsg: "同一用户下存在同名的账本，请修改账本名称",
    };
  }
  const response = await bookCollection.add({
    type,
    name,
    creator: userId,
    members: [userId],
    expendClassify: [
      "餐饮",
      "买菜",
      "水果",
      "宝宝",
      "网购",
      "交通",
      "居家",
      "医疗",
      "零食",
      "房贷",
      "房租",
      "其他",
    ],
    incomeClassify: [
      "工资",
      "奖金",
      "理财",
      "兼职",
      "人情",
      "转账",
      "红包",
      "其他",
    ],
  });
  return {
    errCode: 0,
    errMsg: "新增成功",
    data: response,
  };
}

async function deleteBook(id) {
  if (!id) {
    return {
      errCode: 10001,
      errMsg: "参数错误: 缺少必要的参数id",
    };
  }
  const response = await bookCollection.doc(id).remove();
  return {
    errCode: 0,
    errMsg: "删除成功",
  };
}

async function updateBook(id, book) {
  if (!book || !id) {
    return {
      errCode: 10001,
      errMsg: "参数错误: 缺少必要的参数",
    };
  }
  // 如果更新了账本名称,则需要做账本同名校验
  if (book.name && book.creator) {
    const exist = await checkName(book.name, book.creator);
    if (exist) {
      return {
        errCode: 10002,
        errMsg: "同一用户下存在同名的账本，请修改账本名称",
      };
    }
  }
  if (book._id) {
    delete book._id;
  }
  const response = await bookCollection.doc(id).update(book);
  return {
    errCode: 0,
    errMsg: "更新成功",
    data: response,
  };
}

async function addBookMembers(id, user) {
  if (!id) {
    return {
      errCode: 10001,
      errMsg: "参数错误: 缺少必要的参数",
    };
  }
  const response = await bookCollection.doc(id).update({
    members: dbCmd.push(user),
  });
  return {
    errCode: 0,
    errMsg: "更新成功",
    data: response,
  };
}

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  addBookMembers,
};
