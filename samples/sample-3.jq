(: Plucked from various code-samples at https://github.com/ghislainfourny/jsoniq-tutorial :)
copy $people := {
	"John" : { "status" : "single" },
	"Mary" : { "status" : "single" } }
modify (replace value of json $people.John.status with "married",
	replace value of json $people.Mary.status with "married")
return $people
-> { "John" : { "status" : "married" }, "Mary" : { "status" : "married" } }

%%rumble
let $person := {
	"name" : "Sarah",
	"age" : 13,
	"gender" : "female",
	"friends" : [ "Jim", "Mary", "Jennifer"]
}
return { "keys" : [ keys($person)] }
