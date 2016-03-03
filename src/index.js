import pre from "./pre";
// import post from "./post";

// export {pre,post};

pre().then((r) => {
	console.log(r);
}).catch((e) => {
	console.error(e);
	process.exit(1);
});
