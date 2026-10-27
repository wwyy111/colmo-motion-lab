(function(root){
const names={'入场':'entry','聆听':'listen','处理中':'process','陈述说明':'speak','等待回应':'wait','正向反馈':'positive','主动提示':'prompt','风险/异常说明':'risk','风险/异常提醒':'risk','持续服务中':'service','退场':'exit'};
const step=(title,user,ai,suggested=[],note='',optional=false)=>({title,user,ai,suggested,note,optional,enabled:!optional,clips:[]});
function suggest(text){let matches=[];for(const [word,id] of Object.entries(names)){let pos=text.indexOf(word);while(pos>=0){if(!/(不要|无需|不需要|不必)$/.test(text.slice(Math.max(0,pos-4),pos)))matches.push({id,pos});pos=text.indexOf(word,pos+word.length)}}if(matches.length)return matches.sort((a,b)=>a.pos-b.pos).map(x=>x.id).filter((x,i,a)=>!i||x!==a[i-1]);if(/用户.*(语音|说|回答)/.test(text))return ['listen','process'];if(/等待|确认|询问/.test(text))return ['speak','wait'];if(/拍照|识别|分析/.test(text))return ['process'];if(/保存成功|已保存|已记录/.test(text))return ['positive'];return []}
const food=()=>[
step('打开冰箱，提供记录入口','用户打开冰箱；可点击手机通知，也可忽略。','检测到开门后，手机提供拍照记录入口。',[],'入口是通知设计，不强制展示管家动画。忽略则结束；开门感知、手机通知和摄像头权限需具备。'),
step('点击入口，管家入场','用户点击通知，进入 AI 管家页面。','管家形象出现，准备接收本次存入内容。',['entry'],'按原需求进入拍摄界面；有摄像头授权后才能打开，未授权时保留语音入口。'),
step('提示录入方式','用户选择拍照或语音。','请拍照录入或说明本次存入的食材。',['speak','wait'],'同一内容选一种方式即可。此处是进入后的引导，不必额外叠加主动提示。'),
step('录入食材，整理信息','本演示采用语音：存入了一个西红柿。','接收输入，识别食材名称和数量。',['listen','process'],'若走拍照路径，把“聆听”移除，仅保留识别处理；不把两种输入同时作为必经步骤。'),
step('展示清单，等待确认','用户查看图文卡片，可选择保存或修改。','食材信息整理好了，您看看有没有遗漏或需要修改的地方，确认后我再保存。',['speak','wait'],'L1 低强度表达；图文卡片标记待保存；默认静音，点击外放才朗读。触觉尚未定义，不补造。'),
step('修改内容，再次核对','可选：用户用语音说“改成两个西红柿”，或点击修改数量。','已将西红柿数量改为 2 个，请再核对一下，确认后我再保存。',['listen','process','speak','wait'],'可选分支：确认页选择修改才进入。点击编辑时可移除“聆听”。修改后回到清单确认，可重复此步骤。',true),
step('确认并保存','用户点击保存；也可用语音确认。','已保存本次食材记录。',['process','positive'],'推荐演示点击保存；语音确认时可在前面加聆听。正向反馈只在真实保存成功后出现；失败应改走异常说明，不能提前宣告成功。'),
step('结束本轮交互','用户留在页面或离开。','本次录入结束，管家退场。',['exit'],'退出动画只表示本轮交流结束。')];
function numberedStep(s){const body=s.replace(/^\s*\d+[.、．）)]\s*/,'');const clean=body.split(/[-—]/).filter(x=>!Object.keys(names).includes(x.trim())).join('—').trim();const quoted=clean.match(/(?:会说|回复|回答|告知[^：:]*|说)[：:]\s*(.+)/);const ai=/AI|ai|管家/i.test(clean)&&/会说|回复|反馈/.test(clean);return step(clean.slice(0,70),ai?'':clean,ai?(quoted?.[1]||clean):'',suggest(body),'依据编号原文提取；请核对角色、话术及推荐素材。原文：'+body)}
function parse(raw){const text=String(raw).replace(/<br\s*\/?\s*>/gi,'\n').replace(/\*\*/g,'').trim();if(!text)throw Error('请先输入交互描述');const numbered=text.split(/\n+/).filter(x=>/^\s*\d+[.、．）)]/.test(x));if(numbered.length>=2)return {nodes:numbered.map((s,i)=>numberedStep(s)).slice(0,40),message:'按编号拆分，已提取明确写出的素材。请补充各步角色与话术。'};if(/冰箱|食材/.test(text)&&/拍照|语音/.test(text)&&/确认|修改|保存/.test(text))return{nodes:food(),message:'匹配到食材录入流程模板，含可选修改分支。具体话术和权限说明为设计草稿，请对照原文核对。'};const lines=text.split(/\n|；|;|。/).map(x=>x.trim()).filter(x=>x.length>3);return{nodes:lines.slice(0,40).map(x=>step(x.slice(0,70),/用户/.test(x)?x:'',/AI|管家|系统|提醒|说明/.test(x)?x:'',suggest(x),'原文：'+x)),message:'按句拆分的初稿；未明确的角色、先后关系和素材请手动补充。'};}
root.FlowParser={parse,suggest,food};if(typeof module!=='undefined')module.exports=root.FlowParser;
})(typeof window==='undefined'?globalThis:window);
