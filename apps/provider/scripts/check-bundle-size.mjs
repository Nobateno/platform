import { readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import process from "node:process";

const outputDirectory = resolve("dist", "assets");
const maximumChunkBytes =
  Number(process.env.BUNDLE_MAX_CHUNK_KB ?? 1500) * 1024;
const maximumTotalBytes =
  Number(process.env.BUNDLE_MAX_TOTAL_KB ?? 3500) * 1024;

const assetNames = await readdir(outputDirectory);
const javascriptAssets = assetNames.filter((name) => name.endsWith(".js"));
const measuredAssets = await Promise.all(
  javascriptAssets.map(async (name) => ({
    name,
    bytes: (await stat(resolve(outputDirectory, name))).size,
  })),
);

const oversizedAssets = measuredAssets.filter(
  ({ bytes }) => bytes > maximumChunkBytes,
);
const totalBytes = measuredAssets.reduce((total, asset) => total + asset.bytes, 0);
const formatKilobytes = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

if (oversizedAssets.length > 0 || totalBytes > maximumTotalBytes) {
  for (const asset of oversizedAssets) {
    process.stderr.write(
      `${asset.name} is ${formatKilobytes(asset.bytes)}; the per-chunk budget is ${formatKilobytes(maximumChunkBytes)}.\n`,
    );
  }
  if (totalBytes > maximumTotalBytes) {
    process.stderr.write(
      `Total JavaScript is ${formatKilobytes(totalBytes)}; the budget is ${formatKilobytes(maximumTotalBytes)}.\n`,
    );
  }
  process.exitCode = 1;
} else {
  process.stdout.write(
    `Bundle budget passed: ${measuredAssets.length} JavaScript assets, ${formatKilobytes(totalBytes)} total, largest ${formatKilobytes(Math.max(...measuredAssets.map(({ bytes }) => bytes), 0))}.\n`,
  );
}
