import appInit from "./app";


appInit().then((app) => {
  app.listen(process.env.PORT, () => {
    console.log(
      `Example app listening at http://localhost:${process.env.PORT}\n` +
      `Example app listening at http://localhost:${process.env.PORT}/api-docs\n`
    );
  });
});