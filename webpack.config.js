const path = require("path");

module.exports = {
	entry: {
		index: "./src/index.ts",
		react: "./src/react/index.ts",
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		library: {
			name: "eazi",
			type: "umd",
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	externals: 'react'
};
