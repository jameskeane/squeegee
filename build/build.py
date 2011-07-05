from jsmin import jsmin
from os import path
import sys

if __name__ != "__main__":
    print "Error: this script should be executed directly, not included."
    exit(1)

HEADER = '''
/*!
 * svgpan 0.9 (custom build from source)
 */
'''

SRC_PATH = path.join(path.dirname(sys.argv[0]), "..", "src")
SRC_FILES = [
    "_intro.txt",
    "svgpan.core.js",
    "svgpan.config.js",
    "svgpan.spring.js",
    "svgpan.utils.js",
    "svgpan.viewer.js",
    "svgpan.autoattach.js",
    "_outro.txt"
]

MIN_PATH = "svgpan.js"

def readfile(path):
    file = open(path, 'r')
    contents = file.read()
    file.close()
    return contents

def writefile(path, contents):
    file = open(path, 'w')
    file.write(contents)
    file.close()

src_raw = '\n'.join([readfile(path.join(SRC_PATH,src_file)) for src_file in SRC_FILES])
src_min = HEADER.strip() + '\n' + jsmin(src_raw)

writefile(MIN_PATH, src_min)
