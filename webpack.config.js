module.exports = {
    mode: "development",
    target: "node",
    module: {
        rules: [{
            test: /\.jsx?/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['@babel/preset-react'],
                    plugins: ["@babel/plugin-proposal-class-properties"],
                },
            }
        }],
    },
};
