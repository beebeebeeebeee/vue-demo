yarn build
cd dist
git init 
git add -A
git commit -m 'deploy'
git push -f https://github.com/beebeebeeebeee/vue-demo.git master:gh-pages
