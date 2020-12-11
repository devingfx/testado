# testado
Simple test runner, with async and icons.

### Meaning of "testado"
"testado" is Esperanto and translated to English means testing.

## Usage

### browser

Create an HTML document and insert this `<script>` tag:

```html
<script src="https://unpkg.org/skdlfjslkfjs"></script>
<script>
/* Your tests here */
</script>
```

### nodejs
⚠️ not tested

`npm install --save-dev testado`

```javascript
require('testado')
/* Your tests here */
```
or
```javascript
import 'testado'
/* Your tests here */
```

### Tests synthax

#### General syntax

**testado** works heavily on template strings and tag functions, so obvioulsy it should run in an environment 
supporting this... 
Even if you can "fake" template calls by providing 2 arrays (see [non template string calls](#non-template-string-calls)).

```javascript
tag `string` ( ...content... )
```
Each tag function returns a function (exception are noticed), so you to give arguments in parenthesis.

#### test
The 1st and only tag accessible from your script root is `test`:

```javascript
test `description of tests group` ( Function )
```
The function given to test can be async (it's treated async by default), and will
receive an object you can destructure to get the subsequent tag functions.
⚠️ it's important to always get fresh nested tags to maintain hierarchy (see [nesting test groups](#nesting-test-groups))

```javascript
test `description of tests group` ( async ({ok,ko,log,error})=> {

	log `just log a message with console.log's % substitutions 
	like showing an object: ${document}o or a string: ${"foo"}s`
	
	ok `this test is passed` ( true )
	ko `this test is passed when falsy` ( false )
	
	ok `it's ok to use await as the group's function is async` ( await true )
	
	ok `% substitution works also for ${ok}o ${ko}o ${error}o or ${test}o` ( true )
	
	error `just show an error like log (red flashy) but continue tests`
	
	// if real Error is throw during tests, it's collected and shown in the result, but
	// subsequent tests are not played
	throw new Error('during test')
	
	ok `not played test` ( false )
})
```

#### Nesting test groups

You can 
To preserve the 