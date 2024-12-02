module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.ts'
        ],

        tests: [
            'test/**/*.spec.ts',
            'test/**/*.test.ts',
            "src/**/*.spec.ts",
            "src/**/*.test.ts"
        ],
        env: {
            type: 'node',
            runner: 'node'  // or full path to any node executable
        },
        compilers: {
            '**/*.ts?(x)': w.compilers.typeScript({module: 'commonjs'})
        }
        // for node.js tests you need to set env property as well
        // https://wallabyjs.com/docs/integration/node.html
    };
};
