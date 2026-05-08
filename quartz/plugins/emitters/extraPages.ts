import { FilePath, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

export interface ExtraPagesOptions {
  /**
   * Source directory (relative to repo root) containing extra static pages.
   * Files are copied verbatim to the output root, preserving relative paths.
   */
  sourceDir?: string
}

export const ExtraPages: QuartzEmitterPlugin<ExtraPagesOptions> = (opts) => ({
  name: "ExtraPages",
  async *emit({ argv, cfg }) {
    const sourceDir = opts?.sourceDir ?? "custom-pages"

    if (!fs.existsSync(sourceDir)) {
      return
    }

    const fps = await glob("**", sourceDir, cfg.configuration.ignorePatterns)
    for (const fp of fps) {
      const src = joinSegments(sourceDir, fp) as FilePath
      const dest = joinSegments(argv.output, fp) as FilePath

      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  },
  async *partialEmit() {},
})
