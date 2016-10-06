BIN = ./node_modules/.bin
SRCS = $(wildcard packages/*/src/* packages/*/src/*/*)
INDEX = $(wildcard packages/*/src/index.js)
INDEXOUT = $(INDEX:src/index.js=index.js)
CLI = $(wildcard packages/*/src/cli.js)
CLIOUT = $(CLI:src/cli.js=cli.js)
TEST = $(wildcard packages/*/test/index.js)
TESTOUT = $(TEST:test/index.js=test.js)

build: bootstrap $(INDEXOUT) $(CLIOUT)

bootstrap:
	$(BIN)/lerna bootstrap

packages/%/index.js: packages/%/src/index.js $(SRCS)
	$(BIN)/rollup $< -c > $@

packages/%/cli.js: packages/%/src/cli.js $(SRCS)
	echo "#!/usr/bin/env node" > $@
	$(BIN)/rollup $< -c >> $@

packages/%/test.js: packages/%/test/index.js
	$(BIN)/rollup $< -c > $@

test: $(TESTOUT) build
	@- for t in $(TESTOUT) ; do \
		node $$t ; \
	done

clean:
	rm -rf $(TESTOUT) $(INDEXOUT) $(CLIOUT)
	$(BIN)/lerna clean --yes

.PHONY: build bootstrap test clean
