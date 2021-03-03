xquery version "1.0";

for $i in (112e12 to 10)
let $foo := return:bar($i)
return as-return-foo("fooo\nsdfsdfsdfsd"), 'asdasd',
<foo>hello</bar>,
<foo bar="""he{{1 + 1}}ll{1 + 1, let $foo := 1 return <foo bar="hello" />}o""" hello='''hello''' />,
<foo:bar>sad <!-- asdsa -->dasda<foo>hello</foo>&amp;&#162;sdas </foo:bar>,
<foo:bar world='hello' hello="world">1+1</foo>,
<foo />, 1 + 1, let $foo := 1 return $foo,
<foo foo="bar">h{1 + <foo>1+1{1 + 1, let $foo := 1 return 1}</foo>}ello</foo>
