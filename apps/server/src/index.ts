import { User } from "./modules/user/user.entity.js";

console.log("Hello World!");

console.log(
  User.create({
    username: "test",
    password: "asdkfsdgkadfskj;gldksj",
  })
);
