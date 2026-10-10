import {execFileSync} from 'node:child_process';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
const appVersion='Harvest '+execFileSync('git',['rev-list','--count','HEAD'],{encoding:'utf8'}).trim();
export default defineConfig({define:{__ACOUNT_VERSION__:JSON.stringify(appVersion)},base:'./',plugins:[react(),{name:'app-version',generateBundle(){this.emitFile({type:'asset',fileName:'version.json',source:JSON.stringify({version:appVersion})});}}],css:{postcss:{plugins:[tailwindcss()]}},build:{outDir:'dist-pages',rollupOptions:{input:{main:'index.html',entry:'entry.html'}}}});
