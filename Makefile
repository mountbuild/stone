
start:
	@node --trace-uncaught start
.PHONY: start

check: build
	@node --trace-uncaught start/check/vm
.PHONY: check
