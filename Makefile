

svgpan.js : src/_intro.txt src/_outro.txt src/config.js src/core.js src/utils.js src/spring.js src/viewer.js src/autoattach.js
	python build/build.py
	
clean:
	rm -f squeegee.js
