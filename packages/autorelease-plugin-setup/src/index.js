import createPipeline from "./pipeline";

export default function(autorelease) {
  autorelease.add("setup", createPipeline());
}
