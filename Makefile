
build:
	@node --trace-uncaught start/build
.PHONY: build

check: build
	@node --trace-uncaught start/check/vm
.PHONY: check
