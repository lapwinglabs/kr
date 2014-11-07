
test:
	@./node_modules/.bin/mocha \
		--reporter spec \
		--require should \
		--harmony-generators \
		--bail

.PHONY: test
