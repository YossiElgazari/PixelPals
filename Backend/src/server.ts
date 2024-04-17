import appInit from "./app";


appInit().then((app) => {
  app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}\n`);
    if (process.env.NODE_ENV === "development") console.log(`Example app listening at http://localhost:${process.env.PORT}/api-docs\n`);
  });
});