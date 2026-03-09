# Change Log

### v0.0.3

Added `taylors-tools.centerScreen` command

Added `taylors-tools.convertNumber` command with baked argument variants:

* `taylors-tools.convertHexToDec` - `from`=`"hex"` `to`=`"dec"`
* `taylors-tools.convertDecToHex` - `from`=`"dec"` `to`=`"hex"`
* `taylors-tools.convertBinToHex` - `from`=`"bin"` `to`=`"hex"` `pefix`=`"0x"`
* `taylors-tools.convertHexToBin` - `from`=`"hex"` `to`=`"bin"` `pefix`=`"0b"`
* `taylors-tools.convertCharsToHex` - `from`=`"ascii"` `to`=`"hex"` `pefix`=`"0x"`
* `taylors-tools.convertHexToChars` - `from`=`"hex"` `to`=`"ascii"` `splitter`=`" "` `joiner`=`""`

Tweaked `taylors-tools.gotoEmptyLine` cursor placement when moving backwards and reaching the beginning of the file

Added variants of `taylors-tools.gotoEmptyLine` with baked arguments so they can be found/run from the Command Palette

* `taylors-tools.gotoNextEmptyLine` - `forward`=`true` and `select`=`false`
* `taylors-tools.gotoPrevEmptyLine` - `forward`=`false` and `select`=`false`
* `taylors-tools.gotoNextEmptyLineExtend` - `forward`=`true` and `select`=`true`
* `taylors-tools.gotoPrevEmptyLineExtend` - `forward`=`false` and `select`=`true`

### v0.0.2

Added `taylors-tools.gotoEmptyLine` command

### v0.0.1

Started development (referencing older extension [VsCodeTaylorExt](https://github.com/PiggybankStudios/VsCodeTaylorExt))

Added `taylors-tools.test` command
