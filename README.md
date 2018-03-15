# knex-passport-mysql

Anyone having connection issues with combining passport with mysql?

When you search for passport and mysql configuration for node this is the best source you could find, you can download from here https://github.com/manjeshpv/node-express-passport-mysql. But it has problem with connection. Its not stable at all. You can download and test it at the first place. Especially for you who new with node and passport.

So I tweak the config files a bit by simplifying the query with knex and voila, its freaking stable! Its because knex is async. Awesome trouble solving.

Install/setup your package:

* knex and mysql adapter
  - npm install knex --save
  - npm install mysql2 --save
  - See documentation here https://github.com/tgriesser/knex or http://knexjs.org/

* passport
  - npm install passport --save
  - See documentation http://www.passportjs.org/docs/downloads/html/

See and adapt this into your passport config. Any comments and input is so much appreciated for future development!
