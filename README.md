# install the dependencies for this project

npx create-react-app economic-indicators
cd economic-indicators

npm install -D tailwindcss@3.3.3 postcss@8.4.27 autoprefixer@10.4.14
npx tailwindcss init -p

npm install recharts
npm install @headlessui/react
npm install @heroicons/react

# to run

npm install
npm start
