import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import path from "path";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  turbopack: {
    // Pin workspace root to avoid multi-lockfile root inference warnings.
    root: path.resolve(__dirname),
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
