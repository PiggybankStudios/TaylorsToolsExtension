# taylors-tools README

A collection of commands that replicate behavior I had in Sublime Text and other editors

## Commands

`taylors-tools.gotoEmptyLine` - Move the cursor up/down to the next/previous line that contains no characters (besides whitespace, places cursor after whitespace). **Args:**

* `forward` - Boolean - Whether to move down the file (default = true)
* `select` - Boolean - Whether to extend the selection (default = false)

**Baked Variants:** `taylors-tools.gotoNextEmptyLine`, `taylors-tools.gotoPrevEmptyLine`, `taylors-tools.gotoNextEmptyLineExtend`, and `taylors-tools.gotoPrevEmptyLineExtend`

`taylors-tools.centerScreen` - Scroll the active view so that the primary cursor is centered on screen

`taylors-tools.convertNumber` - Convert the selected number from one base to another. Supported bases: Decimal, Hexadecimal, and Binary. Also can convert ASCII characters into their numeric equivalent if `"ascii"` is passed as `to` or `from` argument. **Args:**

* `from` - String - What base to expect the selected number to be in. `"dec"`, `"hex"`, `"bin"`, or `"ascii"`
* `to` - String - What base to convert the number to. `"dec"`, `"hex"`, `"bin"`, or `"ascii"`
* `splitter` - String - When converting `to`=`"ascii"` we will split the input using the given string and treat each piece as a separate conversion (aka separate character)
* `joiner` - String - When converting `to`=`"ascii"` we will insert this string in-between each converted character

**Baked Variants:** `taylors-tools.convertHexToDec`, `taylors-tools.convertDecToHex`, `taylors-tools.convertBinToHex`, `taylors-tools.convertHexToBin`, `taylors-tools.convertCharsToHex`, and `taylors-tools.convertHexToChars`

## Requirements

Dev dependencies: Typescript, npm and Webpack

## Release Notes

### v0.0.3

Added `taylors-tools.centerScreen` command

Added `taylors-tools.convertNumber` command with baked argument variants: `taylors-tools.convertHexToDec`, `taylors-tools.convertDecToHex`, `taylors-tools.convertBinToHex`, `taylors-tools.convertHexToBin`, `taylors-tools.convertCharsToHex`, and `taylors-tools.convertHexToChars`

Tweaked `taylors-tools.gotoEmptyLine`

Added variants of `taylors-tools.gotoEmptyLine`: `taylors-tools.gotoNextEmptyLine`, `taylors-tools.gotoPrevEmptyLine`, `taylors-tools.gotoNextEmptyLineExtend`, and `taylors-tools.gotoPrevEmptyLineExtend`

### v0.0.2

Added `taylors-tools.gotoEmptyLine` command

### v0.0.1

Started development (referencing older extension [VsCodeTaylorExt](https://github.com/PiggybankStudios/VsCodeTaylorExt))

Added `taylors-tools.test` command

---
