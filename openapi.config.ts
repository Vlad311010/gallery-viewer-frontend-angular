import { GeneratorConfig } from "ng-openapi";
import { UrlsPlugin } from "./src/plugins/UrlsPlugin";

const config: GeneratorConfig = {
    input: "https://localhost:7043/swagger/v1/swagger.json",
    output: "./src/contract",
    plugins: [UrlsPlugin],
    options: {
        dateType: "Date",
        enumStyle: "enum",
    },
};

export default config;