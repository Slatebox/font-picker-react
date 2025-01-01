import typescript from "rollup-plugin-typescript2";
import pkg from './package.json' assert { type: 'json' };

export default {
  input: "./src/FontPicker.tsx",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      globals: { react: "React" },
    },
    {
      file: pkg.module,
      format: "es",
      globals: { react: "React" },
    },
  ],
  external: ["react", "react-dom"],
  plugins: [typescript()],
};