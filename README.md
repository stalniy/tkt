The Knockout Tools
===

This library includes the most useful functionality for development with knockout: custom bindings and useful tools.
Also it includes shim for `Object.create`, `Array.isArray` and `String.trim` methods. For more information check [wiki](https://github.com/stalniy/tkt/wiki) pages.

## Installation

Using bower: `bower install tkt`

Or

Just clone repository and assemble all the files with `grunt`:
```sh
git clone git@github.com:stalniy/tkt.git
cd tkt
npm install
grunt # or grunt test if you want just test the package
```
If you use knockout version older than 2.2 you need to run `grunt for-old-ko`

## License

Released under the [MIT](http://www.opensource.org/licenses/MIT) License