# JSONiq & XQuery Package for Atom
[![Build Status](http://img.shields.io/travis/wcandillon/language-jsoniq/master.svg?style=flat)](https://travis-ci.org/wcandillon/language-jsoniq) [![Code Climate](http://img.shields.io/codeclimate/github/wcandillon/language-jsoniq.svg?style=flat)](https://codeclimate.com/github/wcandillon/language-jsoniq)

This package provides syntax highlighting for JSONiq and XQuery files.
The syntax highlighting and error reporting is provided by [XQLint](https://github.com/wcandillon/xqlint).

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

## Syntax Highlighting, Warnings, and Errors
![example](http://i.imgur.com/86jU7C1.png)

## Code Snippets
![snippets](http://i.imgur.com/9UeMhrj.gif)

| Trigger      | Name        | Body |
|--------------|-------------|------|
| `for`        | for         | `for $${1:item} in ${2:expr}${3}` |
| `return`     | return      | `return ${1:expr}${2}` |
| `import`     | import      | `import module namespace ${1:ns} = "${2:http://www.example.com/}";\n${3}` |
| `some`       | some        | `some $${1:varname} in ${2:expr} satisfies ${3:expr}${4}` |
| `every`      | every       | `every $${1:varname} in ${2:expr} satisfies ${3:expr}${4}` |
| `if`         | if          | `if(${1:true}) then\n  ${2:expr}\nelse\n  ${3:true}${4}` |
| `switch`     | switch      | `switch(${1:"foo"})\ncase ${2:"foo"}\nreturn ${3:true}\ndefault return ${4:false}${5}` |
| `try`        | try         | `try {\n  ${1:expr}\n} catch ${2:*} {\n  ${3:expr}\n}${4}` |
| `tumbling`   | tumbling    | `for tumbling window $${1:varname} in ${2:expr}\nstart at $${3:start} when ${4:expr}\nend at $${5:end} when ${6:expr}\nreturn ${7:expr}${8}` |
| `sliding`    | sliding     | `for sliding window $${1:varname} in ${2:expr}\nstart at $${3:start} when ${4:expr}\nend at $${5:end} when ${6:expr}\nreturn ${7:expr}${8}` |
| `let`        | let         | `let $${1:varname} := ${2:expr}${3}` |
| `group`      | group       | `group by $${1:varname} := ${2:expr}${3}` |
| `order`      | order       | `order by $${1:expr} := ${2:descending}${3}` |
| `stable`     | stable      | `stable order by $${1:expr}${2}` |
| `count`      | count       | `count $${1:varname}${2}` |
| `ordered`    | ordered     | `ordered { ${1:expr} }${2}` |
| `unordered`  | unordered   | `unordered { ${1:expr} }${2}` |
| `treat`      | treat       | `treat as ${1:expr}${2}` |
| `castable`   | castable    | `castable as ${1:atomicType}${2}` |
| `cast`       | cast        | `cast as ${1:atomicType}${2}` |
| `typeswitch` | typeswitch  | `typeswitch(${1:expr})\ncase ${2:type}  return ${3:expr}\ndefault return ${4:expr}${5}` |
| `var`        | var         | `declare variable $${1:varname} := ${2:expr};${3}` |
| `fn`         | fn          | `declare function ${1:ns}:${2:name}(){\n  ${3:expr}\n};\n\n${4}` |
| `module`     | module      | `module namespace ${1:ns} = "${2:http://www.example.com}";\n\n${3}` |
