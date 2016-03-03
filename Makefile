BIN = ./node_modules/.bin
SRC = $(wildcard src/* src/*/*)
STEPS = $(wildcard src/steps/*)
STEPS_OUT = $(STEPS:src/steps/%.js=%.js)

build: index.js cli.js $(STEPS_OUT)

index.js: src/index.js $(SRC)
	$(BIN)/rollup $< -c -f cjs > $@

cli.js: src/cli.js $(SRC)
	echo "#!/usr/bin/env node" > $@
	$(BIN)/rollup $< -c -f cjs >> $@

%.js: src/steps/%.js
	$(BIN)/rollup $< -c -f cjs > $@

clean:
	rm -f index.js cli.js $(STEPS_OUT)

.PHONY: build
