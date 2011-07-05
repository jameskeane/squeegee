

svgpan.js : src/_intro.txt src/_outro.txt src/svgpan.config.js src/svgpan.core.js src/svgpan.utils.js src/svgpan.spring.js src/svgpan.viewer.js src/svgpan.autoattach.js
	python build/build.py
	
clean:
	rm -f svgpan.js
