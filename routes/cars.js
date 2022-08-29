const router = require("express-promise-router")();
const verify = require("../routes/verifyToken");
const storage = require("../helpers/storage");

const CarsController = require("../controllers/cars");
const {
  validateBody,
  validateParam,
  schemas,
} = require("../helpers/routeHelpers");

router
  .route("/")
  .get(CarsController.index)
  .post(validateBody(schemas.carSchema), CarsController.newCar);
router
  .route("/:carId")
  .get(validateParam(schemas.idSchema, "carId"), CarsController.getCar)
  .put(
    [
      validateParam(schemas.idSchema, "carId"),
      validateBody(schemas.putCarSchema),
    ],
    CarsController.replaceCar
  )
  .patch(
    [
      validateParam(schemas.idSchema, "carId"),
      validateBody(schemas.patchCarSchema),
      verify,
      storage,
    ],
    CarsController.updateCar
  )
  .delete(validateParam(schemas.idSchema, "carId"), CarsController.deleteCar);
router.route("/:carId/:imageId").get(storage, CarsController.getCarImage);
router
  .route("/:carId/:imageFileName")
  .delete(storage, CarsController.removeImage);

module.exports = router;
