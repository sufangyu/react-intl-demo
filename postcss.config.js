module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-px2rem')({
            remUnit: 50,
        }),
    ]
}