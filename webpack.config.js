const path = require("path");

module.exports = {
	entry: {
		index: "./src/index.ts",
		react: {
			import: "./src/react/index.ts",
			dependOn: 'index'
		},
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
		library: {
			name: "mediator",
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
	externals: {
		react: "React",
	},
};
