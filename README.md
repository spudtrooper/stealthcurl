# stealthcurl

 A tool that executes a curl command using puppeteer stealth mode. 

 ## Usage

 Pass in the curl command line either as an argument:
 
 ```bash
 node index.js "curl ..."
 ```
 
 or in a file pointed to by `--file`, e.g.

 ```bash
 echo "curl ..." > f.curl
 node index.js --file f.curl
 ```