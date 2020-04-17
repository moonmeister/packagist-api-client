const packagist = require("./dist/index");

// packagist.getAll().then(allPackages => console.log(allPackages));

// packagist.getByOrg("composer").then(composerPackages => console.log(composerPackages));

// packagist.getByType("composer-plugin").then(composerPlugins => console.log(composerPlugins));

packagist.getPackageDetailsStatic('monolog/monolog').then(({ data, lastModified }) => {
  console.log(data, lastModified)
  return packagist.getPackageDetailsStatic('monolog/monolog', lastModified)
}).then(result => console.log("second try", result))