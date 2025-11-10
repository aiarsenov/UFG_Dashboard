/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/, // применяем для JS и TS файлов
            use: ["@svgr/webpack"],
        });
        return config;
    },
};

module.exports = nextConfig;
