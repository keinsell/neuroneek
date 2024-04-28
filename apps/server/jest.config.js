export default {
    "transform": {
        "^.+\\.tsx?$": ["esbuild-jest", {platform: "node", target: "es2020"}]
    }
};