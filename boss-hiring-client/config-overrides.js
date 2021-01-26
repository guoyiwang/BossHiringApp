const {
    override,
    fixBabelImports,
    addLessLoader,
  } = require("customize-cra");
  
  const theme = require('./package.json').theme;

  module.exports = override(
    fixBabelImports("import", {
      libraryName: "antd-mobile", libraryDirectory: "es", style: true // change importing css to less
    }),
    addLessLoader({
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: { '@primary-color': '#1DA57A' },
            
        },
    }),
  );