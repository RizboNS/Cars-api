const express = require("express");
// const router = express.Router()
const router = require("express-promise-router")();
const verify = require("../routes/verifyToken");
const storage = require("../helpers/storage");
const UsersController = require("../controllers/users");

const {
  validateParam,
  schemas,
  validateBody,
} = require("../helpers/routeHelpers");

router.route("/").get(UsersController.index);
router
  .route("/register")
  .post(validateBody(schemas.userSchema), UsersController.newUser);
router
  .route("/login")
  .post(validateBody(schemas.userLoginSchema), UsersController.userLogin);

router
  .route("/:userId")
  .get(validateParam(schemas.idSchema, "userId"), UsersController.getUser)
  .put(
    [
      validateParam(schemas.idSchema, "userId"),
      validateBody(schemas.userSchema),
    ],
    UsersController.replaceUser
  )
  .patch(
    [
      validateParam(schemas.idSchema, "userId"),
      validateBody(schemas.userOptionalSchema),
    ],
    verify,
    UsersController.updateUser
  );

router
  .route("/:userId/cars")
  .get(validateParam(schemas.idSchema, "userId"), UsersController.getUserCars)
  .post(
    [
      validateParam(schemas.idSchema, "userId"),
      verify,
      storage,
      validateBody(schemas.userCarSchema),
    ],
    UsersController.newUserCar
  );

module.exports = router;
