import npmPublish from "autorelease-task-npm-publish";
import createPipeline from "./pipeline";

export default function() {
  const publish = createPipeline();

  publish.addLernaTask("lernaPublish", async (ctx) => {
    const res = await npmPublish(ctx);
    console.log(res.trim());
    return res;
  }, {
    forceLoop: true,
    updatedOnly: true,
    progress: false,
    log: "Publishing packages"
  });

  return publish;
}
