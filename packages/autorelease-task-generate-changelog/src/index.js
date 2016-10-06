import ccparser from "conventional-changelog";

export default async function(ctx) {
  const {options={},packageFile} = ctx;
  const {changelog=true,preset} = options;
  if (!changelog) return;

  let clog = ccparser({
    pkg: { path: packageFile },
    preset
  });

  let data = "";
  clog.setEncoding("utf-8");
  clog.on("data", (c) => data += c);

  await new Promise((resolve, reject) => {
    clog.on("end", resolve);
    clog.on("error", reject);
  });

  ctx.changelog = data;
  console.log("Generated changelog");
}
