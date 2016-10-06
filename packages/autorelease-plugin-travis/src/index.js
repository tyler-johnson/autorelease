import verify from "./verify";

export default function(autorelease) {
  autorelease.pipeline("pre.verify").add(verify);
}
