const fs=require('fs'),path=require('path'),css=require('css-tree');
const root=path.resolve(__dirname,'..');let errors=[],declarations=0,urls=0;
for(const file of ['assets/site.css','assets/revision.css','assets/polish.css']){
 const ast=css.parse(fs.readFileSync(path.join(root,file),'utf8'),{positions:true});
 css.walk(ast,{enter(node){
  if(node.type==='Url'){
   const value=node.value;
   if(!/^(https?:|data:|#)/.test(value)){
    urls++;if(!fs.existsSync(path.resolve(root,path.dirname(file),value)))errors.push(`${file}: missing ${value}`);
   }
  }
  if(node.type!=='Declaration')return;
  declarations++;
  if(this.atrule && ['font-face','view-transition'].includes(this.atrule.name))return;
  if(node.property.startsWith('--')||/var\(/.test(css.generate(node.value)))return;
  const match=css.lexer.matchProperty(node.property,node.value);
  if(match.error)errors.push(`${file}:${node.loc.start.line} ${node.property}: ${css.generate(node.value)}`);
 }});
}
const report={date:new Date().toISOString(),declarations,localCssAssets:urls,errors,note:'CSS grammar and local URL checks only; does not establish visual layout correctness.'};
fs.writeFileSync(path.join(root,'brief/style-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
