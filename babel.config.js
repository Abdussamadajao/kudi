module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // module-resolver for your custom aliases (assets, constants, components)
      [
        "module-resolver",
        {
          root: ["./"], // Your project root
          alias: {
            assets: "./assets",
            constants: "./constants",
            components: "./components",
            provider: "./provider",
            lib: "./lib",
          },
        },
      ],
      // The Reanimated plugin MUST be the LAST plugin in the list.
      "react-native-reanimated/plugin",
    ],
  };
};
