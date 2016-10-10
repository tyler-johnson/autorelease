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
		$(BIN)/babel-node $$t ; \
	done

cli.js: packages/autorelease/lib/cli.js
	rm -f $@
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
	mkdir -p `dirname $$@`
	$(BIN)/babel $$< > $$@

test-$1: packages/$1/test/index.js
	$(BIN)/babel-node $$<
endef

$(foreach pkg,$(PKGNAMES), \
	$(eval $(call GEN_BABEL,$(pkg),$(wildcard packages/$(pkg)/src/*.js packages/$(pkg)/src/*/*.js))))

clean:
	rm -rf $(wildcard packages/*/lib)
	$(BIN)/lerna clean --yes

.PHONY: build $(PKGNAMES) clean bootstrap test $(TESTS)
