xquery version "1.0";

declare namespace return = "http://www.example.com/";

for $i in (112e12 to 10)
let $foo := $i.bar.i
let $foo := if(true()) then 1 else if(true()) then 1 else 0
return as-return-foo("fooo\nsdfsdf''""sd&quot;fsd") || 'asd''asd',
<foo>sxsa<b></b>das</bar>,
<foo>he<foo>hello</foo>llo</bar>,
<foo bar="""he{{1 + 1}}ll{1 + 1, let $foo := 1 return <foo bar="hello" />}o""" hello='''hello''' />,
<foo:bar>sad<foo>hello</foo>&amp;&#162;s return d'as </foo:bar>,
<foo:bar world='hello' hello="world">1+1</foo>,
<foo />, 1 + 1, let $foo := 1 return $foo,
<foo foo="bar">h{1 + <foo>1+1{1 + 1, let $foo := 1 return 1}</foo>}ello</foo>
