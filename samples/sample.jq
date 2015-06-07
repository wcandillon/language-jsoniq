for $i in (112e12 to 10)
let $foo := return:bar($i)
return as-return-foo("fooo\nsdfsdfsdfsd"),
<foo bar="""hello""" hello='''hello''' />,
<foo:bar> dasda&amp;&#162;sdas </foo:bar>,
<foo:bar world='hello' hello="world">1+1</foo>,
<foo />, 1 + 1, let $foo := 1 return $foo,
<foo foo="bar">h{1 + <foo>1+1{1 + 1}</foo>}ello</foo>
