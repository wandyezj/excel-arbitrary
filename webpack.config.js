/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/naming-convention */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CustomFunctionsMetadataPlugin = require("custom-functions-metadata-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const urlDev = "https://localhost:3000/";
const urlProd = "https://www.contoso.com/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
    const httpsOptions = await devCerts.getHttpsServerOptions();
    return {
        cacert: httpsOptions.ca,
        key: httpsOptions.key,
        cert: httpsOptions.cert,
    };
}

module.exports = async (env, options) => {
    const dev = options.mode === "development";
    const buildType = dev ? "dev" : "prod";
    const config = {
        devtool: "source-map",
        entry: {
            functions: "./src/functions/functions.ts",
            // functions: {
            //     import: "./src/functions/functions.ts",
            //     dependOn: "ts",
            // },
            taskpane: "./src/taskpane/taskpane.ts",
            //ts: "typescript",
        },
        output: {
            devtoolModuleFilenameTemplate:
                "webpack:///[resource-path]?[loaders]",
            clean: true,
        },
        resolve: {
            extensions: [".ts", ".html", ".js"],
        },
        module: {
            noParse: [require.resolve("typescript/lib/typescript.js")],
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: "ts-loader",
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: "html-loader",
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/[name][ext][query]",
                    },
                },
            ],
        },
        plugins: [
            new CustomFunctionsMetadataPlugin({
                output: "functions.json",
                input: "./src/functions/functions.ts",
            }),
            new HtmlWebpackPlugin({
                filename: "taskpane.html",
                template: "./src/taskpane/taskpane.html",
                chunks: ["taskpane", "functions"],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "assets/*",
                        to: "assets/[name][ext][query]",
                    },
                    {
                        from: "manifest*.xml",
                        to: "[name]." + buildType + "[ext]",
                        transform(content) {
                            if (dev) {
                                return content;
                            } else {
                                return content
                                    .toString()
                                    .replace(new RegExp(urlDev, "g"), urlProd);
                            }
                        },
                    },
                ],
            }),
        ],
        devServer: {
            static: [__dirname],
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            https:
                env.WEBPACK_BUILD || options.https !== undefined
                    ? options.https
                    : await getHttpsOptions(),
            port: process.env.npm_package_config_dev_server_port || 3000,
        },
        stats: {
            errorDetails: true
        }
    };

    return config;
};
