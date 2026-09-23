// Non-destructive SVG viewports of the exact user-supplied artwork.
// Source pixels are embedded unchanged. Only the SVG viewport selects an artwork region.
import fs from 'node:fs';
const specs = {
 'research-network':[5,41,1298,87,82],
 'research-city':[5,158,1298,87,82],
 'research-fields':[5,273,1298,87,82],
 'research-reef':[5,388,1298,86,82],
 'campus-hague':[4,34,824,101,58],
 'campus-ui':[4,155,824,102,58],
 'campus-swadharma':[4,277,824,101,58],
 'campus-ui-diploma':[4,397,824,101,58],
 'skyline':[7,20,370,85,205],
 'systems-poster':[7,674,365,113,213],
 'ideas-poster':[7,846,365,94,213],
 'cap-product':[6,663,226,556,219],
 'matchup-product':[6,42,848,548,224],
 'lumbung-product':[6,652,848,550,224],
 'cap-monument':[5,49,791,193,125],
 'matchup-monument':[5,288,808,87,102],
 'lumbung-monument':[5,398,808,87,102]
};
const sizes={4:[1086,1448],5:[1024,1536],6:[1248,1260],7:[1536,1024]};
const data={};for(const [name,[n,x,y,w,h]] of Object.entries(specs)){
 data[n] ||= fs.readFileSync(`design/references/${n}.png`).toString('base64');
 const [sw,sh]=sizes[n];
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"><image width="${sw}" height="${sh}" href="data:image/png;base64,${data[n]}"/></svg>`;
 fs.writeFileSync(`assets/reference-art/${name}.svg`,svg);
}
fs.writeFileSync('brief/reference-art.json',JSON.stringify(specs,null,2));
console.log('Reference artwork viewports:',Object.keys(specs).length);
