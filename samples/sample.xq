xquery version "1.0";

declare namespace return = "http://www.example.com/";

let $xml := copy $new := 1
            modify (

            )
            return $new
return $xml,
let $xml := copy $new := $xml
            modify (
                for $text in $new//text()
                return
                  replace value of node $text with normalize-space($text)
            )
            return $new
return $xml,

for $i in (112e12 to 10)
let $foo := $i.bar.i
let $foo := if(true()) then 1 else if(true()) then 1 else 0
return <foo>1 + 1</foo>
