import verify from "./verify";

export default function(autorelease) {
  autorelease.pipeline("verify").add(verify);
}
