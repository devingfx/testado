var test = (function(){

class Test extends Array {
	static isReal( o ){ return /✔️|⚠️|❌/.test(o.icon) }
	#icon
	set icon( v ){ this.#icon = v }
	get icon(){
		return this.#icon || (this.every( t=> !Test.isReal(t) || t.icon == '✔️') ? '✔️' 
							: this.every( t=> !Test.isReal(t) || t.icon == '❌') ? '❌' 
							: '⚠️')
	}
	get tests(){ return this.filter( Test.isReal ) }
	get count(){ return this.tests.length }
	get total(){ return this.tests.reduce( (n,t)=>n+t.total, this.count ? 0 : 1 ) }
	get value(){ return this.tests.map( t=> t.count ? t.value : t.icon == '✔️' ? 1 : 0 ).reduce( (t,n)=> t + n, 0 ) }
	get score(){ return Math.floor( this.value / this.total * 100 ) }
	
	constructor( ss, pp, icon )
	{
		super()
		if( !isNaN(ss) && pp == undefined && icon == undefined ) return
		this.ss = [...ss]
		this.pp = pp
		this.#icon = icon
	}
	push(){ super.push(...arguments); return this }
	addSSPP( s, p ){ this.ss.push( s ); p && this.pp.push( p ); return this }
	sspp( ss, ...pp ){ this.ss[this.ss.length-1] += ss[0]; this.ss.push( ...ss.slice(1) ); this.pp.push( ...pp ); return this }
}
const _clike = (ss,...pp)=> [].concat(ss).map((s,i)=> s + (typeof pp[i] != 'undefined' ? '%' : '') ).join('')
const log = (ss,...pp)=> console.log( _clike(ss,...pp), ...pp)
const error = (ss,...pp)=> console.error( _clike(ss,...pp), ...pp)
const group = (ss,...pp)=> console.group( _clike(ss,...pp), ...pp)
const groupClosed = (ss,...pp)=> console.groupCollapsed( _clike(ss,...pp), ...pp)
const progress = percent=> `background: linear-gradient(90deg, green ${percent}%, red ${percent}%)`

const _ok = stack=> (ss,...pp)=> cond=> stack.push( new Test(ss, pp, cond ? '✔️' : '❌') )
const _ko = stack=> (ss,...pp)=> cond=> stack.push( new Test(ss, pp, !cond ? '✔️' : '❌') )
const _log = stack=> (ss,...pp)=> stack.push({ ss:['💬 '+ss[0], ...ss.slice(1)], pp })
const _error = stack=> (ss,...pp)=> stack.push({ ss:['','c'+ss[0], ...ss.slice(1)], pp: ['color:#FF8080;background:#290000',...pp] })
const _test = parentStack=> (ss,...pp)=> async fn=> {
	let stack = new Test(ss, pp)
	try {
		await fn({ ok: _ok(stack), ko: _ko(stack), test: _test(stack), log: _log(stack), error: _error(stack) })
	}
	catch( e ) { 
		// console.error(e)
		// stack.push( new Test([e.name+' > (', 'o)'],[e],'❌'))
		e.icon = '❌'
		e.total = 1
		stack.push( e )
		// _error(stack)`${e.type}s`
	}
	finally {
		!stack.length && (stack.icon = '☢️')
		parentStack
			? parentStack.push( stack )
			: log_( stack )
	}
}

const log_ = t=> {
	if( t instanceof Error )
	{
		groupClosed`❌ ${t.name}s: ${t.message}s`
		t.stack.replace(`${t.name}: ${t.message}\n`,'')
			.split('\n')
			.map( line=> log`${line}s` )
		console.groupEnd()
		return 
	}
	if( t.icon )
		t.ss[0] = `${t.icon} ${t.ss[0]}`
	if( t.count )
	{
		t.sspp` (${t.value}s/${t.total}s) `
		t.total > 100
			? t.sspp`${progress(t.score)}c${' '.repeat(100)}s`
			: t.sspp`${progress(t.score)}c${'◾️'.repeat(t.total)}s`
		t.sspp`${''}c ${t.score}s%`

		if( t.score == 100 )
			groupClosed( t.ss, ...t.pp )
		else
			group( t.ss, ...t.pp )
		t.map( log_ )
		console.groupEnd()
	}
	else
		log( t.ss, ...t.pp )
}



// emojis available: ✔️❌⚠️☢️⛔️❗️❕❓❔📣📢👁‍🗨💬💭🗯

console.groupCollapsed(`Tests legend`)
log `✔️: all tests passed successfully`
log `⚠️: some tests not passed`
log `❌: all tests not passed`
log `☢️: TODO write the tests`
log `⛔️: TODO write the code`
console.groupEnd()

return _test()

})()