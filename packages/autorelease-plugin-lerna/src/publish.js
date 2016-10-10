import npmPublish from "autorelease-task-npm-publish";
import createPipeline from "./pipeline";

export default function() {
  const publish = createPipeline();

  publish.addLernaTask("lernaPublish", npmPublish, {
    forceLoop: true,
    updatedOnly: true
  });

  return publish;
}
