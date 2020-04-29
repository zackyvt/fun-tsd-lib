# Copyright 2020 Carson Cheng
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at https://mozilla.org/MPL/2.0/.

gqg_name=gqg-mod
gqg_src=src/$(gqg_name).ts
gqg_target=build/$(gqg_name).js

gqg_hack_name=gqg-module-Fn
gqg_hack_src=src/$(gqg_hack_name).ts
gqg_hack_target=build/$(gqg_hack_name).js

gqg_startup_name=gqg-startup
gqg_startup_src=src/$(gqg_startup_name).ts
gqg_startup_target=build/$(gqg_startup_name).js


libs: $(gqg_hack_target) $(gqg_startup_target) $(gqg_target)

$(gqg_hack_target): $(gqg_hack_src)
	./compiler_cli.sh $(gqg_hack_src)
	echo

$(gqg_startup_target): $(gqg_startup_src)
	./compiler_cli.sh $(gqg_startup_src)
	echo

$(gqg_target): $(gqg_src)
	./compiler_cli.sh $(gqg_src)
	echo

all: libs

.PHONY: clean
clean:
	rm -f $(gqg_target)
	rm -f $(gqg_hack_target)
	rm -f $(gqg_startup_target)
