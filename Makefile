BIN = ./node_modules/.bin
PKGS = $(wildcard packages/*)
PKGNAMES = $(subst packages/,,$(PKGS))
TESTS = $(wildcard packages/*/test/index.js)

build: bootstrap $(PKGNAMES) cli.js

bootstrap:
	$(BIN)/lerna bootstrap

test: build
	@- for t in $(TESTS) ; do \
		echo "=>" $$t ; \
		babel-node $$t ; \
	done

cli.js: packages/autorelease/lib/cli.js
	ln -s $< $@

define GEN_BABEL
$1: packages/$1

packages/$1: $(subst /src/,/lib/,$2)

packages/$1/lib:
	mkdir -p $$@

packages/$1/lib/cli.js: packages/$1/src/cli.js packages/$1/lib
	echo "#!/usr/bin/env node" > $$@
	$(BIN)/babel $$< >> $$@
	chmod +x $$@

packages/$1/lib/%.js: packages/$1/src/%.js packages/$1/lib
	$(BIN)/babel $$< > $$@

test-$1: packages/$1/test/index.js
	babel-node $$<
endef

$(foreach pkg,$(PKGNAMES), \
	$(eval $(call GEN_BABEL,$(pkg),$(wildcard packages/$(pkg)/src/*))))

clean:
	rm -rf $(wildcard packages/*/lib)
	$(BIN)/lerna clean --yes

.PHONY: build $(PKGNAMES) clean bootstrap test $(TESTS)






# INDEX = $(wildcard packages/*/src/index.js)
# INDEXOUT = $(INDEX:src/index.js=index.js)
# CLI = $(wildcard packages/*/src/cli.js)
# CLIOUT = $(CLI:src/cli.js=cli.js)
# TEST = $(wildcard packages/*/test/index.js)
# TESTOUT = $(TEST:test/index.js=test.js)
#
# build: bootstrap $(INDEXOUT) $(CLIOUT)
#
# bootstrap:
# 	$(BIN)/lerna bootstrap
#
# packages/%/index.js: packages/%/src/index.js $(SRCS)
# 	$(BIN)/rollup $< -c > $@
#
# packages/%/cli.js: packages/%/src/cli.js $(SRCS)
# 	echo "#!/usr/bin/env node" > $@
# 	$(BIN)/rollup $< -c >> $@
#
# packages/%/test.js: packages/%/test/index.js
# 	$(BIN)/rollup $< -c > $@
#

#
# clean:
# 	rm -rf $(TESTOUT) $(INDEXOUT) $(CLIOUT)
# 	$(BIN)/lerna clean --yes
#
# .PHONY: build bootstrap test clean
