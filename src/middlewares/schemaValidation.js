export default function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      console.log(errorMessages);
      return res.status(400).send(errorMessages);
    }
    next();
  };
}
