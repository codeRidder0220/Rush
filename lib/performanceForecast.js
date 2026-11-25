const average = (values) => values.length ? values.reduce((a,b)=>a+b,0)/values.length : 0;
const recentWeighted = (values) => values.length ? values.reduce((sum,v,i)=>sum+v*Math.pow(.72,values.length-1-i),0)/values.reduce((sum,_,i)=>sum+Math.pow(.72,values.length-1-i),0) : 0;
const deviation = (values) => values.length>1 ? Math.sqrt(average(values.map(v=>(v-average(values))**2))) : 0;
export function buildForecast({results=[],sessions=[],currentRating=500,ratingHistory=[]}) {
 const games=[...results].reverse(), scores=games.map(g=>Number(g.score)||0);
 const accuracies=games.map(g=>{const c=Number(g.correct)||0,w=Number(g.wrong)||0;return c+w?100*c/(c+w):null}).filter(x=>x!==null);
 const score= Math.round(recentWeighted(scores)), accuracy=Math.round(recentWeighted(accuracies));
 const recentScore=scores.slice(-5), recentAccuracy=accuracies.slice(-5), spread=deviation(recentScore||scores);
 const changes=ratingHistory.map(x=>Number(x.rating)).filter(Number.isFinite).reduce((arr,r,i,a)=>{if(i)arr.push(r-a[i-1]);return arr;},[]);
 const delta=Math.max(-12,Math.min(12,Math.round(recentWeighted(changes.slice(-5)))));
 const trend=(arr)=>arr.length<10?"Not enough data":average(arr.slice(-5))-average(arr.slice(-10,-5))>Math.max(3,deviation(arr)*.25)?"Improving":average(arr.slice(-5))-average(arr.slice(-10,-5))< -Math.max(3,deviation(arr)*.25)?"Declining":"Stable";
 const difficulty={Easy:{attempts:0,correct:0,wrong:0,skipped:0},Medium:{attempts:0,correct:0,wrong:0,skipped:0},Hard:{attempts:0,correct:0,wrong:0,skipped:0},Boss:{attempts:0,correct:0,wrong:0,skipped:0}};
 sessions.forEach(s=>(s.attempts||[]).forEach(a=>{const d=difficulty[a.difficulty];if(!d)return;d.attempts++;if(a.skipped)d.skipped++;else if(a.correct)d.correct++;else d.wrong++;}));
 Object.values(difficulty).forEach(d=>d.accuracy=d.correct+d.wrong?Math.round(100*d.correct/(d.correct+d.wrong)):null);
 const qualified=Object.entries(difficulty).filter(([,d])=>d.correct+d.wrong>=3);
 const strongest=qualified.slice().sort((a,b)=>b[1].accuracy-a[1].accuracy)[0]?.[0]||null;
 const weakest=qualified.slice().sort((a,b)=>a[1].accuracy-b[1].accuracy)[0]?.[0]||null;
 const confidence=games.length>=20?"Moderate":games.length>=8?"Low–moderate":games.length>=3?"Low":"Very low";
 const insights=[];
 if(scores.length>=10)insights.push({title:"Score trend: "+trend(scores),body:"Comparison of the latest five games with the previous five."});
 if(accuracies.length>=10)insights.push({title:"Accuracy trend: "+trend(accuracies),body:"Based on the same two five-game windows."});
 if(strongest&&weakest&&strongest!==weakest)insights.push({title:"Strength: "+strongest,body:strongest+" accuracy is "+difficulty[strongest].accuracy+"%; "+weakest+" is a practice opportunity ("+difficulty[weakest].accuracy+"%)."});
 if(!insights.length)insights.push({title:"Build your baseline",body:"Play more games to unlock more reliable trends."});
 return {games:games.length,score,accuracy,rangeLow:Math.max(0,Math.round(score-deviation(scores.slice(-5))*1.25)),rangeHigh:Math.round(score+deviation(scores.slice(-5))*1.25),correct:Math.round(accuracy/100*5),wrong:5-Math.round(accuracy/100*5),delta,rating:Math.max(0,currentRating+delta),rating5:Math.max(0,Math.round(currentRating+delta*5*.65)),rating10:Math.max(0,Math.round(currentRating+delta*10*.65)),last5:Math.round(average(changes.slice(-5))),confidence,difficulty,strongest,weakest,insights,history:scores.slice(-10)};
}
